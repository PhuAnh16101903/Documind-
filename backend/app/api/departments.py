from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.department import Department, Folder
from app.schemas.document import DepartmentResponse, FolderResponse
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/departments", tags=["Departments & Folders"])

@router.get("", response_model=List[DepartmentResponse])
async def list_departments(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all corporate departments"""
    res = await db.execute(select(Department).order_by(Department.id))
    return [DepartmentResponse.model_validate(d) for d in res.scalars().all()]

@router.get("/{department_id}/folders", response_model=List[FolderResponse])
async def list_department_folders(
    department_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List folders belonging to a department"""
    res = await db.execute(select(Folder).where(Folder.department_id == department_id))
    return [FolderResponse.model_validate(f) for f in res.scalars().all()]
