import threading
import time
from collections import deque

import cv2
from ultralytics import YOLO

from .camera import CameraReader

BOX_COLOR = (94, 63, 244)      # BGR ของ #F43F5E สีชมพูแดงแบบ mockup
TEXT_COLOR = (255, 255, 255)


def draw_box(frame, x1, y1, x2, y2, label):
    """วาดกรอบ + ป้ายพื้นทึบที่มุมซ้ายบนด้านในกรอบ"""
    cv2.rectangle(frame, (x1, y1), (x2, y2), BOX_COLOR, 2)
    font = cv2.FONT_HERSHEY_SIMPLEX
    scale, thick = 0.5, 1
    (tw, th), _ = cv2.getTextSize(label, font, scale, thick)
    cv2.rectangle(frame, (x1, y1), (x1 + tw + 12, y1 + th + 12), BOX_COLOR, -1)
    cv2.putText(frame, label, (x1 + 6, y1 + th + 6), font, scale,
                TEXT_COLOR, thick, cv2.LINE_AA)


class StationState:
    """ข้อมูลล่าสุดของสถานี 1 สถานี"""

    def __init__(self, info):
        self.id = info["id"]
        self.name = info["name"]
        self.source = info["source"]
        self.reader = CameraReader(self.source)

        self.jpeg = None
        self.detections = []
        self.fps = 0.0
        self.camera_ok = False

        self.streak = 0
        self.last_frame_id = 0
        self.last_time = time.time()


class InspectionManager:
    """ดูแลทุกสถานี: กล้องละ 1 thread สำหรับอ่านภาพ + YOLO ตัวเดียววนตรวจทุกกล้อง"""

    def __init__(self, stations, model_path, conf, imgsz, jpeg_quality, alert_frames):
        self.model = YOLO(model_path)
        self.conf = conf
        self.imgsz = imgsz
        self.jpeg_quality = jpeg_quality
        self.alert_frames = alert_frames

        self.stations = {s["id"]: StationState(s) for s in stations}

        self._lock = threading.Lock()
        self._events = deque(maxlen=200)
        self._event_seq = 0

        self._running = False
        self._thread = None

    # ---------- เริ่ม / หยุด ----------

    def start(self):
        for st in self.stations.values():
            st.reader.start()
        self._running = True
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=3)
        for st in self.stations.values():
            st.reader.stop()

    # ---------- ลูปตรวจจับ ----------

    def _loop(self):
        while self._running:
            did_work = False
            for st in self.stations.values():
                frame_id, frame, ok = st.reader.latest()

                if not ok:
                    with self._lock:
                        st.camera_ok = False
                        st.jpeg = None
                        st.detections = []
                        st.fps = 0.0
                        st.streak = 0
                    continue

                if frame is None or frame_id == st.last_frame_id:
                    continue   # ยังไม่มีเฟรมใหม่ ข้ามไปกล้องถัดไป

                st.last_frame_id = frame_id
                did_work = True
                self._process(st, frame.copy())

            if not did_work:
                time.sleep(0.005)

    def _process(self, st, frame):
        r = self.model(frame, imgsz=self.imgsz, conf=self.conf, verbose=False)[0]

        detections = []
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            conf = float(box.conf[0])
            name = self.model.names[int(box.cls[0])]
            detections.append({
                "class": name,
                "confidence": round(conf, 3),
                "bbox": [x1, y1, x2, y2],
            })
            draw_box(frame, x1, y1, x2, y2, f"{name} {conf:.0%}")

        now = time.time()
        fps = 1 / (now - st.last_time) if now > st.last_time else 0.0
        st.last_time = now

        ok, buf = cv2.imencode(".jpg", frame,
                               [cv2.IMWRITE_JPEG_QUALITY, self.jpeg_quality])
        if not ok:
            return

        with self._lock:
            st.camera_ok = True
            st.jpeg = buf.tobytes()
            st.detections = detections
            st.fps = fps
            self._update_alert(st, detections, now)

    def _update_alert(self, st, detections, now):
        """นับเฟรมที่เจอติดกันของแต่ละสถานี ครบ alert_frames เมื่อไรค่อยสร้างเหตุการณ์ 1 ครั้ง"""
        if not detections:
            st.streak = 0
            return
        st.streak += 1
        if st.streak == self.alert_frames:
            top = max(detections, key=lambda d: d["confidence"])
            self._event_seq += 1
            self._events.append({
                "id": self._event_seq,
                "station_id": st.id,
                "timestamp": now,
                "class": top["class"],
                "confidence": top["confidence"],
            })

    # ---------- ให้ API เรียกใช้ ----------

    def station_list(self):
        return [
            {"id": st.id, "name": st.name, "source": st.source}
            for st in self.stations.values()
        ]

    def get_jpeg(self, station_id):
        with self._lock:
            st = self.stations.get(station_id)
            return st.jpeg if st else None

    def get_status_all(self):
        with self._lock:
            return {
                st.id: {
                    "camera_ok": st.camera_ok,
                    "fps": round(st.fps, 1),
                    "detections": list(st.detections),
                }
                for st in self.stations.values()
            }

    def get_events_since(self, last_id):
        with self._lock:
            return [e for e in self._events if e["id"] > last_id]

    def last_event_id(self):
        with self._lock:
            return self._event_seq