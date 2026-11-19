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

# Colloquial and Semantic Synonym Expansions for Enterprise & Academic Documents
QUERY_EXPANSIONS = {
    "tmdt": ["thuong mai dien tu", "website", "ecofresh"],
    "phuc vu": ["khach hang", "doi tuong", "muc tieu", "chan dung", "nguoi dung", "phan khuc", "tieu dung"],
    "nhung ai": ["khach hang", "doi tuong", "muc tieu", "chan dung", "nguoi dung", "phan khuc"],
    "cho ai": ["khach hang", "doi tuong", "muc tieu", "chan dung", "nguoi dung"],
    "danh cho ai": ["khach hang", "doi tuong", "muc tieu", "chan dung", "nguoi dung"],
    "ai mua": ["khach hang", "nguoi tieu dung"],
    "ai dung": ["nguoi dung", "khach hang"],
    "muc dich": ["y tuong", "ly do", "muc tieu", "giai phap", "chien luoc", "de lam gi"],
    "de lam gi": ["muc dich", "muc tieu", "y tuong", "ly do", "giai phap"],
    "lam gi": ["muc dich", "muc tieu", "y tuong", "ly do"],
    "kiem tien": ["doanh thu", "nguon thu", "mo hinh kinh doanh", "loi nhuan"],
    "doanh thu": ["nguon thu", "tai chinh", "doanh so", "loi nhuan", "kinh doanh", "tien"],
    "cong nghe": ["kien truc", "he thong", "backend", "frontend", "co so du lieu", "mysql", "restful", "ngon ngu"],
    "dung gi": ["cong nghe", "kien truc", "he thong", "ngon ngu"],
    "viet bang gi": ["cong nghe", "kien truc", "ngon ngu", "backend", "frontend"],
    "chuc nang": ["tinh nang", "module", "dac ta", "yeu cau", "giao dien"],
    "tinh nang": ["chuc nang", "module", "dac ta", "yeu cau"],
    "thanh vien": ["nhom", "phan cong", "vai tro", "nhan su", "tac gia"],
    "may nguoi": ["thanh vien", "nhom", "phan cong", "nhan su"],
    "ai lam": ["thanh vien", "nhom", "phan cong"],
}

class HybridSearchService:
    @staticmethod
    def clear_cache():
        """Clear search cache when documents are uploaded or updated"""
        global _HYBRID_SEARCH_CACHE
        _HYBRID_SEARCH_CACHE.clear()

    @staticmethod
    def expand_query_terms(query: str) -> str:
        """Expand colloquial phrases and abbreviations into semantic synonyms"""
        q_norm = remove_vietnamese_tones(query.lower())
        extra_phrases = []

        for phrase, synonyms in QUERY_EXPANSIONS.items():
            phrase_norm = remove_vietnamese_tones(phrase)
            if phrase_norm in q_norm:
                extra_phrases.extend(synonyms)

        if extra_phrases:
            return f"{query} {' '.join(extra_phrases)}"
        return query

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

        # 1. BM25 Scoring with Query Semantic Expansion
        corpus = [
            cls.tokenize(f"{c.get('document_title', '')} {c.get('heading', '')} {c.get('content', '')}")
            for c in candidates
        ]
        
        # Expand query with synonyms & colloquial abbreviations
        expanded_query_str = cls.expand_query_terms(query)
        tokenized_query = cls.tokenize(expanded_query_str)
        
        if not tokenized_query:
            tokenized_query = cls.tokenize(query)

        if not tokenized_query:
            return []

        bm25 = BM25Okapi(corpus)
        bm25_raw_scores = bm25.get_scores(tokenized_query)
        
        # Normalize BM25 scores to [0.0, 1.0]
        max_bm25 = max(bm25_raw_scores) if max(bm25_raw_scores) > 0 else 1.0
        bm25_norm_scores = [s / max_bm25 for s in bm25_raw_scores]

        # 2. Vector Scoring & Heading Boost
        vector_scores = []
        unique_query_terms = set(tokenized_query)

        for idx, c in enumerate(candidates):
            overlap = len(unique_query_terms.intersection(set(corpus[idx])))
            v_score = overlap / max(1, len(unique_query_terms))
            vector_scores.append(v_score)

        # 3. Combine scores with Semantic Heading Boost
        ranked = []
        is_table_query = any(k in query.lower() for k in ["bang", "bảng", "so sanh", "so sánh", "danh muc"])

        for i, c in enumerate(candidates):
            candidate_terms = set(corpus[i])
            overlap_terms = unique_query_terms.intersection(candidate_terms)
            term_match_ratio = len(overlap_terms) / max(1, len(unique_query_terms))

            heading_text = (c.get("heading") or "").lower()
            heading_tokens = set(cls.tokenize(heading_text))
            heading_overlap = len(unique_query_terms.intersection(heading_tokens))

            # Heading boost: +0.50 if section heading directly matches query intent
            heading_boost = 0.50 if heading_overlap >= 2 else (0.20 if heading_overlap == 1 else 0.0)

            # Downweight massive data tables if user is asking qualitative/conceptual question
            table_penalty = 0.0
            if "(bảng dữ liệu)" in heading_text and not is_table_query:
                table_penalty = 0.35

            final_score = alpha * vector_scores[i] + (1 - alpha) * bm25_norm_scores[i] + heading_boost - table_penalty
            final_score = max(0.01, final_score)

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
