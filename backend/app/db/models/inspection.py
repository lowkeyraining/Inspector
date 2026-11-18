"""ผลตรวจรายชิ้นงาน และปัญหาที่เจอในชิ้นนั้น

แยกสองตารางเพราะชิ้นเดียวอาจเจอหลายปัญหาพร้อมกัน
ส่วนจำนวนชิ้นที่ผ่านกล้องและ cycle time ต้องนับจากทุกชิ้น ไม่ใช่แค่ชิ้นที่เสีย
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Index, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.db.base import Base


class Inspection(Base):
    __tablename__ = "inspections"
    __table_args__ = (
        # หน้า Dashboard ถามแบบ "สถานีนี้ ช่วงเวลานี้" เสมอ index คู่จึงคุ้มกว่าแยกสองตัว
        Index("ix_inspections_station_inspected_at", "station_id", "inspected_at"),
        Index("ix_inspections_inspected_at", "inspected_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    station_id: Mapped[int] = mapped_column(ForeignKey("stations.id", ondelete="CASCADE"))

    # หมายเลขชิ้นงานที่เดินตามสาย ชิ้นเดียวผ่านหลายสถานี จึงไม่ unique ในตารางนี้
    piece_no: Mapped[str] = mapped_column(String(32))

    # เก็บเป็น UTC เสมอ (DB ตั้ง TZ=UTC) ไปแปลงเป็นเวลาไทยที่ชั้นแสดงผล
    inspected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    # เวลาที่ชิ้นนี้ใช้ในสถานี (วินาที) ใช้คิด cycle time เฉลี่ยและกราฟรายรอบ
    cycle_seconds: Mapped[float] = mapped_column(Numeric(6, 2))

    station: Mapped["Station"] = relationship(back_populates="inspections")  # noqa: F821
    defects: Mapped[list["Defect"]] = relationship(
        back_populates="inspection",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Inspection piece={self.piece_no} station_id={self.station_id}>"


class Defect(Base):
    __tablename__ = "defects"
    __table_args__ = (
        Index("ix_defects_defect_type_id", "defect_type_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    inspection_id: Mapped[int] = mapped_column(
        ForeignKey("inspections.id", ondelete="CASCADE"),
        index=True,
    )
    defect_type_id: Mapped[int] = mapped_column(ForeignKey("defect_types.id"))

    # ความมั่นใจของโมเดล สัดส่วน 0–1
    confidence: Mapped[float] = mapped_column(Numeric(4, 3))

    # เก็บแค่ path ตัวไฟล์ภาพอยู่บนดิสก์ (ดู config.SNAPSHOT_DIR)
    snapshot_path: Mapped[str | None] = mapped_column(String(255), nullable=True)

    inspection: Mapped["Inspection"] = relationship(back_populates="defects")
    defect_type: Mapped["DefectType"] = relationship()  # noqa: F821

    def __repr__(self) -> str:
        return f"<Defect inspection_id={self.inspection_id} type_id={self.defect_type_id}>"
