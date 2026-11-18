"""เทสต์ตัวสร้างข้อมูลจำลองของหน้า Dashboard

เทสต์เฉพาะส่วนที่คิดค่าเอง (เวลาในกะ, cycle time, ตารางค่าคงที่)
ไม่แตะฐานข้อมูล เพราะ seed จริงต้อง --reset ซึ่งจะล้างข้อมูลที่อยู่บนเครื่องคนรันเทสต์
"""

from datetime import date, timedelta

import pytest

from backend.app.db.models import Station
from backend.tools.seed_dashboard import (
    DEFECTS_BY_STATION,
    ICT,
    STATION_SPECS,
    WEEKDAY_LOAD,
    _cycle_seconds,
    _piece_times,
)

import random

MONDAY = date(2026, 11, 16)


@pytest.fixture
def rng():
    return random.Random(1)


def test_station_specs_match_the_station_model(rng):
    """ค่าคงที่ต้องสร้าง Station ได้ตรง ๆ ไม่งั้น seed จะพังตอนรันจริงเท่านั้น"""
    for code, order_no, name, standard, tolerance, _ in STATION_SPECS:
        station = Station(
            code=code,
            order_no=order_no,
            name=name,
            standard_cycle_time=standard,
            cycle_tolerance=tolerance,
        )
        assert station.code == code
        assert code in DEFECTS_BY_STATION


def test_every_station_order_is_unique():
    """ลำดับซ้ำจะติด unique constraint ของตาราง stations"""
    orders = [order_no for _, order_no, *_ in STATION_SPECS]
    assert sorted(orders) == list(range(1, len(STATION_SPECS) + 1))


def test_every_weekday_produces_something():
    """ทุกวันในสัปดาห์ต้องมีงาน ไม่งั้นหน้า Dashboard จะเจอวันว่างตอนกดย้อนหลัง"""
    assert sorted(WEEKDAY_LOAD) == list(range(7))
    assert all(load > 0 for load in WEEKDAY_LOAD.values())


def test_piece_times_stay_inside_the_shift(rng):
    times = _piece_times(rng, MONDAY, 200)
    local = [moment.astimezone(ICT) for moment in times]

    assert len(local) == 200
    assert all(moment.date() == MONDAY for moment in local)
    assert local[0].hour >= 8
    assert local[-1].hour < 17 or (local[-1].hour == 17 and local[-1].minute == 0)


def test_piece_times_are_stored_in_utc(rng):
    """DB ตั้ง TZ=UTC ถ้าเขียนเวลาไทยลงไปตรง ๆ กราฟจะเลื่อนไป 7 ชั่วโมง"""
    moment = _piece_times(rng, MONDAY, 1)[0]
    assert moment.utcoffset() == timedelta(0)


def test_piece_times_skip_the_lunch_break(rng):
    local = [moment.astimezone(ICT) for moment in _piece_times(rng, MONDAY, 500)]
    assert not any(moment.hour == 12 for moment in local)


def test_piece_times_run_in_order(rng):
    times = _piece_times(rng, MONDAY, 300)
    assert times == sorted(times)


def test_cycle_seconds_mostly_lands_near_the_standard(rng):
    standard, tolerance = 4.6, 0.6
    values = [_cycle_seconds(rng, standard, tolerance) for _ in range(2_000)]
    inside = [value for value in values if abs(value - standard) < tolerance]

    # ตั้งใจให้มีบางชิ้นหลุดช่วง เพื่อให้กราฟ cycle time มีแท่งแดงให้เห็น
    assert 0.6 < len(inside) / len(values) < 0.95
    assert all(value > 0 for value in values)
