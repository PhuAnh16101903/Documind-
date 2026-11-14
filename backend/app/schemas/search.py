from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SearchQueryRequest(BaseModel):
    query: str
    department_id: Optional[int] = None
    folder_id: Optional[int] = None
    file_type: Optional[str] = None
    limit: int = 10

class SearchResultItem(BaseModel):
    document_id: int
    document_title: str
    file_type: str
    department_id: int
    page_number: Optional[int] = None
    heading: Optional[str] = None
    sheet_name: Optional[str] = None
    snippet: str
    score: float # Hybrid relevance score 0.0 - 1.0

class SearchResponse(BaseModel):
    query: str
    total_hits: int
    results: List[SearchResultItem]
