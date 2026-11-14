from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.document import DocumentApprovalStatus, IngestionStatus

class DocumentResponse(BaseModel):
    id: int
    title: str
    file_name: str
    file_type: str
    file_size_bytes: int
    department_id: int
    folder_id: Optional[int]
    approval_status: DocumentApprovalStatus
    ingestion_status: IngestionStatus
    is_public: bool
    current_version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class FolderResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    department_id: int
    parent_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class DepartmentResponse(BaseModel):
    id: int
    name: str
    code: str
    description: Optional[str]
    quota_mb: int
    created_at: datetime

    class Config:
        from_attributes = True
