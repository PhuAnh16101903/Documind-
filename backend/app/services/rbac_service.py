from app.models.user import User, SystemRole
from app.models.document import Document

class RBACService:
    @staticmethod
    def can_access_document(user: User, document: Document) -> bool:
        """
        Enforce Strict Access Control Rules:
        - Admin can access all documents for administration.
        - Public documents can be accessed by all active users.
        - Users can only access documents belonging to their own department.
        - Users cannot access documents belonging to other departments (TC-SEC-01).
        """
        if user.role == SystemRole.ADMIN:
            return True
            
        if document.is_public:
            return True
            
        if user.department_id is not None and document.department_id == user.department_id:
            return True
            
        return False

    @staticmethod
    def get_accessible_department_ids(user: User) -> list[int] | None:
        """
        Returns a list of department IDs user is permitted to search.
        None signifies Admin (all departments).
        """
        if user.role == SystemRole.ADMIN:
            return None # Unrestricted
            
        if user.department_id is not None:
            return [user.department_id]
            
        return []
