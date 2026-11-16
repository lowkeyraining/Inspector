from collections.abc import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from backend.app import config

# engine ตัวเดียวต่อโปรเซส (pool อยู่ในนี้) ห้ามสร้างใหม่ที่อื่น
engine = create_engine(
    config.DATABASE_URL,
    echo=config.SQL_ECHO,
    pool_pre_ping=True,   # กล้องรันค้างทั้งวัน connection ที่ค้างอาจตายไปแล้ว เช็กก่อนใช้
)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    """dependency ของ FastAPI — ปิด session ทุกครั้งแม้ endpoint จะพัง"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
