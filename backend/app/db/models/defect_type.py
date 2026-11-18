"""ประเภทปัญหาที่โมเดลตรวจเจอ — ชื่อคลาสของ YOLO ฝั่งข้อมูล"""

from __future__ import annotations

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.base import Base


class DefectType(Base):
    __tablename__ = "defect_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # ชื่อที่ขึ้นบนโดนัทและรายการเหตุการณ์ ต้องไม่ซ้ำเพราะใช้เป็นตัวจับกลุ่ม
    name: Mapped[str] = mapped_column(String(64), unique=True)

    def __repr__(self) -> str:
        return f"<DefectType {self.name}>"
