"""สถานีตรวจในสายการผลิต"""

from __future__ import annotations

from sqlalchemy import Integer, Numeric, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base


class Station(Base):
    __tablename__ = "stations"
    __table_args__ = (
        # ลำดับในสายต้องไม่ซ้ำ ไม่งั้นกราฟเทียบรายสถานีจะสลับที่เองเวลา sort
        UniqueConstraint("order_no", name="uq_stations_order_no"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # รหัสที่ frontend ใช้เป็น id เช่น "st-01" — แยกจาก PK เพราะ URL/mockup อ้างรหัสนี้
    code: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    order_no: Mapped[int] = mapped_column(Integer)
    name: Mapped[str] = mapped_column(String(64))

    # เวลามาตรฐานต่อชิ้นและช่วงที่ยอมรับได้ (วินาที)
    # Numeric ไม่ใช่ Float เพราะหน้าจอเทียบค่ากับขอบช่วงแบบชนขอบนับว่าหลุด
    standard_cycle_time: Mapped[float] = mapped_column(Numeric(6, 2))
    cycle_tolerance: Mapped[float] = mapped_column(Numeric(6, 2))

    inspections: Mapped[list["Inspection"]] = relationship(  # noqa: F821
        back_populates="station",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Station {self.code} {self.name}>"
