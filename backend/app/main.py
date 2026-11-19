from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.config import settings
from app.database import engine, Base, AsyncSessionLocal
from app.models import User, Department, Folder, SystemRole, AccountStatus
from app.services.auth_service import get_password_hash
from app.services.websocket_manager import ws_manager

from app.api.auth import router as auth_router
from app.api.departments import router as dept_router
from app.api.documents import router as doc_router
from app.api.search import router as search_router
from app.api.copilot import router as copilot_router
from app.api.analytics import router as analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application Startup & Initial Seed"""
    # 1. Create DB Tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Seed Default Departments and Users if empty
    async with AsyncSessionLocal() as session:
        dept_check = await session.execute(select(Department))
        if not dept_check.scalars().first():
            hr_dept = Department(name="Phòng Nhân Sự (HR)", code="HR", description="Chính sách nhân sự, nghỉ phép, hợp đồng lao động", quota_mb=5000)
            fin_dept = Department(name="Phòng Tài Chính - Kế Toán", code="FIN", description="Báo cáo tài chính, hóa đơn, quy chế công tác phí", quota_mb=5000)
            tech_dept = Department(name="Phòng Kỹ Thuật - R&D", code="TECH", description="Tài liệu kiến trúc hệ thống, API docs, quy trình deploy", quota_mb=10000)
            gen_dept = Department(name="Kho Tri Thức Chung", code="GEN", description="Nội quy lao động, văn hóa công ty dùng chung", quota_mb=10000)
            
            session.add_all([hr_dept, fin_dept, tech_dept, gen_dept])
            await session.commit()

            # Seed Default Users
            admin_user = User(
                email="admin@documind.internal",
                username="admin",
                full_name="System Administrator",
                hashed_password=get_password_hash("admin123"),
                role=SystemRole.ADMIN,
                status=AccountStatus.ACTIVE,
                department_id=None
            )
            hr_manager = User(
                email="hr.manager@documind.internal",
                username="hr_manager",
                full_name="Trưởng Phòng Nhân Sự",
                hashed_password=get_password_hash("manager123"),
                role=SystemRole.MANAGER,
                status=AccountStatus.ACTIVE,
                department_id=hr_dept.id
            )
            dev_user = User(
                email="dev.an@documind.internal",
                username="dev_an",
                full_name="Nguyễn Văn An (Kỹ Sư)",
                hashed_password=get_password_hash("dev123"),
                role=SystemRole.EMPLOYEE,
                status=AccountStatus.ACTIVE,
                department_id=tech_dept.id
            )
            session.add_all([admin_user, hr_manager, dev_user])
            await session.commit()

    yield

app = FastAPI(
    title="DocuMind API",
    description="Enterprise Knowledge Base & Verifiable AI Retrieval System",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(dept_router)
app.include_router(doc_router)
app.include_router(search_router)
app.include_router(copilot_router)
app.include_router(analytics_router)

# WebSocket Real-Time Ingestion & Notification Endpoint
@app.websocket("/ws/notifications/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: str):
    """
    Real-time push channel for background task ingestion progress,
    system alerts, and completion events.
    """
    await ws_manager.connect(websocket, user_id)
    try:
        while True:
            # Keep socket alive and respond to client heartbeat ping
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, user_id)

@app.get("/")
async def root():
    return {
        "system": "DocuMind Enterprise Knowledge Base",
        "status": "RUNNING",
        "version": "1.0.0",
        "docs": "/docs",
        "features": {
            "background_task_queue": "ACTIVE",
            "websocket_realtime": "ACTIVE",
            "high_concurrency_pooling": "OPTIMIZED (100+ concurrent users)"
        }
    }
