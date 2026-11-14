import pytest
from app.models.user import User, SystemRole, AccountStatus
from app.models.document import Document
from app.services.rbac_service import RBACService
from app.services.auth_service import get_password_hash, verify_password, create_access_token, decode_access_token

def test_password_hashing():
    """Verify password hashing and verification"""
    raw_pass = "SecurePass123!"
    hashed = get_password_hash(raw_pass)
    assert verify_password(raw_pass, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_jwt_token_flow():
    """Verify JWT token encoding and decoding"""
    payload = {"sub": "10", "role": "EMPLOYEE"}
    token = create_access_token(payload)
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "10"
    assert decoded["role"] == "EMPLOYEE"

def test_tc_sec_01_rbac_department_isolation():
    """
    Test Case TC-SEC-01:
    User in Department A (HR) CANNOT access confidential document in Department B (Finance).
    """
    user_hr = User(
        id=1,
        email="hr.staff@documind.internal",
        username="hr_staff",
        full_name="HR Staff",
        hashed_password="hash",
        role=SystemRole.EMPLOYEE,
        status=AccountStatus.ACTIVE,
        department_id=1 # HR
    )

    doc_fin_confidential = Document(
        id=101,
        title="Báo cáo tài chính quý 4",
        department_id=2, # Finance
        is_public=False
    )

    doc_hr_policy = Document(
        id=102,
        title="Chính sách nghỉ phép",
        department_id=1, # HR
        is_public=False
    )

    doc_company_public = Document(
        id=103,
        title="Sổ tay văn hóa công ty",
        department_id=4, # General
        is_public=True
    )

    # 1. HR staff attempting to access Finance document -> REJECTED (TC-SEC-01)
    assert RBACService.can_access_document(user_hr, doc_fin_confidential) is False

    # 2. HR staff accessing own HR document -> ALLOWED
    assert RBACService.can_access_document(user_hr, doc_hr_policy) is True

    # 3. HR staff accessing public document -> ALLOWED
    assert RBACService.can_access_document(user_hr, doc_company_public) is True

    # 4. Admin accessing Finance document -> ALLOWED
    admin_user = User(
        id=99,
        email="admin@documind.internal",
        username="admin",
        full_name="Admin",
        hashed_password="hash",
        role=SystemRole.ADMIN,
        status=AccountStatus.ACTIVE,
        department_id=None
    )
    assert RBACService.can_access_document(admin_user, doc_fin_confidential) is True
