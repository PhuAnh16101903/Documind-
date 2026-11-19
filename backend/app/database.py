import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.config import settings

# Ensure storage directory exists
os.makedirs(settings.STORAGE_PATH, exist_ok=True)

# High-Concurrency Async Engine Configuration (Optimized for 100+ Concurrent Users)
engine_kwargs = {
    "echo": False,
    "future": True,
}

# Apply Enterprise Connection Pooling for PostgreSQL / MySQL
if "sqlite" not in settings.DATABASE_URL:
    engine_kwargs.update({
        "pool_size": 25,          # Maintain up to 25 permanent active DB connections
        "max_overflow": 50,       # Allow burst of up to 50 additional temporary connections
        "pool_timeout": 30,       # Wait up to 30s before timeout under peak load
        "pool_recycle": 1800,     # Recycle connections every 30m to avoid stale drops
        "pool_pre_ping": True,    # Health check connections before executing queries
    })

engine = create_async_engine(settings.DATABASE_URL, **engine_kwargs)

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db():
    """Dependency for obtaining async DB session per request"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
