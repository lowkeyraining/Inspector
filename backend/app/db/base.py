from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """คลาสแม่ของทุกตาราง — alembic อ่าน metadata จากตัวนี้ตัวเดียว"""
