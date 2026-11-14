from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Chunk(Base):
    __tablename__ = "chunks"

    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    version_id = Column(Integer, ForeignKey("document_versions.id", ondelete="CASCADE"), nullable=True)
    
    chunk_index = Column(Integer, nullable=False) # Order within document
    content = Column(Text, nullable=False)
    token_count = Column(Integer, default=0)
    
    # Precise citation locator fields
    page_number = Column(Integer, nullable=True) # PDF page
    heading = Column(String(255), nullable=True) # Word/Markdown section heading
    sheet_name = Column(String(100), nullable=True) # Excel sheet
    cell_range = Column(String(50), nullable=True) # Excel cell coordinates (e.g. A1:D20)
    
    # Stored as serialized JSON string of floats for cross-platform compatibility (SQLite + Postgres)
    embedding_json = Column(Text, nullable=True)
    embedding_model = Column(String(100), default="text-embedding-004")
    
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    document = relationship("Document", back_populates="chunks")
    version = relationship("DocumentVersion", back_populates="chunks")
