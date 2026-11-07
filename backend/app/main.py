import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.responses import StreamingResponse

from . import config
from .detector import InspectionManager

manager = InspectionManager(
    stations=config.STATIONS,
    model_path=config.MODEL_PATH,
    conf=config.CONF_THRESHOLD,
    imgsz=config.IMGSZ,
    jpeg_quality=config.JPEG_QUALITY,
    alert_frames=config.ALERT_FRAMES,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    manager.start()
    yield
    manager.stop()


app = FastAPI(title="Inspector API", lifespan=lifespan)


@app.get("/api/stations")
def stations():
    return manager.station_list()


@app.get("/api/health")
def health():
    return manager.get_status_all()


@app.get("/api/events")
def events():
    return manager.get_events_since(0)


async def mjpeg_frames(station_id: str):
    while True:
        jpeg = manager.get_jpeg(station_id)
        if jpeg is not None:
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + jpeg + b"\r\n")
        await asyncio.sleep(0.03)


@app.get("/api/stations/{station_id}/stream")
async def stream(station_id: str):
    if station_id not in manager.stations:
        raise HTTPException(status_code=404, detail="ไม่พบสถานีนี้")
    return StreamingResponse(
        mjpeg_frames(station_id),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.websocket("/ws/live")
async def ws_live(ws: WebSocket):
    await ws.accept()
    last_id = manager.last_event_id()
    try:
        while True:
            new_events = manager.get_events_since(last_id)
            if new_events:
                last_id = new_events[-1]["id"]
            await ws.send_json({
                "type": "status",
                "stations": manager.get_status_all(),
                "events": new_events,
            })
            await asyncio.sleep(0.2)
    except Exception:
        pass