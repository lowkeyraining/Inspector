import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from . import config
from .camera import CameraWorker

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