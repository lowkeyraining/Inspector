import os


def _source(value):
    """เลขกล้องให้เป็น int, URL (rtsp://...) ให้เป็น str"""
    return int(value) if value.isdigit() else value


CAMERA_SOURCE = _source(os.getenv("CAMERA_SOURCE", "1"))   # เลขกล้อง USB หรือ URL rtsp://... ก็ได้
MODEL_PATH = os.getenv("MODEL_PATH", "yolo26n.pt")
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", "0.5"))
IMGSZ = int(os.getenv("IMGSZ", "640"))                     # ถ้าช้าให้ลดเป็น 320
JPEG_QUALITY = int(os.getenv("JPEG_QUALITY", "80"))

# ฐานข้อมูล — DSN เดียวทั้งโปรเจกต์ (แอป, alembic, เทสต์ อ่านจากตัวนี้)
# ค่าเริ่มต้นชี้ไป Postgres ที่ docker compose ยกขึ้นบนเครื่องเดียวกัน
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://inspector:inspector@127.0.0.1:5432/inspector",
)
SQL_ECHO = os.getenv("SQL_ECHO", "0") == "1"               # เปิดดู SQL ตอนไล่ปัญหา

# ภาพ snapshot เก็บเป็นไฟล์บนดิสก์ ในตารางเก็บแค่ path
# เหตุผล: ไฟล์ภาพโตเร็วกว่าตัวข้อมูลหลายสิบเท่า ถ้าใส่ลง DB จะ dump/restore ไม่ไหว
SNAPSHOT_DIR = os.getenv("SNAPSHOT_DIR", "data/snapshots")
