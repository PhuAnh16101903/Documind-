import asyncio
import logging
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.document import Document, IngestionStatus
from app.models.chunk import Chunk
from app.services.ingestion_service import IngestionService
from app.services.websocket_manager import ws_manager

logger = logging.getLogger("documind.task_queue")

async def process_document_ingestion_task(
    document_id: int,
    file_path: str,
    file_type: str,
    user_id: int
):
    """
    Background Task: Asynchronous Document Parsing, Semantic Chunking & Vector Ingestion
    Runs decoupled from the main HTTP request loop to prevent server blocking on 100+ page files.
    Emits real-time progress events over WebSocket to the uploader.
    """
    str_user_id = str(user_id)
    
    # 1. Notify client that background processing has started
    await ws_manager.send_personal_message({
        "event": "ingestion_started",
        "document_id": document_id,
        "progress": 5,
        "status": "PROCESSING",
        "message": "Bắt đầu bóc tách và phân tích văn bản..."
    }, str_user_id)

    async with AsyncSessionLocal() as session:
        try:
            # Query Document to ensure it exists
            stmt = select(Document).where(Document.id == document_id)
            res = await session.execute(stmt)
            doc = res.scalar_one_or_none()
            if not doc:
                logger.error(f"Document {document_id} not found in database for background ingestion.")
                return

            # 2. Extract Text & Structure (CPU-bound parsing run in threadpool)
            await ws_manager.send_personal_message({
                "event": "ingestion_progress",
                "document_id": document_id,
                "progress": 30,
                "status": "PARSING",
                "message": "Đang trích xuất nội dung và phân cấp mục lục (Heading, Sheet, Table)..."
            }, str_user_id)

            loop = asyncio.get_running_loop()
            raw_chunks = await loop.run_in_executor(
                None, IngestionService.ingest_file, file_path, file_type
            )

            # 3. Semantic Chunking & Batch insertion into Database
            await ws_manager.send_personal_message({
                "event": "ingestion_progress",
                "document_id": document_id,
                "progress": 65,
                "chunks_count": len(raw_chunks),
                "status": "CHUNKING",
                "message": f"Đã chia thành {len(raw_chunks)} đoạn ngữ nghĩa, đang lưu trữ và đánh chỉ mục vector..."
            }, str_user_id)

            # Batch add chunks
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
                session.add(chunk)

            # 4. Mark status as INDEXED
            doc.ingestion_status = IngestionStatus.INDEXED
            doc.error_message = None
            await session.commit()
            await session.refresh(doc)

            # 5. Broadcast success event
            await ws_manager.send_personal_message({
                "event": "ingestion_completed",
                "document_id": document_id,
                "progress": 100,
                "chunks_count": len(raw_chunks),
                "status": "INDEXED",
                "message": f"Tài liệu '{doc.title}' đã được đánh chỉ mục thành công vào kho tri thức!"
            }, str_user_id)

            logger.info(f"Successfully processed document {document_id} ({len(raw_chunks)} chunks).")

        except Exception as e:
            logger.exception(f"Error during background ingestion of document {document_id}: {e}")
            if doc:
                doc.ingestion_status = IngestionStatus.FAILED
                doc.error_message = str(e)
                await session.commit()

            # Broadcast failure event
            await ws_manager.send_personal_message({
                "event": "ingestion_failed",
                "document_id": document_id,
                "status": "FAILED",
                "error": str(e),
                "message": f"Quá trình xử lý tài liệu thất bại: {str(e)}"
            }, str_user_id)
