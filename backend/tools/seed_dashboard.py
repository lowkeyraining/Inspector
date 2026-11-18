"""สร้างข้อมูลจำลองของหน้า Dashboard ลงฐานข้อมูล

ใช้ระหว่างที่ยังไม่มีกล้องจริงเดินสาย เพื่อให้ endpoint `/dashboard` (M5)
และการ์ดบนหน้าจอมีข้อมูลให้ลองจริง ไม่ต้องพึ่ง MOCK_DASHBOARD ฝั่ง frontend

รัน (จาก root ของโปรเจกต์):
    python backend/tools/seed_dashboard.py --reset           # 5 วันล่าสุดถึงวันนี้
    python backend/tools/seed_dashboard.py --days 5 --end-date 2026-11-18 --reset
    python backend/tools/seed_dashboard.py --pieces 2000 --reset

ค่าสุ่มล็อก seed ไว้ จึงได้ชุดเดิมทุกครั้งที่ end-date เท่ากัน — เทียบเลขบนจอกับใน DB ได้
เวลาเก็บเป็น UTC ตามที่ DB ตั้งไว้ แต่กะทำงานคิดจากเวลาไทย (UTC+7 ไม่มี DST)
"""

from __future__ import annotations

import argparse
import random
import sys
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path

# ให้รันไฟล์นี้ตรง ๆ ได้ ไม่ต้องสั่งผ่าน python -m
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

from sqlalchemy import delete, select, text  # noqa: E402

from backend.app.db import SessionLocal, engine  # noqa: E402
from backend.app.db.models import (  # noqa: E402
    Defect,
    DefectType,
    Inspection,
    ProductionTarget,
    Station,
)

ICT = timezone(timedelta(hours=7))

RANDOM_SEED = 20261118

# กะทำงาน 08:00–17:00 เวลาไทย พักเที่ยง 12:00–13:00 (ช่วงพักไม่มีชิ้นงานเข้า)
SHIFT_START = time(8, 0)
SHIFT_END = time(17, 0)
BREAK_START = time(12, 0)
BREAK_END = time(13, 0)

PIECES_PER_DAY = 6_900
PRODUCTION_TARGET = 7_000

# สถานีตามลำดับในสาย: รหัส, ลำดับ, ชื่อ, เวลามาตรฐาน(วิ), ช่วงที่ยอมรับ(±วิ), อัตราของเสียฐาน
STATION_SPECS = [
    ("st-01", 1, "ขึ้นรูป", 5.0, 0.7, 0.008),
    ("st-02", 2, "เจาะรู", 3.8, 0.5, 0.005),
    ("st-03", 3, "เชื่อม", 4.6, 0.6, 0.021),
    ("st-04", 4, "พ่นสี", 6.2, 0.8, 0.009),
    ("st-05", 5, "ประกอบ", 3.0, 0.4, 0.064),
    ("st-06", 6, "บรรจุ", 4.0, 0.5, 0.011),
    ("st-07", 7, "ติดฉลาก", 2.4, 0.3, 0.003),
    ("st-08", 8, "ตรวจสอบ", 3.5, 0.5, 0.004),
]

# ปัญหาที่พบได้ในแต่ละสถานี พร้อมน้ำหนักการสุ่ม
# ชื่อซ้ำข้ามสถานีได้ (เช่น รอยขีดข่วน) เพราะโดนัทบนหน้า Dashboard จับกลุ่มด้วยชื่อ
DEFECTS_BY_STATION = {
    "st-01": [("ขึ้นรูปไม่ได้ขนาด", 3), ("รอยขีดข่วน", 1)],
    "st-02": [("รูเยื้องศูนย์", 3), ("รูไม่ครบ", 1)],
    "st-03": [("รอยเชื่อมมีรูพรุน", 3), ("รอยแตก", 2), ("เชื่อมไม่ติด", 1)],
    "st-04": [("สีไม่สม่ำเสมอ", 3), ("สีหลุดลอก", 1), ("รอยขีดข่วน", 1)],
    "st-05": [("ประกอบไม่ได้ระยะ", 5), ("ชิ้นส่วนขาด", 2), ("รอยขีดข่วน", 1)],
    "st-06": [("บรรจุไม่ครบ", 2), ("กล่องบุบ", 1)],
    "st-07": [("ฉลากเอียง", 2), ("ฉลากซ้ำ", 1)],
    "st-08": [("ชิ้นส่วนขาด", 1), ("รอยขีดข่วน", 1)],
}

# ตัวคูณอัตราของเสียรายวัน ไล่จากวันเก่าสุดไปวันล่าสุด
# ตั้งให้วันท้าย ๆ แย่ขึ้น เพื่อให้กราฟแนวโน้มมีทิศทาง ไม่ใช่เส้นแบน
DAILY_DEFECT_FACTOR = [0.72, 0.88, 1.05, 0.95, 1.30]

# สัดส่วนชิ้นงานที่ cycle time หลุดช่วงที่ยอมรับ
OUT_OF_TOLERANCE_SHARE = 0.08

# ตัวคูณปริมาณงานตามวันในสัปดาห์ (0 = จันทร์) — เสาร์ครึ่งวัน อาทิตย์เดิน OT
# ไม่ปล่อยให้วันไหนว่างเลย เพราะหน้า Dashboard เลือกดูย้อนหลังได้ทุกวันในช่วง
WEEKDAY_LOAD = {0: 1.0, 1: 1.0, 2: 1.0, 3: 1.0, 4: 1.0, 5: 0.5, 6: 0.35}


def _weighted_pick(rng: random.Random, options: list[tuple[str, int]]) -> str:
    names = [name for name, _ in options]
    weights = [weight for _, weight in options]
    return rng.choices(names, weights=weights, k=1)[0]


def _piece_times(rng: random.Random, day: date, count: int) -> list[datetime]:
    """กระจายเวลาชิ้นงานทั้งวันตามจังหวะสาย เว้นช่วงพักเที่ยง คืนค่าเป็น UTC

    ไม่สุ่มเวลาทั้งวันอิสระ เพราะจะได้กราฟรายชั่วโมงที่ฟันหลอไม่เหมือนสายผลิตจริง
    """
    shift_start = datetime.combine(day, SHIFT_START, ICT)
    morning = (datetime.combine(day, BREAK_START, ICT) - shift_start).total_seconds()
    afternoon = (
        datetime.combine(day, SHIFT_END, ICT) - datetime.combine(day, BREAK_END, ICT)
    ).total_seconds()
    break_seconds = (
        datetime.combine(day, BREAK_END, ICT) - datetime.combine(day, BREAK_START, ICT)
    ).total_seconds()
    working = morning + afternoon

    times = []
    for index in range(count):
        offset = working * (index + rng.random()) / count
        if offset >= morning:
            offset += break_seconds
        times.append((shift_start + timedelta(seconds=offset)).astimezone(timezone.utc))
    return times


def _cycle_seconds(rng: random.Random, standard: float, tolerance: float) -> float:
    """cycle time รายชิ้น — ปกติเกาะค่ามาตรฐาน แต่บางชิ้นหลุดช่วงที่ยอมรับ"""
    if rng.random() < OUT_OF_TOLERANCE_SHARE:
        drift = tolerance * rng.uniform(1.05, 2.2)
        value = standard + (drift if rng.random() < 0.7 else -drift)
    else:
        value = standard + rng.gauss(0, tolerance * 0.45)
    return round(max(0.5, value), 2)


def clear_seeded_data(session) -> None:
    """ล้างตารางที่สคริปต์นี้เขียน ไล่จากตารางลูกไปตารางแม่"""
    session.execute(delete(Defect))
    session.execute(delete(Inspection))
    session.execute(delete(ProductionTarget))
    session.execute(delete(Station))
    session.execute(delete(DefectType))
    # ล้างแล้วให้ id เริ่มที่ 1 ใหม่ เพื่อให้รันซ้ำได้ชุดเดิมเป๊ะ
    session.execute(
        text(
            "alter sequence stations_id_seq restart with 1;"
            "alter sequence defect_types_id_seq restart with 1;"
            "alter sequence inspections_id_seq restart with 1;"
            "alter sequence defects_id_seq restart with 1;"
            "alter sequence production_targets_id_seq restart with 1"
        )
    )
    session.commit()


def seed(end_date: date, days: int, pieces_per_day: int, reset: bool) -> dict:
    rng = random.Random(RANDOM_SEED)
    start_date = end_date - timedelta(days=days - 1)

    with SessionLocal() as session:
        if reset:
            clear_seeded_data(session)
        elif session.scalar(select(Station.id).limit(1)) is not None:
            raise SystemExit("ในฐานข้อมูลมีข้อมูลอยู่แล้ว — ใส่ --reset ถ้าจะล้างแล้วสร้างใหม่")

        stations = [
            Station(
                code=code,
                order_no=order_no,
                name=name,
                standard_cycle_time=standard,
                cycle_tolerance=tolerance,
            )
            for code, order_no, name, standard, tolerance, _ in STATION_SPECS
        ]
        session.add_all(stations)

        names = sorted({name for options in DEFECTS_BY_STATION.values() for name, _ in options})
        defect_types = [DefectType(name=name) for name in names]
        session.add_all(defect_types)
        session.flush()

        station_id = {station.code: station.id for station in stations}
        defect_type_id = {defect_type.name: defect_type.id for defect_type in defect_types}

        # เขียนผลตรวจด้วย COPY ไม่ใช่ ORM เพราะ 5 วันคูณ 8 สถานีเป็นหลักแสนแถว
        # จึงกำหนด id เองแล้วค่อยเลื่อน sequence ตามหลัง (ดู _copy_rows)
        inspection_rows: list[tuple] = []
        defect_rows: list[tuple] = []
        inspection_id = 1
        defect_id = 1
        pieces_total = 0

        for day_index in range(days):
            day = start_date + timedelta(days=day_index)
            load = WEEKDAY_LOAD[day.weekday()]

            # ผลิตได้จริงเขยิบรอบเป้าเล็กน้อย (ส่วนใหญ่ขาดเป้าอยู่หน่อย)
            day_target = max(1, round(pieces_per_day * load))
            day_pieces = max(1, int(day_target * rng.uniform(0.96, 1.01)))
            pieces_total += day_pieces

            session.add(ProductionTarget(target_date=day, target_qty=day_target))

            factor = DAILY_DEFECT_FACTOR[day_index % len(DAILY_DEFECT_FACTOR)]
            times = _piece_times(rng, day, day_pieces)

            for code, order_no, _, standard, tolerance, base_rate in STATION_SPECS:
                sid = station_id[code]
                rate = min(0.5, base_rate * factor)
                options = DEFECTS_BY_STATION[code]
                # ชิ้นงานเดินตามสาย สถานีถัดไปจึงเห็นชิ้นเดิมช้ากว่าสถานีก่อนหน้า
                lag = timedelta(seconds=(order_no - 1) * 45)

                for index, piece_time in enumerate(times):
                    piece_no = f"{day.strftime('%y%m%d')}-{index + 1:05d}"
                    inspection_rows.append(
                        (
                            inspection_id,
                            sid,
                            piece_no,
                            (piece_time + lag).isoformat(),
                            _cycle_seconds(rng, standard, tolerance),
                        )
                    )
                    if rng.random() < rate:
                        name = _weighted_pick(rng, options)
                        defect_rows.append(
                            (
                                defect_id,
                                inspection_id,
                                defect_type_id[name],
                                round(rng.uniform(0.55, 0.96), 3),
                                f"data/snapshots/{day.isoformat()}/{code}-{piece_no}.jpg",
                            )
                        )
                        defect_id += 1
                    inspection_id += 1

        session.commit()

    _copy_rows(inspection_rows, defect_rows)
    return {
        "start_date": start_date,
        "end_date": end_date,
        "stations": len(stations),
        "defect_types": len(defect_types),
        "pieces": pieces_total,
        "inspections": len(inspection_rows),
        "defects": len(defect_rows),
    }


def _copy_rows(inspection_rows: list[tuple], defect_rows: list[tuple]) -> None:
    """ยัดแถวจำนวนมากด้วย COPY ของ psycopg แล้วเลื่อน sequence ตามหลัง"""
    raw = engine.raw_connection()
    try:
        with raw.cursor() as cur:
            statement = (
                "copy inspections (id, station_id, piece_no, inspected_at, cycle_seconds)"
                " from stdin"
            )
            with cur.copy(statement) as copy:
                for row in inspection_rows:
                    copy.write_row(row)

            statement = (
                "copy defects (id, inspection_id, defect_type_id, confidence, snapshot_path)"
                " from stdin"
            )
            with cur.copy(statement) as copy:
                for row in defect_rows:
                    copy.write_row(row)

            # COPY ไม่แตะ sequence ถ้าไม่เลื่อนเอง การ insert ครั้งถัดไปจะชน primary key
            cur.execute("select setval('inspections_id_seq', greatest(1, %s))", (len(inspection_rows),))
            cur.execute("select setval('defects_id_seq', greatest(1, %s))", (len(defect_rows),))
        raw.commit()
    finally:
        raw.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="สร้างข้อมูลจำลองของหน้า Dashboard ลงฐานข้อมูล")
    parser.add_argument("--days", type=int, default=5, help="จำนวนวันย้อนหลังรวมวันสุดท้าย (ค่าเริ่มต้น 5)")
    parser.add_argument(
        "--end-date",
        type=date.fromisoformat,
        default=datetime.now(ICT).date(),
        help="วันสุดท้ายของช่วง รูปแบบ YYYY-MM-DD (ค่าเริ่มต้น วันนี้ตามเวลาไทย)",
    )
    parser.add_argument("--pieces", type=int, default=PIECES_PER_DAY, help="ชิ้นงานต่อวันทำงาน")
    parser.add_argument("--reset", action="store_true", help="ล้างข้อมูลเดิมก่อนสร้างใหม่")
    args = parser.parse_args()

    if args.days < 1:
        raise SystemExit("--days ต้องมากกว่า 0")
    if args.pieces < 1:
        raise SystemExit("--pieces ต้องมากกว่า 0")

    result = seed(args.end_date, args.days, args.pieces, args.reset)
    print(
        f"สร้างข้อมูลจำลอง {result['start_date']} ถึง {result['end_date']} สำเร็จ\n"
        f"  สถานี          {result['stations']:>9,}\n"
        f"  ประเภทปัญหา    {result['defect_types']:>9,}\n"
        f"  ชิ้นงาน        {result['pieces']:>9,}\n"
        f"  ผลตรวจ         {result['inspections']:>9,}\n"
        f"  พบปัญหา        {result['defects']:>9,}"
    )


if __name__ == "__main__":
    main()
