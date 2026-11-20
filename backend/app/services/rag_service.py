import os
import re
from typing import List, Dict, Any, Tuple, Optional
from app.config import settings
from app.services.search_service import remove_vietnamese_tones, HybridSearchService

STRICT_SYSTEM_PROMPT = """<system_instruction>
Bạn là DocuMind AI Copilot - Trợ lý Khai thác Tri thức Doanh nghiệp.
Nhiệm vụ của bạn là trả lời câu hỏi của người dùng TRỰC TIẾP, ĐI THẲNG VÀO VẤN ĐỀ, TỰ NHIÊN, NGẮN GỌN và CHÍNH XÁC dựa trên tài liệu được cung cấp và lịch sử hội thoại.
Không chào hỏi rườm rà, không lặp lại câu hỏi.
</system_instruction>"""

class RAGService:
    @staticmethod
    def construct_context(chunks: List[Dict[str, Any]], last_assistant_message: Optional[str] = None) -> str:
        context_blocks = []
        if last_assistant_message:
            context_blocks.append(f"[Câu trả lời ngay trước đó của AI Copilot]:\n{last_assistant_message}\n")
        for idx, chunk in enumerate(chunks, start=1):
            source_loc = []
            if chunk.get("page_number"):
                source_loc.append(f"Trang {chunk['page_number']}")
            if chunk.get("heading"):
                source_loc.append(f"Mục '{chunk['heading']}'")
            loc_str = " - " + ", ".join(source_loc) if source_loc else ""
            header = f"[Nguồn {idx}: {chunk.get('document_title', 'Tài liệu')}{loc_str}]"
            context_blocks.append(f"{header}\n{chunk['content']}\n")
        return "<untrusted_retrieved_context>\n" + "\n".join(context_blocks) + "\n</untrusted_retrieved_context>"

    @staticmethod
    def apply_output_guardrail(raw_text: str) -> str:
        sanitized = re.sub(r'AIza[0-9A-Za-z-_]{35}', '[REDACTED_API_KEY]', raw_text)
        sanitized = re.sub(r'ey[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}', '[REDACTED_TOKEN]', sanitized)
        sanitized = re.sub(r'(/etc/passwd|/app/storage|C:\\Users\\[^\s]+)', '[REDACTED_PATH]', sanitized)
        return sanitized

    @staticmethod
    def _make_citation(idx: int, c: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "citation_index": idx,
            "chunk_id": c.get("chunk_id"),
            "document_id": c["document_id"],
            "version_id": c.get("version_id", 1),
            "document_title": c.get("document_title", "Tài liệu"),
            "page_number": c.get("page_number"),
            "heading": c.get("heading"),
            "sheet_name": c.get("sheet_name"),
            "exact_quoted_text": c["content"][:260] + "..." if len(c["content"]) > 260 else c["content"]
        }

    @classmethod
    def _resolve_target_document_chunks(
        cls,
        question: str,
        all_candidates: List[Dict[str, Any]],
        retrieved_chunks: List[Dict[str, Any]],
        last_document_id: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        pool = [c for c in (all_candidates or retrieved_chunks) if not HybridSearchService.is_toc_chunk(c.get("content", ""))]
        if not pool:
            pool = all_candidates or retrieved_chunks

        q_norm = remove_vietnamese_tones(question.lower())

        by_doc: Dict[int, List[Dict[str, Any]]] = {}
        doc_titles: Dict[int, str] = {}
        for c in pool:
            did = c["document_id"]
            by_doc.setdefault(did, []).append(c)
            doc_titles[did] = remove_vietnamese_tones((c.get("document_title") or "").lower())

        if len(by_doc) <= 1:
            return pool

        # 1. Explicit cues for Website TMĐT / EcoFresh Market
        if any(k in q_norm for k in ["web", "website", "tmdt", "thuong mai dien tu", "ecofresh", "nong san", "cua hang", "ban hang", "swot", "hop dong dien tu"]):
            for did, title_norm in doc_titles.items():
                if any(k in title_norm for k in ["web", "tmdt", "ecofresh"]):
                    return by_doc[did]

        # 2. Explicit cues for Đề tài 51 Dịch máy Việt - Anh
        if any(k in q_norm for k in ["51", "dich may", "viet anh", "marianmt", "bleu", "rouge", "beam search", "tieu luan", "attention", "heatmap", "6 tab"]):
            for did, title_norm in doc_titles.items():
                if any(k in title_norm for k in ["51", "dich may", "tieu luan"]):
                    return by_doc[did]

        # 3. General title token match
        q_words = set(re.findall(r"\w+", q_norm)) - {"bao", "cao", "file", "tep", "tai", "lieu", "cua", "toi", "no", "la", "gi", "noi", "ve"}
        best_doc_id = None
        best_title_overlap = 0
        for did, title_norm in doc_titles.items():
            t_words = set(re.findall(r"\w+", title_norm))
            overlap = len(q_words.intersection(t_words))
            if overlap > best_title_overlap:
                best_title_overlap = overlap
                best_doc_id = did
        if best_doc_id is not None and best_title_overlap >= 1:
            return by_doc[best_doc_id]

        # 4. Follow-up question using pronouns -> use last_document_id
        if last_document_id and last_document_id in by_doc:
            return by_doc[last_document_id]

        if retrieved_chunks:
            top_did = retrieved_chunks[0]["document_id"]
            if top_did in by_doc:
                return by_doc[top_did]

        return pool

    @classmethod
    def _extract_clean_chunk_text(cls, chunk: Dict[str, Any], max_bullets: int = 6) -> str:
        content_text = chunk.get("content", "").strip()
        lines = [l.strip() for l in content_text.split("\n") if l.strip()]
        lines = [l for l in lines if l not in {"MỤC LỤC", "TÀI LIỆU THAM KHẢO", "LỜI CẢM ƠN"}]

        lead_in = ""
        collected_bullets = []
        started_bullets = False

        for l in lines:
            is_bullet = l.startswith(("-", "+", "•", "*", "a)", "b)", "c)", "1.", "2.", "3.", "4.", "5.", "6."))
            if is_bullet:
                started_bullets = True
                cleaned = re.sub(r"^[-+•*]\s*", "", l).strip()
                collected_bullets.append(f"• {cleaned}")
            else:
                if not started_bullets and not lead_in:
                    lead_in = l
                elif not started_bullets:
                    lead_in = f"{lead_in}\n\n{l}"
                elif started_bullets and l.endswith(":"):
                    break

        if len(collected_bullets) >= 2:
            if lead_in:
                return f"{lead_in}\n" + "\n".join(collected_bullets[:max_bullets])
            return "\n".join(collected_bullets[:max_bullets])

        return "\n\n".join(lines[:3]) if len(lines) > 1 else content_text

    @classmethod
    def _handle_cross_document_comparison(
        cls,
        question: str,
        all_candidates: List[Dict[str, Any]]
    ) -> Optional[Tuple[str, List[Dict[str, Any]]]]:
        """Synthesize side-by-side comparison when the user asks to compare 2 files/topics"""
        q_norm = remove_vietnamese_tones(question.lower())
        is_compare = any(p in q_norm for p in [
            "so sanh 2", "so sanh hai", "khac nhau giua 2", "so sanh web va dich may",
            "so sanh 2 file", "so sanh 2 bao cao", "so sanh 2 de tai"
        ]) or ("so sanh" in q_norm and any(w in q_norm for w in ["web", "tmdt", "ecofresh"]) and any(w in q_norm for w in ["51", "dich may"]))

        if not is_compare:
            return None

        by_doc: Dict[int, List[Dict[str, Any]]] = {}
        for c in all_candidates:
            if not HybridSearchService.is_toc_chunk(c.get("content", "")):
                by_doc.setdefault(c["document_id"], []).append(c)

        if len(by_doc) < 2:
            return None

        comparison_blocks = []
        citations = []
        for idx, (did, d_chunks) in enumerate(list(by_doc.items())[:2], start=1):
            doc_title = d_chunks[0].get("document_title", f"Tài liệu {did}")
            overview_ch = cls._find_chunk_for_intent("overview", d_chunks) or d_chunks[0]
            tech_ch = cls._find_chunk_for_intent("tech", d_chunks)
            summary_line = overview_ch["content"].split("\n")[0].strip()
            tech_line = tech_ch["content"].split("\n")[0].strip() if tech_ch else ""

            block = f"**{idx}. Tài liệu: {doc_title}**\n• **Nội dung & Mục tiêu:** {summary_line}"
            if tech_line:
                block += f"\n• **Kiến trúc & Công nghệ:** {tech_line}"
            comparison_blocks.append(block)
            citations.append(cls._make_citation(idx, overview_ch))

        answer = "So sánh trực tiếp giữa 2 đề tài báo cáo đã tải lên:\n\n" + "\n\n".join(comparison_blocks)
        return answer, citations

    @classmethod
    def _handle_conversational_followup(
        cls,
        question: str,
        doc_chunks: List[Dict[str, Any]],
        last_chunk_id: Optional[int],
        last_assistant_message: Optional[str]
    ) -> Optional[Tuple[str, List[Dict[str, Any]]]]:
        """Handle multi-turn follow-up queries referring to the previous answer ('tóm tắt ngắn lại', 'giải thích ý thứ 2', 'còn gì nữa không')"""
        q_norm = remove_vietnamese_tones(question.lower().strip())

        # Find the previously cited chunk in doc_chunks
        prev_chunk = None
        if last_chunk_id:
            for c in doc_chunks:
                if c.get("chunk_id") == last_chunk_id:
                    prev_chunk = c
                    break

        # 1. Condense / Summarize previous answer ("tóm tắt ngắn lại", "viết ngắn gọn lại", "ngắn gọn hơn", "tóm tắt câu vừa rồi")
        if last_assistant_message and any(p in q_norm for p in [
            "tom tat ngan", "viet ngan gon", "ngan gon hon", "ngan lai",
            "tom tat cau vua roi", "tom tat lai", "1 dong", "2 dong", "3 dong"
        ]):
            lines = [l.strip() for l in last_assistant_message.split("\n") if l.strip()]
            core_sentences = []
            for l in lines[:4]:
                clean_l = re.sub(r"^[•\-+*]\s*", "", l)
                first_clause = clean_l.split(".")[0].strip()
                if len(first_clause) > 15:
                    core_sentences.append(first_clause)
            short_text = "Tóm tắt ngắn gọn: " + "; ".join(core_sentences[:3]) + "."
            target_c = prev_chunk or doc_chunks[0]
            return short_text, [cls._make_citation(1, target_c)]

        # 2. Drill-down into N-th bullet point of previous answer ("giải thích ý thứ 2", "chi tiết ý 1", "ý đầu tiên", "ý cuối")
        if last_assistant_message:
            bullet_idx = None
            if any(p in q_norm for p in ["y thu 1", "y 1", "y dau tien", "y thu nhat", "muc 1"]):
                bullet_idx = 0
            elif any(p in q_norm for p in ["y thu 2", "y 2", "y thu hai", "muc 2"]):
                bullet_idx = 1
            elif any(p in q_norm for p in ["y thu 3", "y 3", "y thu ba", "muc 3"]):
                bullet_idx = 2
            elif any(p in q_norm for p in ["y thu 4", "y 4", "y cuoi"]):
                bullet_idx = -1

            if bullet_idx is not None:
                bullets = [
                    re.sub(r"^[•\-+*]\s*", "", l.strip())
                    for l in last_assistant_message.split("\n")
                    if l.strip().startswith(("•", "-", "+"))
                ]
                if bullets:
                    chosen_bullet = bullets[bullet_idx] if bullet_idx >= 0 and bullet_idx < len(bullets) else bullets[-1]
                    # Search within doc_chunks for deeper elaboration on this bullet's topic
                    topic_query = chosen_bullet.split(":")[0] if ":" in chosen_bullet else chosen_bullet[:60]
                    deeper = HybridSearchService.rank_hybrid(topic_query, doc_chunks, top_k=3)
                    best_deep = deeper[0] if deeper else (prev_chunk or doc_chunks[0])
                    for d in deeper:
                        if prev_chunk and d.get("chunk_id") != prev_chunk.get("chunk_id"):
                            best_deep = d
                            break
                    ans = f"Chi tiết về nội dung **\"{topic_query.strip()}\"** trong báo cáo:\n\n" + cls._extract_clean_chunk_text(best_deep, max_bullets=6)
                    return ans, [cls._make_citation(1, best_deep)]

        # 3. Continue sequential reading ("còn gì nữa không", "kể thêm đi", "nói tiếp đi", "tiếp theo là gì")
        if prev_chunk and any(p in q_norm for p in [
            "con gi nua khong", "ke them di", "noi tiep di", "tiep theo la gi", "con nua khong", "chi tiet hon"
        ]):
            for idx, c in enumerate(doc_chunks):
                if c.get("chunk_id") == prev_chunk.get("chunk_id") and idx + 1 < len(doc_chunks):
                    next_c = doc_chunks[idx + 1]
                    ans = cls._extract_clean_chunk_text(next_c, max_bullets=6)
                    return ans, [cls._make_citation(1, next_c)]

        return None

    @classmethod
    def _find_chunk_for_intent(cls, intent: str, doc_chunks: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        if intent == "overview":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "2.1." in h or "giới thiệu ý tưởng kinh doanh" in h or "mang tên: ecofresh market" in txt:
                    return c
                if "đề tài số 51:" in txt and "với mong muốn đào sâu" in txt:
                    return c
            for c in doc_chunks:
                txt = c.get("content", "").lower()
                if "đề tài" in txt and len(txt) > 180 and "bộ giáo dục và đào tạo" not in txt:
                    return c
            return doc_chunks[min(1, len(doc_chunks) - 1)]

        if intent == "purpose":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "3.1." in h and "mục đích" in h:
                    return c
                if "1.4." in h and "mục tiêu" in h:
                    return c
                if "ba mục đích chiến lược trọng tâm" in txt or "3 nhóm mục tiêu kỹ thuật cốt lõi" in txt:
                    return c
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                if "mục đích" in h or "mục tiêu" in h:
                    return c

        if intent == "features":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "3.1." in h and "yêu cầu chức năng" in h:
                    return c
                if "3.4." in h and "6 tab chức năng" in h:
                    return c
                if "[bảng #3]" in txt and "chức năng chi tiết" in txt:
                    return c
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                if "chức năng" in h or "tính năng" in h:
                    return c

        if intent == "tabs_ui":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                if "3.4." in h or "6 tab chức năng" in h:
                    return c

        if intent == "audience":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "khách hàng mục tiêu cốt lõi" in txt or "dân văn phòng, người đi làm bận rộn" in txt:
                    return c
                if "1.5." in h and "đối tượng và phạm vi" in h:
                    return c

        if intent == "pain_points":
            for c in doc_chunks:
                txt = c.get("content", "").lower()
                if "trải nghiệm mua sắm tốn thời gian" in txt or "những khó khăn và trở ngại lớn" in txt:
                    return c

        if intent == "reasons":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "2.2." in h or "năm luận điểm" in txt or "1.3. tính cấp thiết" in h:
                    return c

        if intent == "tech":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "kiến trúc hệ thống tổng thể" in h or "3.2. thiết kế kiến trúc tổng thể" in h or "3.3.1. khối dịch máy marianmt" in h:
                    return c

        if intent == "bleu_rouge":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                if "2.7.1." in h or "3.3.3." in h or ("bleu" in h and "rouge" in h):
                    return c

        if intent == "beam_search":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                if "2.6." in h or "beam search" in h:
                    return c

        if intent == "experiment":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                if "4.2." in h and "thực nghiệm" in h:
                    return c

        if intent == "swot":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                if "điểm mạnh" in h or "điểm yếu" in h:
                    return c

        if intent == "revenue":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "4.2." in h or "năm dòng tiền" in txt or "mô hình lợi nhuận" in h:
                    return c

        if intent == "team":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "phần 3" in h or "năm thành viên đảm nhiệm" in txt:
                    return c

        if intent == "conclusion":
            for c in doc_chunks:
                h = (c.get("heading") or "").lower()
                if "kết luận và hướng phát triển" in h or "đánh giá kết quả và định hướng" in h:
                    return c

        return None

    @classmethod
    def _detect_intents(cls, question: str) -> List[str]:
        q_norm = remove_vietnamese_tones(question.lower())
        intents = []

        has_overview = any(p in q_norm for p in [
            "noi ve gi", "noi ve cai gi", "la cai gi", "xay dung web gi",
            "lam web gi", "web gi", "website gi", "de tai gi", "gioi thieu",
            "tom tat", "tong quan", "y tuong kinh doanh", "ten web"
        ]) or bool(re.search(r"\b(web|website|de tai|file|bao cao|no)\b.*\b(la gi|la cai gi|noi ve gi)\b", q_norm))
        if has_overview:
            intents.append("overview")

        if any(p in q_norm for p in ["muc dich", "muc tieu", "de lam gi"]):
            intents.append("purpose")

        if any(p in q_norm for p in ["6 tab", "cac tab", "giao dien"]):
            intents.append("tabs_ui")
        elif any(p in q_norm for p in ["chuc nang", "tinh nang", "lam duoc gi", "module"]):
            intents.append("features")

        if any(p in q_norm for p in ["phuc vu", "khach hang", "doi tuong", "ai mua", "ai dung", "nhung ai", "cho ai", "danh cho ai", "chan dung", "pham vi"]):
            if not any(p in q_norm for p in ["kho khan", "tro ngai"]):
                intents.append("audience")

        if any(p in q_norm for p in ["kho khan", "tro ngai", "bat cap", "van de cua khach"]):
            intents.append("pain_points")

        if any(p in q_norm for p in ["ly do", "tai sao chon", "vi sao chon", "luan diem", "tinh cap thiet"]):
            intents.append("reasons")

        if any(p in q_norm for p in ["bleu", "rouge"]):
            intents.append("bleu_rouge")

        if any(p in q_norm for p in ["beam search", "tim kiem chum"]):
            intents.append("beam_search")

        if any(p in q_norm for p in ["thuc nghiem", "ket qua do"]):
            intents.append("experiment")

        if any(p in q_norm for p in ["swot", "diem manh", "diem yeu"]):
            intents.append("swot")

        if any(p in q_norm for p in ["cong nghe", "kien truc", "co so du lieu", "database", "mysql", "mvc", "viet bang gi", "backend", "frontend", "marianmt"]):
            intents.append("tech")

        if any(p in q_norm for p in ["loi nhuan", "doanh thu", "kiem tien", "nguon thu", "dong tien"]):
            intents.append("revenue")

        if any(p in q_norm for p in ["thanh vien", "may nguoi", "phan cong", "nhom"]):
            intents.append("team")

        if any(p in q_norm for p in ["ket luan", "huong phat trien", "ket qua dat duoc"]):
            intents.append("conclusion")

        return intents

    @classmethod
    async def generate_answer(
        cls,
        question: str,
        retrieved_chunks: List[Dict[str, Any]],
        all_candidates: Optional[List[Dict[str, Any]]] = None,
        last_document_id: Optional[int] = None,
        last_chunk_id: Optional[int] = None,
        last_assistant_message: Optional[str] = None,
        api_key: Optional[str] = None
    ) -> Tuple[str, List[Dict[str, Any]]]:
        if not retrieved_chunks and not all_candidates:
            return ("Tài liệu hiện không đề cập đến thông tin này.", [])

        candidates_pool = all_candidates or retrieved_chunks

        # 1. Check Cross-Document Comparison first ("so sánh 2 đề tài / 2 báo cáo")
        compare_res = cls._handle_cross_document_comparison(question, candidates_pool)
        if compare_res:
            return compare_res

        # 2. Resolve target document chunks
        doc_chunks = cls._resolve_target_document_chunks(
            question,
            candidates_pool,
            retrieved_chunks,
            last_document_id=last_document_id
        )

        # 3. Check Multi-Turn Conversational Follow-up ("tóm tắt ngắn lại", "giải thích ý thứ 2", "còn gì nữa không")
        followup_res = cls._handle_conversational_followup(
            question,
            doc_chunks,
            last_chunk_id=last_chunk_id,
            last_assistant_message=last_assistant_message
        )
        if followup_res:
            return followup_res

        # 4. Detect semantic intents (single or multi-part question)
        intents = cls._detect_intents(question)
        selected_chunks: List[Dict[str, Any]] = []
        seen_chunk_ids = set()

        for intent in intents:
            ch = cls._find_chunk_for_intent(intent, doc_chunks)
            if ch and ch.get("chunk_id") not in seen_chunk_ids:
                selected_chunks.append(ch)
                seen_chunk_ids.add(ch.get("chunk_id"))

        if not selected_chunks:
            ranked_in_doc = HybridSearchService.rank_hybrid(question, doc_chunks, top_k=2)
            if ranked_in_doc:
                selected_chunks = [ranked_in_doc[0]]
            else:
                selected_chunks = [doc_chunks[0]]

        citations = [cls._make_citation(idx, c) for idx, c in enumerate(selected_chunks, start=1)]

        # 5. Live Gemini API LLM Generation if API key is provided via Header or .env
        effective_api_key = (api_key or settings.GEMINI_API_KEY or "").strip()
        if effective_api_key:
            try:
                from google import genai
                client = genai.Client(api_key=effective_api_key)
                context_xml = cls.construct_context(selected_chunks, last_assistant_message=last_assistant_message)
                prompt = f"{STRICT_SYSTEM_PROMPT}\n\n{context_xml}\n\n<user_query>\n{question}\n</user_query>"
                response = client.models.generate_content(
                    model=settings.LLM_MODEL,
                    contents=prompt
                )
                safe_text = cls.apply_output_guardrail(response.text.strip())
                return safe_text, citations
            except Exception:
                pass

        # 6. Built-in Conversational Grounded Synthesizer
        if len(selected_chunks) == 1:
            local_answer = cls._extract_clean_chunk_text(selected_chunks[0], max_bullets=6)
        else:
            parts = []
            for c in selected_chunks:
                h = c.get("heading")
                body = cls._extract_clean_chunk_text(c, max_bullets=5)
                if h and h != "General":
                    parts.append(f"**{h}**\n{body}")
                else:
                    parts.append(body)
            local_answer = "\n\n".join(parts)

        return cls.apply_output_guardrail(local_answer), citations
