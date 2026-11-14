import pytest
from app.services.rag_service import RAGService

@pytest.mark.asyncio
async def test_strict_grounding_rejection_when_no_chunks():
    """
    Verify BR13 & FR07.05:
    When no relevant source chunks are retrieved, AI MUST abstain with the standard refusal.
    """
    answer, citations = await RAGService.generate_answer("Chính sách thưởng Tết năm nay?", [])
    assert "Tài liệu nội bộ hiện không đề cập" in answer
    assert len(citations) == 0

@pytest.mark.asyncio
async def test_verifiable_citation_generation():
    """Verify citations are accurately generated with document title and page number"""
    sample_chunks = [
        {
            "chunk_id": 101,
            "document_id": 5,
            "document_title": "Quy chế chi tiêu nội bộ",
            "page_number": 8,
            "heading": "Điều 15. Tiêu chuẩn khách sạn",
            "sheet_name": None,
            "content": "Cán bộ cấp trưởng phòng được thanh toán phòng khách sạn tối đa 1.200.000 VNĐ/đêm khi đi công tác tại các thành phố trực thuộc Trung ương."
        }
    ]

    answer, citations = await RAGService.generate_answer("Hạn mức khách sạn công tác là bao nhiêu?", sample_chunks)
    assert len(citations) == 1
    assert citations[0]["document_id"] == 5
    assert citations[0]["page_number"] == 8
    assert citations[0]["document_title"] == "Quy chế chi tiêu nội bộ"
    assert "[Nguồn 1]" in answer
