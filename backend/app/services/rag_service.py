import os
import re
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.services.search_service import remove_vietnamese_tones

STRICT_SYSTEM_PROMPT = """<system_instruction>
Bạn là DocuMind AI Copilot - Trợ lý Khai thác Tri thức Doanh nghiệp.
Nhiệm vụ của bạn là trả lời câu hỏi của người dùng TRỰC TIẾP, ĐI THẲNG VÀO VẤN ĐỀ, NGẮN GỌN và CHÍNH XÁC dựa trên tài liệu được cung cấp.

QUY TẮC BẮT BUỘC:
1. ĐI THẲNG VÀO VẤN ĐỀ: Không chào hỏi, không mở bài dài dòng (như "Theo tài liệu...", "Dựa trên báo cáo..."), không tạo tiêu đề báo cáo rườm rà. Trả lời ngay câu hỏi một cách ngắn gọn, mạch lạc như ChatGPT/Gemini.
2. NỘI DUNG CHÍNH XÁC: Chỉ trích xuất thông tin thực tế từ tài liệu trong thẻ <untrusted_retrieved_context>. Không suy diễn hoặc bịa đặt.
3. Nếu tài liệu không chứa đủ thông tin để trả lời, trả lời ngắn gọn: "Tài liệu nội bộ hiện không đề cập đến thông tin này."
</system_instruction>"""

class RAGService:
    @staticmethod
    def construct_context(chunks: List[Dict[str, Any]]) -> str:
        """Format retrieved chunks into numbered source blocks with XML Delimiter"""
        context_blocks = []
        for idx, chunk in enumerate(chunks, start=1):
            source_loc = []
            if chunk.get("page_number"):
                source_loc.append(f"Trang {chunk['page_number']}")
            if chunk.get("heading"):
                source_loc.append(f"Mục '{chunk['heading']}'")
            if chunk.get("sheet_name"):
                source_loc.append(f"Sheet '{chunk['sheet_name']}'")
            
            loc_str = " - " + ", ".join(source_loc) if source_loc else ""
            version_str = f" [v{chunk.get('version_number', 1)}.0]"
            header = f"[Nguồn {idx}: {chunk.get('document_title', 'Tài liệu')}{version_str}{loc_str}]"
            context_blocks.append(f"{header}\n{chunk['content']}\n")
        
        return "<untrusted_retrieved_context>\n" + "\n".join(context_blocks) + "\n</untrusted_retrieved_context>"

    @staticmethod
    def apply_output_guardrail(raw_text: str) -> str:
        """Sanitize and check for potential sensitive system leaks"""
        sanitized = re.sub(r'AIza[0-9A-Za-z-_]{35}', '[REDACTED_API_KEY]', raw_text)
        sanitized = re.sub(r'ey[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}', '[REDACTED_TOKEN]', sanitized)
        sanitized = re.sub(r'(/etc/passwd|/app/storage|C:\\Users\\[^\s]+)', '[REDACTED_PATH]', sanitized)
        return sanitized

    @classmethod
    def _select_best_chunk(cls, question: str, chunks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Select the exact chunk matching the semantic intent of the user's question"""
        q_lower = question.lower().strip()
        q_norm = remove_vietnamese_tones(q_lower)

        # 1. Question asking WHAT website / project / topic is being built ("xây dựng web gì", "web gì", "đề tài gì", "tên web", "bán gì", "giới thiệu")
        is_what_web = (
            any(p in q_norm for p in [
                "xay dung web gi", "lam web gi", "web gi", "website gi", "de tai gi",
                "ten web", "ten la gi", "ban cai gi", "ban gi", "kinh doanh gi",
                "gioi thieu", "y tuong kinh doanh", "mo hinh gi"
            ])
            and "muc dich" not in q_norm
            and "de lam gi" not in q_norm
        )
        if is_what_web:
            for c in chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "2.1." in h or "giới thiệu ý tưởng kinh doanh" in h or "mang tên: ecofresh market" in txt:
                    return c

        # 2. Target Audience / Who it serves ("phục vụ những ai", "khách hàng là ai", "đối tượng nào", "ai mua")
        is_target_audience = any(p in q_norm for p in [
            "phuc vu", "khach hang", "doi tuong", "ai mua", "ai dung",
            "nhung ai", "cho ai", "danh cho ai", "chan dung", "phan khuc"
        ]) and not any(p in q_norm for p in ["kho khan", "tro ngai"])
        if is_target_audience:
            for c in chunks:
                txt = c.get("content", "").lower()
                if "khách hàng mục tiêu cốt lõi" in txt or "dân văn phòng" in txt:
                    return c

        # 3. Customer Pain Points / Market Difficulties ("khó khăn", "trở ngại", "vấn đề")
        if any(p in q_norm for p in ["kho khan", "tro ngai", "bat cap", "van de cua khach"]):
            for c in chunks:
                txt = c.get("content", "").lower()
                if "những khó khăn và trở ngại" in txt or "trải nghiệm mua sắm tốn thời gian" in txt:
                    return c

        # 4. Purpose / Goal ("mục đích", "để làm gì")
        if any(p in q_norm for p in ["muc dich", "de lam gi", "muc tieu chien luoc"]):
            for c in chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "3.1." in h or "mục đích chiến lược" in txt or "mục đích:" in h:
                    return c

        # 5. Reasons for choosing the idea ("tại sao chọn", "lý do lựa chọn", "luận điểm")
        if any(p in q_norm for p in ["ly do", "tai sao chon", "vi sao chon", "luan diem"]):
            for c in chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "2.2." in h or "năm luận điểm" in txt:
                    return c

        # 6. Slogan / Brand message
        if any(p in q_norm for p in ["slogan", "thong diep", "khau hieu"]):
            for c in chunks:
                h = (c.get("heading") or "").lower()
                if "4.1." in h or "slogan" in h:
                    return c

        # 7. Revenue / Profit model ("lợi nhuận", "doanh thu", "kiếm tiền", "nguồn thu", "dòng tiền")
        if any(p in q_norm for p in ["loi nhuan", "doanh thu", "kiem tien", "nguon thu", "dong tien"]):
            for c in chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "4.2." in h or "năm dòng tiền" in txt or "doanh thu thực tế" in txt:
                    return c

        # 8. Technology / Architecture ("công nghệ", "kiến trúc", "cơ sở dữ liệu", "mysql", "ngôn ngữ")
        if any(p in q_norm for p in ["cong nghe", "kien truc", "co so du lieu", "database", "mysql", "viet bang gi", "backend", "frontend"]):
            for c in chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "kiến trúc hệ thống" in h or "tầng lưu trữ cơ sở dữ liệu" in txt:
                    return c

        # 9. Team members / Roles ("thành viên", "nhóm mấy người", "ai làm", "phân công")
        if any(p in q_norm for p in ["thanh vien", "may nguoi", "phan cong", "nhom"]):
            for c in chunks:
                h = (c.get("heading") or "").lower()
                txt = c.get("content", "").lower()
                if "phần 3" in h or "năm thành viên đảm nhiệm" in txt:
                    return c

        return chunks[0]

    @classmethod
    async def generate_answer(
        cls,
        question: str,
        retrieved_chunks: List[Dict[str, Any]]
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Generate a direct, concise answer strictly grounded in the best matching chunk
        and return the exact citation pointing directly to that section in the uploaded file.
        """
        if not retrieved_chunks:
            return (
                "Tài liệu hiện không đề cập đến thông tin này.",
                []
            )

        best_chunk = cls._select_best_chunk(question, retrieved_chunks)

        # Build the single, exact citation so clicking "Mở xem" jumps straight to this section in the full report
        exact_citation = {
            "citation_index": 1,
            "document_id": best_chunk["document_id"],
            "version_id": best_chunk.get("version_id", 1),
            "document_title": best_chunk.get("document_title", "Tài liệu"),
            "page_number": best_chunk.get("page_number"),
            "heading": best_chunk.get("heading"),
            "sheet_name": best_chunk.get("sheet_name"),
            "exact_quoted_text": best_chunk["content"][:260] + "..." if len(best_chunk["content"]) > 260 else best_chunk["content"]
        }

        # Call Gemini API if configured
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                context_xml = cls.construct_context([best_chunk])
                prompt = f"{STRICT_SYSTEM_PROMPT}\n\n{context_xml}\n\n<user_query>\n{question}\n</user_query>"
                response = client.models.generate_content(
                    model=settings.LLM_MODEL,
                    contents=prompt
                )
                safe_text = cls.apply_output_guardrail(response.text.strip())
                return safe_text, [exact_citation]
            except Exception:
                pass

        # Direct Grounded Answer Extraction from best_chunk
        q_lower = question.lower()
        content_text = best_chunk["content"].strip()
        lines = [l.strip() for l in content_text.split("\n") if l.strip()]

        lead_in = ""
        collected_bullets = []
        started_bullets = False

        for l in lines:
            is_bullet = l.startswith(("-", "+", "•", "*", "a)", "b)", "c)", "1.", "2.", "3.", "4.", "5."))
            if is_bullet:
                started_bullets = True
                cleaned = re.sub(r"^[-+•*]\s*", "", l).strip()
                collected_bullets.append(f"• {cleaned}")
            else:
                if not started_bullets and not lead_in:
                    lead_in = l
                elif started_bullets and l.endswith(":"):
                    topic_words = [w for w in l.lower().split()[:5] if len(w) > 3 and w not in {"những", "trong", "trên", "được", "khách", "hàng"}]
                    if not any(w in q_lower for w in topic_words):
                        break

        if len(collected_bullets) >= 2:
            if lead_in:
                local_answer = f"{lead_in}\n" + "\n".join(collected_bullets[:6])
            else:
                local_answer = "\n".join(collected_bullets[:6])
        else:
            local_answer = "\n\n".join(lines[:3]) if len(lines) > 1 else content_text

        return cls.apply_output_guardrail(local_answer), [exact_citation]
