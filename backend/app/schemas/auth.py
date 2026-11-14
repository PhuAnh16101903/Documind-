from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from app.models.user import SystemRole, AccountStatus

class UserLoginRequest(BaseModel):
    username_or_email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserPublicResponse"

class UserCreateRequest(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str
    department_id: Optional[int] = None
    role: SystemRole = SystemRole.EMPLOYEE

class UserPublicResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    role: SystemRole
    status: AccountStatus
    department_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

TokenResponse.model_rebuild()
