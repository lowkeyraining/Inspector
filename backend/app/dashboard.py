"""ข้อมูลสรุปของหน้า Dashboard — รวมทุกการ์ดในคำตอบเดียว

ทำไมก้อนเดียวไม่แยก endpoint ต่อการ์ด: ทุกการ์ดบนหน้าพูดถึง "วันเดียวกัน" เสมอ
ถ้าแยกเรียกแล้วการ์ดใดการ์ดหนึ่งช้ากว่า ตัวเลขบนจอจะมาจากคนละช่วงเวลาชั่วคราว

ชื่อฟิลด์ที่ส่งออกเป็น camelCase ให้ตรงกับ `frontend/src/api/dashboard.ts`
(ฝั่ง Python เขียน snake_case ตามปกติ แล้วให้ alias แปลงให้ตอน serialize)
"""

from __future__ import annotations

from datetime import date, datetime, time, timedelta, timezone

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.app.db.models import Defect, DefectType, Inspection, ProductionTarget, Station

# เวลาไทยคงที่ UTC+7 ไม่มี DST จึงไม่ต้องพึ่ง tzdata ฝั่ง Python
ICT = timezone(timedelta(hours=7))

# ส่วนที่ต้องตัดกลุ่มตามเวลาไทย (ราย ชม. / รายสัปดาห์) ให้ Postgres แปลงให้
# เพราะ date_trunc ต้องทำบนเวลาท้องถิ่น ไม่ใช่ UTC ไม่งั้นขอบวันจะเลื่อนไป 7 ชั่วโมง
BANGKOK = "Asia/Bangkok"

# จำนวนสัปดาห์ย้อนหลังของกราฟแนวโน้ม (รวมสัปดาห์ของวันที่เลือก)
TREND_WEEKS = 4

# จำนวนรอบล่าสุดที่ส่งให้กราฟ cycle time ต่อสถานี
# ตามแบบร่างที่วางไว้ราว 6–8 แท่ง มากกว่านี้แท่งจะเบียดจนอ่านไม่ออก
CYCLE_SAMPLE = 12


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class StationDefect(CamelModel):
    id: str
    order: int
    name: str
    defect_rate: float


class DefectTypeShare(CamelModel):
    name: str
    share: float


class WeeklyPoint(CamelModel):
    label: str
    defect_rate: float


class CyclePoint(CamelModel):
    round: int
    seconds: float


class DefectEvent(CamelModel):
    id: str
    time: str
    piece_no: str
    defect_name: str
    confidence: float


class StationDetail(StationDefect):
    inspected_today: int
    defect_count: int
    avg_cycle_time: float
    standard_cycle_time: float
    cycle_tolerance: float
    cycles: list[CyclePoint]
    events: list[DefectEvent]


class DashboardSummary(CamelModel):
    station_count: int
    avg_defect_rate: float
    worst_station_id: str
    produced_today: int
    production_target: int
    stations: list[StationDefect]
    defect_types: list[DefectTypeShare]
    weekly: list[WeeklyPoint]
    station_details: list[StationDetail]


def today_in_thailand() -> date:
    return datetime.now(ICT).date()


def _day_bounds(day: date) -> tuple[datetime, datetime]:
    """ขอบวันตามเวลาไทย แปลงเป็น UTC

    กรองด้วยช่วงเวลาแทนการห่อคอลัมน์ด้วยฟังก์ชัน เพื่อให้ยังใช้ index
    ix_inspections_station_inspected_at ได้
    """
    start = datetime.combine(day, time.min, ICT).astimezone(timezone.utc)
    return start, start + timedelta(days=1)


def _rate(defects: int, inspections: int) -> float:
    """ไม่มีชิ้นงานให้นับว่า 0 ไม่ใช่หารศูนย์ — หน้าจอต้องขึ้นการ์ดได้เสมอ"""
    return round(defects / inspections, 4) if inspections else 0.0


def _local(column):
    return func.timezone(BANGKOK, column)


def build_summary(db: Session, day: date) -> DashboardSummary:
    start, end = _day_bounds(day)
    in_day = (Inspection.inspected_at >= start) & (Inspection.inspected_at < end)

    stations = db.execute(select(Station).order_by(Station.order_no)).scalars().all()
    if not stations:
        return _empty_summary()

    inspected, avg_cycle = _station_inspection_stats(db, start, end)
    defect_count = _station_defect_counts(db, in_day)
    cycles = _station_cycle_points(db, in_day)
    events = _station_events(db, in_day)

    details: list[StationDetail] = []
    for station in stations:
        count = inspected.get(station.id, 0)
        details.append(
            StationDetail(
                id=station.code,
                order=station.order_no,
                name=station.name,
                defect_rate=_rate(defect_count.get(station.id, 0), count),
                inspected_today=count,
                defect_count=defect_count.get(station.id, 0),
                avg_cycle_time=round(avg_cycle.get(station.id, 0.0), 2),
                standard_cycle_time=float(station.standard_cycle_time),
                cycle_tolerance=float(station.cycle_tolerance),
                cycles=cycles.get(station.id, []),
                events=events.get(station.id, []),
            )
        )

    total_inspected = sum(inspected.values())
    total_defects = sum(defect_count.values())

    # สถานีที่แย่ที่สุด = อัตราสูงสุด เสมอกันให้เอาตัวที่อยู่ต้นสายก่อน
    # (details เรียงตาม order_no อยู่แล้ว และ max คืนตัวแรกที่เจอ)
    # วันที่ยังไม่มีของเสียเลยต้องไม่ชี้สถานีไหน ไม่งั้นการ์ด "จุดที่ต้องดูแลด่วน"
    # จะสุ่มโชว์สถานีแรกพร้อมอัตรา 0% เหมือนมีปัญหาทั้งที่ไม่มีอะไรเกิดขึ้น
    worst = max(details, key=lambda d: d.defect_rate) if total_defects else None

    return DashboardSummary(
        station_count=len(stations),
        avg_defect_rate=_rate(total_defects, total_inspected),
        worst_station_id=worst.id if worst else "",
        produced_today=_produced(db, in_day),
        production_target=_production_target(db, day),
        stations=[StationDefect(**detail.model_dump()) for detail in details],
        defect_types=_defect_types(db, in_day),
        weekly=_weekly_trend(db, day),
        station_details=details,
    )


def _empty_summary() -> DashboardSummary:
    """ยังไม่มีสถานีในระบบ — ส่งโครงเปล่าให้การ์ดขึ้นสถานะรอข้อมูล"""
    return DashboardSummary(
        station_count=0,
        avg_defect_rate=0.0,
        worst_station_id="",
        produced_today=0,
        production_target=0,
        stations=[],
        defect_types=[],
        weekly=[],
        station_details=[],
    )


def _station_inspection_stats(
    db: Session, start: datetime, end: datetime
) -> tuple[dict[int, int], dict[int, float]]:
    rows = db.execute(
        select(
            Inspection.station_id,
            func.count(Inspection.id),
            func.avg(Inspection.cycle_seconds),
        )
        .where(Inspection.inspected_at >= start, Inspection.inspected_at < end)
        .group_by(Inspection.station_id)
    ).all()
    return (
        {station_id: count for station_id, count, _ in rows},
        {station_id: float(avg) for station_id, _, avg in rows if avg is not None},
    )


def _station_defect_counts(db: Session, in_day) -> dict[int, int]:
    """นับแยกจากจำนวนชิ้นงาน ไม่ join รวมคราวเดียว

    ชิ้นเดียวอาจมีหลายปัญหา ถ้า join รวมแล้ว count() จำนวนชิ้นจะถูกคูณตามจำนวนปัญหา
    """
    rows = db.execute(
        select(Inspection.station_id, func.count(Defect.id))
        .select_from(Defect)
        .join(Inspection, Inspection.id == Defect.inspection_id)
        .where(in_day)
        .group_by(Inspection.station_id)
    ).all()
    return dict(rows)


def _station_cycle_points(db: Session, in_day) -> dict[int, list[CyclePoint]]:
    """cycle time ของ CYCLE_SAMPLE รอบล่าสุดในวันนั้น เรียงตามเวลา

    ส่งค่าจริงรายชิ้น ไม่ใช่ค่าเฉลี่ยรายชั่วโมง — เฉลี่ยแล้วความแกว่งหายหมด
    กราฟจะเป็นเส้นแบนเกาะค่ามาตรฐานและไม่มีรอบไหนขึ้นสีแดงเลย ทั้งที่ของจริงหลุด
    เอารอบล่าสุดเพราะหน้านี้ใช้เฝ้าระวัง สิ่งที่เพิ่งเกิดสำคัญกว่าตอนเปิดกะ
    """
    ranked = (
        select(
            Inspection.station_id,
            Inspection.inspected_at,
            Inspection.cycle_seconds,
            func.row_number()
            .over(
                partition_by=Inspection.station_id,
                order_by=Inspection.inspected_at.desc(),
            )
            .label("rn"),
        )
        .where(in_day)
        .subquery()
    )
    rows = db.execute(
        select(ranked.c.station_id, ranked.c.cycle_seconds)
        .where(ranked.c.rn <= CYCLE_SAMPLE)
        .order_by(ranked.c.station_id, ranked.c.inspected_at)
    ).all()

    points: dict[int, list[CyclePoint]] = {}
    for station_id, seconds in rows:
        series = points.setdefault(station_id, [])
        series.append(CyclePoint(round=len(series) + 1, seconds=round(float(seconds), 2)))
    return points


def _station_events(db: Session, in_day) -> dict[int, list[DefectEvent]]:
    """เหตุการณ์ NG รายชิ้นของวันนั้น ส่งครบทุกแถว

    ไม่ตัดจำนวน เพราะหัวข้อการ์ดฝั่งหน้าจอนับจากความยาวลิสต์ ถ้าตัดแล้วตัวเลขจะโกหก
    ถ้าวันไหน NG เยอะจนก้อนใหญ่เกินไป ต้องไปทำแบ่งหน้าพร้อมกันทั้งสองฝั่ง
    """
    rows = db.execute(
        select(
            Defect.id,
            Inspection.station_id,
            _local(Inspection.inspected_at),
            Inspection.piece_no,
            DefectType.name,
            Defect.confidence,
        )
        .select_from(Defect)
        .join(Inspection, Inspection.id == Defect.inspection_id)
        .join(DefectType, DefectType.id == Defect.defect_type_id)
        .where(in_day)
        .order_by(Inspection.inspected_at)
    ).all()

    events: dict[int, list[DefectEvent]] = {}
    for defect_id, station_id, at, piece_no, defect_name, confidence in rows:
        events.setdefault(station_id, []).append(
            DefectEvent(
                id=f"ev-{defect_id}",
                time=at.strftime("%H:%M"),
                piece_no=piece_no,
                defect_name=defect_name,
                confidence=float(confidence),
            )
        )
    return events


def _produced(db: Session, in_day) -> int:
    """ชิ้นงานที่ผ่านสายวันนั้น นับหมายเลขชิ้นไม่ซ้ำ ไม่ใช่จำนวนแถวผลตรวจ
    (ชิ้นเดียวถูกตรวจทุกสถานีที่ผ่าน)
    """
    return db.scalar(select(func.count(func.distinct(Inspection.piece_no))).where(in_day)) or 0


def _production_target(db: Session, day: date) -> int:
    target = db.scalar(
        select(ProductionTarget.target_qty).where(ProductionTarget.target_date == day)
    )
    return target or 0


def _defect_types(db: Session, in_day) -> list[DefectTypeShare]:
    """สัดส่วนตามประเภทปัญหา เรียงมากไปน้อย — การ์ดโดนัทยุบส่วนเกินเป็น "อื่น ๆ" เอง"""
    rows = db.execute(
        select(DefectType.name, func.count(Defect.id))
        .select_from(Defect)
        .join(DefectType, DefectType.id == Defect.defect_type_id)
        .join(Inspection, Inspection.id == Defect.inspection_id)
        .where(in_day)
        .group_by(DefectType.name)
        .order_by(func.count(Defect.id).desc())
    ).all()

    total = sum(count for _, count in rows)
    if not total:
        return []
    return [
        DefectTypeShare(name=name, share=round(count / total, 4)) for name, count in rows
    ]


def _weekly_trend(db: Session, day: date) -> list[WeeklyPoint]:
    """อัตราของเสียราย ISO week ย้อนหลัง TREND_WEEKS สัปดาห์

    ส่งเฉพาะสัปดาห์ที่มีชิ้นงานจริง สัปดาห์ที่ยังไม่มีข้อมูลไม่ต้องใส่
    ไม่งั้นแท่ง 0% จะดูเหมือน "สัปดาห์นั้นไม่มีของเสีย" ทั้งที่แปลว่าไม่มีข้อมูล
    """
    monday = day - timedelta(days=day.weekday())
    first_monday = monday - timedelta(weeks=TREND_WEEKS - 1)
    start = datetime.combine(first_monday, time.min, ICT).astimezone(timezone.utc)
    _, end = _day_bounds(day)
    in_range = (Inspection.inspected_at >= start) & (Inspection.inspected_at < end)

    week = func.date_trunc("week", _local(Inspection.inspected_at))

    inspected = dict(
        db.execute(
            select(week, func.count(Inspection.id)).where(in_range).group_by(week)
        ).all()
    )
    defects = dict(
        db.execute(
            select(week, func.count(Defect.id))
            .select_from(Defect)
            .join(Inspection, Inspection.id == Defect.inspection_id)
            .where(in_range)
            .group_by(week)
        ).all()
    )

    points = []
    for week_start in sorted(inspected):
        points.append(
            WeeklyPoint(
                label=f"W{week_start.isocalendar().week}",
                defect_rate=_rate(defects.get(week_start, 0), inspected[week_start]),
            )
        )
    return points
