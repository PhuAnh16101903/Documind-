from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User, SystemRole
from app.models.document import Document
from app.models.chunk import Chunk
from app.schemas.search import SearchQueryRequest, SearchResponse, SearchResultItem
from app.services.search_service import HybridSearchService
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/search", tags=["Hybrid Search"])

@router.post("", response_model=SearchResponse)
async def hybrid_search(
    req: SearchQueryRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Module 06: Hybrid Search Engine (BM25 + Semantic Search + RBAC Access Filter)
    """
    # 1. Fetch chunks belonging to documents permitted for current_user
    stmt = select(Chunk, Document).join(Document, Chunk.document_id == Document.id)
    
    # Filter by user permissions
    if current_user.role != SystemRole.ADMIN:
        if current_user.department_id is not None:
            stmt = stmt.where((Document.department_id == current_user.department_id) | (Document.is_public == True))
        else:
            stmt = stmt.where(Document.is_public == True)

    if req.department_id:
        stmt = stmt.where(Document.department_id == req.department_id)
        
    res = await db.execute(stmt)
    records = res.all()

    candidates = []
    for chunk, doc in records:
        candidates.append({
            "chunk_id": chunk.id,
            "document_id": doc.id,
            "document_title": doc.title,
            "file_type": doc.file_type,
            "department_id": doc.department_id,
            "content": chunk.content,
            "page_number": chunk.page_number,
            "heading": chunk.heading,
            "sheet_name": chunk.sheet_name
        })

    # 2. Run Hybrid Ranking (BM25 + Dense)
    ranked_results = HybridSearchService.rank_hybrid(req.query, candidates, top_k=req.limit)

    output = []
    for r in ranked_results:
        output.append(SearchResultItem(
            document_id=r["document_id"],
            document_title=r["document_title"],
            file_type=r["file_type"],
            department_id=r["department_id"],
            page_number=r.get("page_number"),
            heading=r.get("heading"),
            sheet_name=r.get("sheet_name"),
            snippet=r["content"][:250] + "..." if len(r["content"]) > 250 else r["content"],
            score=r["score"]
        ))

    return SearchResponse(query=req.query, total_hits=len(output), results=output)
