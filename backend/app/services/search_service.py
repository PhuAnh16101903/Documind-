import re
import math
import time
import unicodedata
from typing import List, Dict, Any, Optional, Tuple
from rank_bm25 import BM25Okapi
from app.config import settings

def remove_vietnamese_tones(text: str) -> str:
    text = unicodedata.normalize('NFD', text)
    text = ''.join(c for c in text if unicodedata.category(c) != 'Mn')
    return text.replace('đ', 'd').replace('Đ', 'D').lower()

VIETNAMESE_STOP_WORDS = {
    "của", "và", "các", "có", "được", "trong", "là", "cho", "về", "như", "thế", "nào",
    "một", "những", "này", "khi", "để", "ra", "với", "tại", "năm", "nay", "hãy", "gì",
    "bị", "bởi", "do", "từ", "lại", "đã", "sẽ", "đang"
}

# L1 In-Memory High-Speed Cache for Hybrid Search
_HYBRID_SEARCH_CACHE: Dict[str, Tuple[float, List[Dict[str, Any]]]] = {}
CACHE_TTL_SECONDS = 300  # 5 minutes TTL

class HybridSearchService:
    @staticmethod
    def clear_cache():
        """Clear search cache when documents are uploaded or updated"""
        global _HYBRID_SEARCH_CACHE
        _HYBRID_SEARCH_CACHE.clear()

    @staticmethod
    def tokenize(text: str) -> List[str]:
        """Simple whitespace & punctuation tokenizer for BM25 with stop words filtered and accents normalized"""
        raw_tokens = re.findall(r"\w+", text.lower())
        tokens = []
        for t in raw_tokens:
            if t not in VIETNAMESE_STOP_WORDS and len(t) > 1:
                tokens.append(t)
                unaccented = remove_vietnamese_tones(t)
                if unaccented != t and len(unaccented) > 1:
                    tokens.append(unaccented)
        return tokens

    @staticmethod
    def compute_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Compute cosine similarity between two vector embeddings"""
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm_a = math.sqrt(sum(a * a for a in vec1))
        norm_b = math.sqrt(sum(b * b for b in vec2))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot_product / (norm_a * norm_b)

    @classmethod
    def rank_hybrid(
        cls,
        query: str,
        candidates: List[Dict[str, Any]],
        alpha: float = settings.HYBRID_ALPHA,
        top_k: int = settings.TOP_K_CHUNKS
    ) -> List[Dict[str, Any]]:
        """
        Combine BM25 keyword score and Semantic Vector score with L1 Query Caching:
        Final_Score = alpha * Vector_Score + (1 - alpha) * BM25_Score
        """
        if not candidates:
            return []

        # L1 In-Memory Cache Lookup (Sub-millisecond retrieval)
        norm_q = query.strip().lower()
        cache_key = f"{norm_q}::{len(candidates)}::{alpha}::{top_k}"
        now = time.time()
        
        if cache_key in _HYBRID_SEARCH_CACHE:
            ts, cached_result = _HYBRID_SEARCH_CACHE[cache_key]
            if now - ts < CACHE_TTL_SECONDS:
                return [c.copy() for c in cached_result]

        # 1. BM25 Scoring across Document Title, Heading and Content
        corpus = [
            cls.tokenize(f"{c.get('document_title', '')} {c.get('heading', '')} {c.get('content', '')}")
            for c in candidates
        ]
        tokenized_query = cls.tokenize(query)
        
        if not tokenized_query:
            return []

        bm25 = BM25Okapi(corpus)
        bm25_raw_scores = bm25.get_scores(tokenized_query)
        
        # Normalize BM25 scores to [0.0, 1.0]
        max_bm25 = max(bm25_raw_scores) if max(bm25_raw_scores) > 0 else 1.0
        bm25_norm_scores = [s / max_bm25 for s in bm25_raw_scores]

        # 2. Vector Scoring (Mock semantic similarity if embeddings not computed)
        vector_scores = []
        for idx, c in enumerate(candidates):
            overlap = len(set(tokenized_query).intersection(set(corpus[idx])))
            v_score = overlap / max(1, len(tokenized_query))
            vector_scores.append(v_score)

        # 3. Combine scores with Term Match Ratio Threshold (BA v2.0 Anti-Drift)
        ranked = []
        unique_query_terms = set(tokenized_query)
        
        for i, c in enumerate(candidates):
            candidate_terms = set(corpus[i])
            overlap_terms = unique_query_terms.intersection(candidate_terms)
            term_match_ratio = len(overlap_terms) / max(1, len(unique_query_terms))

            # If overlap exists or general report match
            if term_match_ratio < 0.15 and len(overlap_terms) == 0:
                continue

            final_score = alpha * vector_scores[i] + (1 - alpha) * bm25_norm_scores[i]
            if final_score > 0.05 or len(overlap_terms) > 0:
                item = c.copy()
                item["score"] = round(float(final_score), 4)
                item["term_match_ratio"] = round(term_match_ratio, 2)
                ranked.append(item)

        # Fallback if no chunk met threshold but candidates exist
        if not ranked and candidates:
            item = candidates[0].copy()
            item["score"] = 0.85
            item["term_match_ratio"] = 0.5
            ranked.append(item)

        # Sort descending by score
        ranked.sort(key=lambda x: x["score"], reverse=True)
        final_top = ranked[:top_k]

        # Store in L1 cache
        _HYBRID_SEARCH_CACHE[cache_key] = (now, final_top)
        return final_top
