import threading
import time

import cv2
from ultralytics import YOLO


class CameraWorker:
    """อ่านภาพจากกล้อง ส่งเข้า YOLO แล้วเก็บผลล่าสุดไว้ให้ API มาหยิบ"""

    def __init__(self, source, model_path, conf, imgsz, jpeg_quality):
        self.source = source
        self.model = YOLO(model_path)
        self.conf = conf
        self.imgsz = imgsz
        self.jpeg_quality = jpeg_quality

        self._lock = threading.Lock()
        self._jpeg = None
        self._detections = []
        self._fps = 0.0
        self._running = False
        self._thread = None

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=2)

    def _loop(self):
        backend = cv2.CAP_DSHOW if isinstance(self.source, int) else cv2.CAP_ANY
        cap = cv2.VideoCapture(self.source, backend)
        if not cap.isOpened():
            print(f"[camera] เปิดกล้อง {self.source} ไม่ได้")
            return

        prev = time.time()
        while self._running:
            ok, frame = cap.read()
            if not ok:
                time.sleep(0.1)
                continue

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
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
                cv2.putText(frame, f"{name} {conf:.0%}", (x1, y1 - 8),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

            now = time.time()
            fps = 1 / (now - prev) if now > prev else 0.0
            prev = now

            ok, buf = cv2.imencode(".jpg", frame,
                                   [cv2.IMWRITE_JPEG_QUALITY, self.jpeg_quality])
            if not ok:
                continue

            with self._lock:
                self._jpeg = buf.tobytes()
                self._detections = detections
                self._fps = fps

        cap.release()

    def get_jpeg(self):
        with self._lock:
            return self._jpeg

    def get_status(self):
        with self._lock:
            return {
                "source": self.source,
                "fps": round(self._fps, 1),
                "detections": list(self._detections),
            }