import asyncio
from contextlib import asynccontextmanager
from datetime import date

from fastapi import Depends, FastAPI, Query
from fastapi.responses import HTMLResponse, StreamingResponse
from sqlalchemy.orm import Session

from . import config
from .camera import CameraWorker
from .dashboard import DashboardSummary, build_summary, today_in_thailand
from .db import get_db

camera = CameraWorker(
    source=config.CAMERA_SOURCE,
    model_path=config.MODEL_PATH,
    conf=config.CONF_THRESHOLD,
    imgsz=config.IMGSZ,
    jpeg_quality=config.JPEG_QUALITY,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    camera.start()
    yield
    camera.stop()


app = FastAPI(title="Inspector API", lifespan=lifespan)


@app.get("/health")
def health():
    return camera.get_status()


async def mjpeg_frames():
    while True:
        jpeg = camera.get_jpeg()
        if jpeg is not None:
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + jpeg + b"\r\n")
        await asyncio.sleep(0.03)


@app.get("/stream")
async def stream():
    return StreamingResponse(
        mjpeg_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.get("/dashboard", response_model=DashboardSummary)
def dashboard(
    day: date = Query(
        default_factory=today_in_thailand,
        alias="date",
        description="วันที่ต้องการดู (YYYY-MM-DD) ตามเวลาไทย ไม่ใส่ = วันนี้",
    ),
    db: Session = Depends(get_db),
):
    """สรุปทุกการ์ดของหน้า Dashboard ในวันเดียว

    วันที่ไม่มีข้อมูลไม่ถือว่าผิดพลาด — คืนค่าศูนย์/ลิสต์ว่าง
    แล้วให้หน้าจอขึ้นสถานะรอข้อมูลเอง
    """
    return build_summary(db, day)


# หน้าดูภาพสดแบบง่าย ๆ สำหรับ dev — ไม่ใช่ UI จริง (UI จริงอยู่ที่ frontend/)
# ต้องมีเพราะ Chrome เลิก render multipart/x-mixed-replace ตอนเปิดเป็นแท็บตรง ๆ แล้ว
# (เปิด /stream เองจะได้หน้าขาวหรือกลายเป็นดาวน์โหลดไฟล์) แต่ยังรับใน <img> ได้ปกติ
VIEW_PAGE = """<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Inspector — ภาพสด</title>
  <style>
    body { margin: 0; background: #111; color: #eee; font: 14px system-ui, sans-serif;
           display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 16px }
    img { max-width: 100%; border-radius: 8px; background: #000 }
    #status { font-variant-numeric: tabular-nums }
  </style>
</head>
<body>
  <img src="/stream" alt="ภาพสดจากกล้อง">
  <div id="status">กำลังต่อกล้อง…</div>
  <script>
    // ภาพมาจาก <img> อยู่แล้ว ตรงนี้แค่ดึงตัวเลขมาโชว์ว่าเธรดกล้องยังเดินอยู่จริง
    async function tick() {
      try {
        const r = await fetch("/health")
        const d = await r.json()
        const names = d.detections.map((x) => x.class + " " + Math.round(x.confidence * 100) + "%")
        document.getElementById("status").textContent =
          "กล้อง " + d.source + " · " + d.fps.toFixed(1) + " fps · " +
          (names.length ? names.join(", ") : "ไม่พบวัตถุ")
      } catch {
        document.getElementById("status").textContent = "ต่อ backend ไม่ได้"
      }
    }
    tick()
    setInterval(tick, 1000)
  </script>
</body>
</html>
"""


@app.get("/view", response_class=HTMLResponse)
def view():
    return VIEW_PAGE
