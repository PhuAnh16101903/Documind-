from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatQueryRequest(BaseModel):
    session_id: Optional[int] = None
    question: str
    department_scope_id: Optional[int] = None

class CitationItem(BaseModel):
    citation_index: int
    document_id: int
    document_title: str
    page_number: Optional[int] = None
    heading: Optional[str] = None
    sheet_name: Optional[str] = None
    exact_quoted_text: str

class ChatAnswerResponse(BaseModel):
    session_id: int
    message_id: int
    answer: str
    citations: List[CitationItem]
    created_at: datetime
