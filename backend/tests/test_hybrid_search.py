import pytest
from app.services.search_service import HybridSearchService

def test_hybrid_search_bm25_and_vector():
    """Verify Hybrid Search combines keyword matching and semantic score"""
    candidates = [
        {
            "chunk_id": 1,
            "document_id": 10,
            "document_title": "Nội quy lao động",
            "content": "Quy định về thời giờ làm việc và xử lý trường hợp đi muộn về sớm."
        },
        {
            "chunk_id": 2,
            "document_id": 20,
            "document_title": "Chính sách công tác phí",
            "content": "Tiêu chuẩn khách sạn và thanh toán vé máy bay khi đi công tác tỉnh."
        },
        {
            "chunk_id": 3,
            "document_id": 30,
            "document_title": "Bảo mật thông tin",
            "content": "Không được chia sẻ mật khẩu máy tính và tài khoản VPN cho người ngoài."
        }
    ]

    # Query for "đi muộn"
    results = HybridSearchService.rank_hybrid("đi muộn", candidates, top_k=2)
    assert len(results) > 0
    # Top result must be "Nội quy lao động"
    assert results[0]["document_id"] == 10
    assert results[0]["score"] > 0.3
