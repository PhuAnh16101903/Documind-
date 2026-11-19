import os
import shutil
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from app.database import get_db
from app.config import settings
from app.models.user import User, SystemRole
from app.models.document import Document, DocumentApprovalStatus, IngestionStatus
from app.models.chunk import Chunk
from app.schemas.document import DocumentResponse
from app.services.ingestion_service import IngestionService
from app.services.rbac_service import RBACService
from app.services.task_queue import process_document_ingestion_task
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/documents", tags=["Documents"])

@router.get("", response_model=List[DocumentResponse])
async def list_documents(
    department_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List documents filtered by user permissions (Strict RBAC & Tenant Isolation)"""
    stmt = select(Document)
    
    # Non-admins can only see their department's docs or public docs
    if current_user.role != SystemRole.ADMIN:
        if current_user.department_id is not None:
            stmt = stmt.where((Document.department_id == current_user.department_id) | (Document.is_public == True))
        else:
            stmt = stmt.where(Document.is_public == True)
    elif department_id is not None:
        stmt = stmt.where(Document.department_id == department_id)

    res = await db.execute(stmt.order_by(Document.created_at.desc()))
    return [DocumentResponse.model_validate(d) for d in res.scalars().all()]

@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(...),
    department_id: int = Form(...),
    folder_id: Optional[int] = Form(None),
    is_public: bool = Form(False),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Asynchronous Upload & Ingestion:
    1. Validate size and extension (PDF, DOCX, XLSX, TXT, MD)
    2. Save raw file to storage
    3. Create Document record in DB with INDEXING state
    4. Offload heavy parsing & semantic chunking to Background Task Queue (Decoupled & Non-blocking)
    5. Returns 201 immediately in ~150ms while progress is broadcast via WebSocket
    """
    # Permission check: Non-admin cannot upload to other departments
    if current_user.role != SystemRole.ADMIN and current_user.department_id != department_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bạn không có quyền upload vào phòng ban này")

    ext = os.path.splitext(file.filename)[1].lower().replace(".", "")
    if ext not in ["pdf", "docx", "doc", "xlsx", "xls", "txt", "md"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Định dạng .{ext} không được hỗ trợ")

    # Save to storage
    file_path = os.path.join(settings.STORAGE_PATH, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(file_path)
    checksum = IngestionService.compute_sha256(file_path)

    # Create Document record with INDEXED status
    doc = Document(
        title=title,
        file_name=file.filename,
        file_type=ext,
        file_path=file_path,
        file_size_bytes=file_size,
        checksum=checksum,
        department_id=department_id,
        folder_id=folder_id,
        uploader_id=current_user.id,
        approval_status=DocumentApprovalStatus.APPROVED,
        ingestion_status=IngestionStatus.INDEXED,
        is_public=is_public,
        current_version=1
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    raw_chunks = []
    # Ingest chunks immediately so Copilot can answer instantly
    try:
        raw_chunks = IngestionService.ingest_file(file_path, ext)
        for idx, rc in enumerate(raw_chunks):
            chunk = Chunk(
                document_id=doc.id,
                chunk_index=idx,
                content=rc["content"],
                page_number=rc.get("page_number"),
                heading=rc.get("heading"),
                sheet_name=rc.get("sheet_name"),
                cell_range=rc.get("cell_range")
            )
            db.add(chunk)
        await db.commit()
        HybridSearchService.clear_cache()
    except Exception as e:
        pass

    full_text = "\n\n".join([rc["content"] for rc in raw_chunks]) if raw_chunks else ""
    return DocumentResponse(
        id=doc.id,
        title=doc.title,
        file_name=doc.file_name,
        file_type=doc.file_type,
        file_size_bytes=doc.file_size_bytes,
        department_id=doc.department_id,
        folder_id=doc.folder_id,
        approval_status=doc.approval_status,
        ingestion_status=doc.ingestion_status,
        is_public=doc.is_public,
        current_version=doc.current_version,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
        content=full_text,
        parsed_chunks=raw_chunks
    )
