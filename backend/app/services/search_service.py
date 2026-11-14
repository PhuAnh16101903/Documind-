import re
import math
from typing import List, Dict, Any, Optional
from rank_bm25 import BM25Okapi
from app.config import settings

class HybridSearchService:
    @staticmethod
    def tokenize(text: str) -> List[str]:
        """Simple whitespace & punctuation tokenizer for BM25"""
        return re.findall(r"\w+", text.lower())

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
        Combine BM25 keyword score and Semantic Vector score:
        Final_Score = alpha * Vector_Score + (1 - alpha) * BM25_Score
        """
        if not candidates:
            return []

        # 1. BM25 Scoring
        corpus = [cls.tokenize(c["content"]) for c in candidates]
        tokenized_query = cls.tokenize(query)
        
        bm25 = BM25Okapi(corpus)
        bm25_raw_scores = bm25.get_scores(tokenized_query)
        
        # Normalize BM25 scores to [0.0, 1.0]
        max_bm25 = max(bm25_raw_scores) if max(bm25_raw_scores) > 0 else 1.0
        bm25_norm_scores = [s / max_bm25 for s in bm25_raw_scores]

        # 2. Vector Scoring (Mock semantic similarity if embeddings not computed)
        vector_scores = []
        for idx, c in enumerate(candidates):
            # Check overlap of word stems / keywords as semantic surrogate
            overlap = len(set(tokenized_query).intersection(set(corpus[idx])))
            v_score = overlap / max(1, len(tokenized_query))
            vector_scores.append(v_score)

        # 3. Combine scores
        ranked = []
        for i, c in enumerate(candidates):
            final_score = alpha * vector_scores[i] + (1 - alpha) * bm25_norm_scores[i]
            if final_score > 0.05: # Relevance cutoff
                item = c.copy()
                item["score"] = round(float(final_score), 4)
                ranked.append(item)

        # Sort descending by score
        ranked.sort(key=lambda x: x["score"], reverse=True)
        return ranked[:top_k]
