import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    APP_NAME: str = "DocuMind"
    APP_VERSION: str = "1.0.0"
    APP_DEBUG: bool = True
    APP_SECRET_KEY: str = "documind_default_secret_key_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./documind.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Storage
    STORAGE_PATH: str = "./storage/documents"
    MAX_FILE_SIZE_MB: int = 100

    # AI Configuration
    GEMINI_API_KEY: Optional[str] = None
    LLM_MODEL: str = "gemini-3.8-flash"
    EMBEDDING_MODEL: str = "text-embedding-004"

    # Retrieval parameters
    TOP_K_CHUNKS: int = 5
    SIMILARITY_THRESHOLD: float = 0.55
    HYBRID_ALPHA: float = 0.5 # 0.5 = 50% BM25, 50% Dense Vector

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
