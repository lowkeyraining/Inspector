"""เป้าการผลิตรายวัน — KPI "ผลิตวันนี้ / เป้า" บนหน้า Dashboard"""

from __future__ import annotations

from datetime import date

from sqlalchemy import Date, Integer
from sqlalchemy.orm import Mapped, mapped_column

from backend.app.db.base import Base


class ProductionTarget(Base):
    __tablename__ = "production_targets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # วันละแถวเดียว (เป้าเป็นของทั้งสาย ไม่แยกตามสถานี) ภายหลัง M5 จะนำเข้าจาก CSV/XLSX
    target_date: Mapped[date] = mapped_column(Date, unique=True)
    target_qty: Mapped[int] = mapped_column(Integer)

    def __repr__(self) -> str:
        return f"<ProductionTarget {self.target_date} {self.target_qty}>"
