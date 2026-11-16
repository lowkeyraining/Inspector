"""เทสต์ว่าค่าตั้งและชั้น db ต่อ Postgres ได้จริง

ไม่ mock เพราะจุดประสงค์คือจับกรณี DSN ผิดหรือ container ไม่ขึ้น
ถ้า DB ไม่พร้อมให้ skip ไม่ใช่ fail เพื่อให้รันเทสต์ตัวอื่นต่อได้บนเครื่องที่ไม่ได้เปิด Docker
"""

import pytest
from sqlalchemy import text
from sqlalchemy.exc import OperationalError

from backend.app.db import engine


@pytest.fixture(scope="module")
def connection():
    try:
        with engine.connect() as conn:
            yield conn
    except OperationalError:
        pytest.skip("ต่อ Postgres ไม่ได้ — ลืมสั่ง docker compose up -d db หรือเปล่า")


def test_connects_to_the_project_database(connection):
    assert connection.execute(text("select current_database()")).scalar() == "inspector"


def test_database_runs_in_utc(connection):
    """เวลาใน DB ต้องเป็น UTC เสมอ ไปแปลงเป็นเวลาไทยที่ชั้นแสดงผล"""
    assert connection.execute(text("show timezone")).scalar() == "UTC"
