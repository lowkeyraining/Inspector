# รายชื่อสถานี: source เป็นเลขกล้อง USB หรือ URL rtsp://... ก็ได้
STATIONS = [
    {"id": "01", "name": "ขึ้นรูป", "source": 1},   # เว็บแคม USB
    {"id": "02", "name": "บรรจุ", "source": 0},     # กล้องโน้ตบุ๊ก
]

FRAME_WIDTH = 1280         # ความละเอียดที่ขอจากกล้อง (กล้องไม่รองรับจะได้ค่าใกล้ที่สุดแทน)
FRAME_HEIGHT = 720
MODEL_PATH = "yolo26n.pt"
CONF_THRESHOLD = 0.5
IMGSZ = 640                # ถ้าช้าให้ลดเป็น 320
JPEG_QUALITY = 80
ALERT_FRAMES = 5           # ต้องเจอติดกันกี่เฟรมถึงจะนับเป็นเหตุการณ์