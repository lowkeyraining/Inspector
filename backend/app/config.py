import os


def _source(value):
    """เลขกล้องให้เป็น int, URL (rtsp://...) ให้เป็น str"""
    return int(value) if value.isdigit() else value


CAMERA_SOURCE = _source(os.getenv("CAMERA_SOURCE", "1"))   # เลขกล้อง USB หรือ URL rtsp://... ก็ได้
MODEL_PATH = os.getenv("MODEL_PATH", "yolo26n.pt")
CONF_THRESHOLD = float(os.getenv("CONF_THRESHOLD", "0.5"))
IMGSZ = int(os.getenv("IMGSZ", "640"))                     # ถ้าช้าให้ลดเป็น 320
JPEG_QUALITY = int(os.getenv("JPEG_QUALITY", "80"))
