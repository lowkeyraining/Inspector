# ดูผลตรวจจับของโมเดลบนภาพสด — รันมือเพื่อเช็คว่าโมเดลยังทำงาน ไม่ใช่ unit test
# รันจากที่ไหนก็ได้: python backend/tools/preview_yolo.py   (กด q เพื่อออก)
import time
from pathlib import Path

import cv2
from ultralytics import YOLO

CAMERA_INDEX = 1
CONF_THRESHOLD = 0.5

# อิงจากตำแหน่งไฟล์นี้ ไม่ใช่ working directory จะได้รันจากโฟลเดอร์ไหนก็เจอโมเดล
MODEL_PATH = Path(__file__).resolve().parent.parent / "yolo26n.pt"

model = YOLO(MODEL_PATH)

cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
if not cap.isOpened():
    raise RuntimeError(f"เปิดกล้อง {CAMERA_INDEX} ไม่ได้")

prev = time.time()

while True:
    ok, frame = cap.read()
    if not ok:
        break

    results = model(frame, verbose=False)
    r = results[0]

    for box in r.boxes:
        conf = float(box.conf[0])
        if conf < CONF_THRESHOLD:
            continue

        x1, y1, x2, y2 = map(int, box.xyxy[0])
        cls_id = int(box.cls[0])
        name = model.names[cls_id]

        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)
        cv2.putText(frame, f"{name} {conf:.0%}", (x1, y1 - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

    now = time.time()
    fps = 1 / (now - prev)
    prev = now
    cv2.putText(frame, f"FPS: {fps:.1f}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("yolo", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()