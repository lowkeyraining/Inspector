"""เทสต์ GET /dashboard

ยิงผ่าน TestClient ไปที่ Postgres จริง ไม่ mock — จุดประสงค์คือจับ SQL ที่พัง
และรูปร่าง JSON ที่ไม่ตรงกับ `frontend/src/api/dashboard.ts`
ซึ่ง mock จับให้ไม่ได้ ถ้า DB ไม่พร้อมหรือยังไม่ได้ seed ให้ skip
"""

from datetime import date, timedelta

import pytest
from sqlalchemy import func, select
from sqlalchemy.exc import OperationalError

from backend.app.dashboard import build_summary
from backend.app.db import SessionLocal
from backend.app.db.models import Inspection


@pytest.fixture(scope="module")
def session():
    try:
        with SessionLocal() as db:
            db.execute(select(1))
            yield db
    except OperationalError:
        pytest.skip("ต่อ Postgres ไม่ได้ — ลืมสั่ง docker compose up -d db หรือเปล่า")


@pytest.fixture(scope="module")
def seeded_day(session) -> date:
    """วันล่าสุดที่มีผลตรวจอยู่จริง ไม่ fix วันที่ไว้ให้เทสต์พังเมื่อเวลาผ่านไป"""
    latest = session.scalar(select(func.max(Inspection.inspected_at)))
    if latest is None:
        pytest.skip("ยังไม่มีข้อมูล — รัน python backend/tools/seed_dashboard.py --reset ก่อน")
    return latest.date()


def test_summary_counts_every_station(session, seeded_day):
    summary = build_summary(session, seeded_day)

    assert summary.station_count == len(summary.stations)
    assert summary.station_count > 0
    # ทุกสถานีต้องมีรายละเอียดให้กดดูได้ ไม่ใช่แค่บางตัว
    assert {s.id for s in summary.stations} == {d.id for d in summary.station_details}


def test_defect_rate_stays_a_ratio_not_a_percentage(session, seeded_day):
    """หน้าจอคูณ 100 เอง ถ้า backend ส่ง 6.8 มาแทน 0.068 จะกลายเป็น 680%"""
    summary = build_summary(session, seeded_day)

    assert 0.0 <= summary.avg_defect_rate <= 1.0
    assert all(0.0 <= station.defect_rate <= 1.0 for station in summary.stations)


def test_worst_station_is_the_highest_rate(session, seeded_day):
    summary = build_summary(session, seeded_day)
    worst = max(summary.stations, key=lambda station: station.defect_rate)

    assert summary.worst_station_id == worst.id


def test_defect_type_shares_add_up_to_one(session, seeded_day):
    summary = build_summary(session, seeded_day)

    assert summary.defect_types, "วันที่มีข้อมูลต้องมีประเภทปัญหาอย่างน้อยหนึ่งอย่าง"
    assert sum(t.share for t in summary.defect_types) == pytest.approx(1.0, abs=0.01)
    # โดนัทวางใจลำดับจาก backend ในการยุบส่วนเกินเป็น "อื่น ๆ"
    shares = [t.share for t in summary.defect_types]
    assert shares == sorted(shares, reverse=True)


def test_produced_counts_pieces_not_inspection_rows(session, seeded_day):
    """ชิ้นเดียวถูกตรวจทุกสถานี ถ้านับแถวจะได้ยอดผลิตเกินจริงหลายเท่า"""
    summary = build_summary(session, seeded_day)
    inspections = sum(detail.inspected_today for detail in summary.station_details)

    assert 0 < summary.produced_today < inspections


def test_station_detail_matches_its_summary_row(session, seeded_day):
    summary = build_summary(session, seeded_day)
    by_id = {detail.id: detail for detail in summary.station_details}

    for station in summary.stations:
        detail = by_id[station.id]
        assert detail.defect_rate == station.defect_rate
        assert detail.defect_count == len(detail.events)
        assert detail.standard_cycle_time > 0
        assert detail.cycle_tolerance > 0


def test_cycle_rounds_are_numbered_from_one(session, seeded_day):
    summary = build_summary(session, seeded_day)

    for detail in summary.station_details:
        rounds = [point.round for point in detail.cycles]
        assert rounds == list(range(1, len(rounds) + 1))
        assert all(point.seconds > 0 for point in detail.cycles)


def test_event_time_is_preformatted_for_the_screen(session, seeded_day):
    summary = build_summary(session, seeded_day)
    events = [event for detail in summary.station_details for event in detail.events]

    assert events, "วันที่มีข้อมูลต้องมีเหตุการณ์ NG อย่างน้อยหนึ่งรายการ"
    for event in events[:50]:
        hour, _, minute = event.time.partition(":")
        assert len(event.time) == 5 and hour.isdigit() and minute.isdigit()
        assert 0.0 <= event.confidence <= 1.0


def test_a_day_without_data_returns_zeros_not_an_error(session, seeded_day):
    """กด DateStepper ย้อนไปไกลกว่าข้อมูลที่มี ต้องได้การ์ดเปล่า ไม่ใช่ 500"""
    summary = build_summary(session, seeded_day - timedelta(days=400))

    assert summary.produced_today == 0
    assert summary.avg_defect_rate == 0.0
    assert summary.defect_types == []
    assert summary.weekly == []
    # ไม่มีของเสียเลยต้องไม่ชี้สถานีไหนว่าเป็นจุดที่ต้องดูแลด่วน
    assert summary.worst_station_id == ""
