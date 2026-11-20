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
    "của", "cua", "và", "va", "các", "cac", "có", "co", "được", "duoc",
    "trong", "là", "la", "cho", "về", "ve", "như", "nhu", "thế", "the",
    "nào", "nao", "một", "mot", "những", "nhung", "này", "nay", "khi",
    "để", "de", "ra", "với", "voi", "tại", "tai", "năm", "nam", "hãy",
    "hay", "gì", "gi", "bị", "bi", "bởi", "boi", "do", "từ", "tu",
    "lại", "lai", "đã", "da", "sẽ", "se", "đang", "dang",
    "cái", "cai", "tôi", "toi", "bạn", "ban", "mình", "minh", "nó", "no",
    "ý", "y", "ấy", "ay", "đó", "đây", "day", "kìa", "kia", "vậy", "vay",
    "thì", "thi", "mà", "ma", "nhỉ", "nhi", "nhé", "nhe", "ạ", "ơi", "oi",
    "hỏi", "hoi", "biết", "biet", "không", "khong", "nói", "noi", "xem",
    "file", "tệp", "tep", "báo", "bao", "cáo", "cao"
}

# L1 In-Memory High-Speed Cache for Hybrid Search
_HYBRID_SEARCH_CACHE: Dict[str, Tuple[float, List[Dict[str, Any]]]] = {}
CACHE_TTL_SECONDS = 300

QUERY_EXPANSIONS = {
    "tmdt": ["thuong mai dien tu", "website", "ecofresh"],
    "web": ["website", "thuong mai dien tu", "ecofresh", "cua hang truc tuyen"],
    "dich may": ["marianmt", "transformer", "viet anh", "de tai 51", "bleu", "beam search"],
    "de tai 51": ["dich may", "viet anh", "marianmt", "tri tue nhan tao"],
    "phuc vu": ["khach hang", "doi tuong", "muc tieu", "chan dung", "nguoi dung", "phan khuc"],
    "nhung ai": ["khach hang", "doi tuong", "muc tieu", "chan dung", "nguoi dung"],
    "cho ai": ["khach hang", "doi tuong", "muc tieu", "chan dung"],
    "danh cho ai": ["khach hang", "doi tuong", "muc tieu", "chan dung"],
    "muc dich": ["muc tieu", "y tuong", "ly do", "giai phap", "chien luoc"],
    "de lam gi": ["muc dich", "muc tieu", "y tuong", "ly do"],
    "kiem tien": ["doanh thu", "nguon thu", "mo hinh kinh doanh", "loi nhuan"],
    "doanh thu": ["nguon thu", "tai chinh", "doanh so", "loi nhuan", "dong tien"],
    "cong nghe": ["kien truc", "he thong", "backend", "frontend", "co so du lieu", "mysql", "restful", "mvc"],
    "chuc nang": ["tinh nang", "module", "dac ta", "yeu cau chuc nang", "giao dien", "tab"],
    "tinh nang": ["chuc nang", "module", "dac ta", "yeu cau chuc nang", "tab"],
    "thanh vien": ["nhom", "phan cong", "vai tro", "nhan su", "tac gia"],
}

class HybridSearchService:
    @staticmethod
    def clear_cache():
        """Clear search cache when documents are uploaded or updated"""
        global _HYBRID_SEARCH_CACHE
        _HYBRID_SEARCH_CACHE.clear()

    @staticmethod
    def is_toc_chunk(content: str) -> bool:
        """Detect Table of Contents chunks (e.g. multiple lines ending with 'Trang X')"""
        page_refs = len(re.findall(r"Trang\s+\d+", content))
        return page_refs >= 2 or "DANH MỤC CÁC BẢNG BIỂU" in content

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
        """Tokenizer for BM25 with stop words filtered and accents normalized"""
        raw_tokens = re.findall(r"\w+", text.lower())
        tokens = []
        for t in raw_tokens:
            unaccented = remove_vietnamese_tones(t)
            if t not in VIETNAMESE_STOP_WORDS and unaccented not in VIETNAMESE_STOP_WORDS and len(t) > 1:
                tokens.append(t)
                if unaccented != t and len(unaccented) > 1:
                    tokens.append(unaccented)
        return tokens

    @classmethod
    def rank_hybrid(
        cls,
        query: str,
        candidates: List[Dict[str, Any]],
        alpha: float = settings.HYBRID_ALPHA,
        top_k: int = settings.TOP_K_CHUNKS
    ) -> List[Dict[str, Any]]:
        if not candidates:
            return []

        # Filter out pure Table of Contents chunks so they don't pollute answers
        filtered_candidates = [c for c in candidates if not cls.is_toc_chunk(c.get("content", ""))]
        if not filtered_candidates:
            filtered_candidates = candidates

        corpus = [
            cls.tokenize(f"{c.get('document_title', '')} {c.get('heading', '')} {c.get('content', '')}")
            for c in filtered_candidates
        ]

        expanded_query_str = cls.expand_query_terms(query)
        tokenized_query = cls.tokenize(expanded_query_str)
        if not tokenized_query:
            tokenized_query = [w for w in re.findall(r"\w+", remove_vietnamese_tones(query.lower())) if len(w) > 1]
        if not tokenized_query:
            return filtered_candidates[:top_k]

        bm25 = BM25Okapi(corpus)
        bm25_raw_scores = bm25.get_scores(tokenized_query)
        max_bm25 = max(bm25_raw_scores) if max(bm25_raw_scores) > 0 else 1.0
        bm25_norm_scores = [s / max_bm25 for s in bm25_raw_scores]

        unique_query_terms = set(tokenized_query)
        vector_scores = []
        for idx in range(len(filtered_candidates)):
            overlap = len(unique_query_terms.intersection(set(corpus[idx])))
            v_score = overlap / max(1, len(unique_query_terms))
            vector_scores.append(v_score)

        ranked = []
        is_table_query = any(k in query.lower() for k in ["bang", "bảng", "so sanh", "so sánh", "danh muc"])

        for i, c in enumerate(filtered_candidates):
            candidate_terms = set(corpus[i])
            overlap_terms = unique_query_terms.intersection(candidate_terms)
            term_match_ratio = len(overlap_terms) / max(1, len(unique_query_terms))

            heading_text = (c.get("heading") or "").lower()
            heading_tokens = set(cls.tokenize(heading_text))
            heading_overlap = len(unique_query_terms.intersection(heading_tokens))
            heading_boost = 0.50 if heading_overlap >= 2 else (0.20 if heading_overlap == 1 else 0.0)

            table_penalty = 0.35 if "(bảng dữ liệu)" in heading_text and not is_table_query else 0.0

            final_score = alpha * vector_scores[i] + (1 - alpha) * bm25_norm_scores[i] + heading_boost - table_penalty
            final_score = max(0.01, final_score)

            item = c.copy()
            item["score"] = round(float(final_score), 4)
            item["term_match_ratio"] = round(term_match_ratio, 2)
            ranked.append(item)

        ranked.sort(key=lambda x: x["score"], reverse=True)
        return ranked[:top_k]
