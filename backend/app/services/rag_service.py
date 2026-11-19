import os
import re
from typing import List, Dict, Any, Tuple
from app.config import settings

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
        """
        BA v2.0 Output Guardrail:
        Sanitize and check for potential sensitive system leaks or prompt leakage.
        """
        # Block leaked API keys or JWT tokens
        sanitized = re.sub(r'AIza[0-9A-Za-z-_]{35}', '[REDACTED_API_KEY]', raw_text)
        sanitized = re.sub(r'ey[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}', '[REDACTED_TOKEN]', sanitized)
        # Block server path traversal outputs
        sanitized = re.sub(r'(/etc/passwd|/app/storage|C:\\Users\\[^\s]+)', '[REDACTED_PATH]', sanitized)
        return sanitized

    @classmethod
    async def generate_answer(
        cls,
        question: str,
        retrieved_chunks: List[Dict[str, Any]]
    ) -> Tuple[str, List[Dict[str, Any]]]:
        """
        Generate answer with verifiable citations and Delimiter Isolation.
        Returns: (answer_text, list_of_citations)
        """
        if not retrieved_chunks:
            return (
                "Tài liệu nội bộ hiện không đề cập đến thông tin này hoặc chưa tìm thấy nguồn đủ tin cậy để trả lời.",
                []
            )

        context_xml = cls.construct_context(retrieved_chunks)
        
        # Build Citations Metadata with version_id (Preventing Version Drift)
        citations = []
        for idx, c in enumerate(retrieved_chunks, start=1):
            citations.append({
                "citation_index": idx,
                "document_id": c["document_id"],
                "version_id": c.get("version_id", 1),
                "document_title": c.get("document_title", "Tài liệu"),
                "page_number": c.get("page_number"),
                "heading": c.get("heading"),
                "sheet_name": c.get("sheet_name"),
                "exact_quoted_text": c["content"][:200] + "..." if len(c["content"]) > 200 else c["content"]
            })

        # Call Gemini API if available
        if settings.GEMINI_API_KEY:
            try:
                from google import genai
                client = genai.Client(api_key=settings.GEMINI_API_KEY)
                prompt = f"{STRICT_SYSTEM_PROMPT}\n\n{context_xml}\n\n<user_query>\n{question}\n</user_query>"
                response = client.models.generate_content(
                    model=settings.LLM_MODEL,
                    contents=prompt
                )
                safe_text = cls.apply_output_guardrail(response.text.strip())
                return safe_text, citations
            except Exception:
                pass

        # Local High-Fidelity Synthesizer (Fallback for offline/dev)
        first_chunk = retrieved_chunks[0]
        content_text = first_chunk["content"].strip()
        
        # Extract lines / sentences containing real data from the user's file
        raw_lines = [line.strip() for line in content_text.split("\n") if len(line.strip()) > 3]
        if not raw_lines:
            raw_lines = [s.strip() for s in content_text.split(".") if len(s.strip()) > 5]

        # Find lines/sentences matching question keywords for direct answer
        stop_words = {'file', 'trong', 'bao', 'cao', 'co', 'gi', 'la', 'nhu', 'the', 'nao', 'cho', 'hoi', 've', 'muc', 'dich'}
        q_tokens = [w.lower() for w in re.split(r'[\s,?.!]+', question) if len(w) > 2 and w.lower() not in stop_words]
        
        matching_lines = []
        for line in raw_lines:
            line_lower = line.lower()
            if any(t in line_lower for t in q_tokens):
                matching_lines.append(line)
        
        chosen_lines = matching_lines if matching_lines else raw_lines[:4]
        if len(chosen_lines) == 1:
            local_answer = chosen_lines[0]
        else:
            local_answer = "\n".join([f"• {line}" for line in chosen_lines[:4]])
        
        return cls.apply_output_guardrail(local_answer), citations
