from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User, SystemRole
from app.models.document import Document
from app.models.chunk import Chunk
from app.models.chat import ChatSession, ChatMessage, MessageCitation
from app.models.audit import AuditLog
from app.schemas.chat import ChatQueryRequest, ChatAnswerResponse, CitationItem
from app.services.search_service import HybridSearchService
from app.services.rag_service import RAGService
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/copilot", tags=["AI Copilot & RAG"])

@router.post("/query", response_model=ChatAnswerResponse)
async def query_copilot(
    req: ChatQueryRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Module 07: RAG Question Answering with Verifiable Citations & Strict Grounding
    """
    # 1. Fetch accessible candidate chunks
    stmt = select(Chunk, Document).join(Document, Chunk.document_id == Document.id)
    if current_user.role != SystemRole.ADMIN:
        if current_user.department_id is not None:
            stmt = stmt.where((Document.department_id == current_user.department_id) | (Document.is_public == True))
        else:
            stmt = stmt.where(Document.is_public == True)

    if req.department_scope_id:
        stmt = stmt.where((Document.department_id == req.department_scope_id) | (Document.is_public == True))

    res = await db.execute(stmt)
    candidates = [
        {
            "chunk_id": chunk.id,
            "document_id": doc.id,
            "document_title": doc.title,
            "content": chunk.content,
            "page_number": chunk.page_number,
            "heading": chunk.heading,
            "sheet_name": chunk.sheet_name
        }
        for chunk, doc in res.all()
    ]

    # 2. Retrieve top-k relevant chunks
    top_chunks = HybridSearchService.rank_hybrid(req.question, candidates, top_k=15)

    # 3. Generate answer with Strict Grounding
    answer_text, citations_data = await RAGService.generate_answer(req.question, top_chunks)

    # 4. Save Session & Message to Database
    session_id = req.session_id
    if not session_id:
        new_session = ChatSession(
            user_id=current_user.id,
            title=req.question[:50] + "..." if len(req.question) > 50 else req.question,
            department_scope_id=req.department_scope_id
        )
        db.add(new_session)
        await db.commit()
        await db.refresh(new_session)
        session_id = new_session.id

    # User message
    user_msg = ChatMessage(session_id=session_id, role="user", content=req.question)
    db.add(user_msg)

    # Assistant message
    assistant_msg = ChatMessage(session_id=session_id, role="assistant", content=answer_text)
    db.add(assistant_msg)
    await db.commit()
    await db.refresh(assistant_msg)

    # Save Citations
    citation_items = []
    for c in citations_data:
        cite = MessageCitation(
            message_id=assistant_msg.id,
            document_id=c["document_id"],
            chunk_id=c.get("chunk_id"),
            citation_index=c["citation_index"],
            document_title=c["document_title"],
            page_number=c.get("page_number"),
            heading=c.get("heading"),
            sheet_name=c.get("sheet_name"),
            exact_quoted_text=c["exact_quoted_text"]
        )
        db.add(cite)
        citation_items.append(CitationItem(
            citation_index=c["citation_index"],
            document_id=c["document_id"],
            document_title=c["document_title"],
            page_number=c.get("page_number"),
            heading=c.get("heading"),
            sheet_name=c.get("sheet_name"),
            exact_quoted_text=c["exact_quoted_text"]
        ))

    # Audit Log entry
    audit = AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="COPILOT_QUERY",
        resource_type="CHAT",
        resource_id=str(session_id),
        details=f"Question: {req.question[:100]} | Citations: {len(citation_items)}",
        status="SUCCESS"
    )
    db.add(audit)
    await db.commit()

    return ChatAnswerResponse(
        session_id=session_id,
        message_id=assistant_msg.id,
        answer=answer_text,
        citations=citation_items,
        created_at=datetime.utcnow()
    )
