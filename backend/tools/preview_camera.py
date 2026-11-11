# ดูภาพสดจากกล้อง + FPS — รันมือเพื่อเช็คว่ากล้องยังใช้ได้ ไม่ใช่ unit test
# รันจากที่ไหนก็ได้: python backend/tools/preview_camera.py   (กด q เพื่อออก)
import time

import cv2

CAMERA_INDEX = 1

cap = cv2.VideoCapture(CAMERA_INDEX, cv2.CAP_DSHOW)
if not cap.isOpened():
    raise RuntimeError(f"เปิดกล้อง {CAMERA_INDEX} ไม่ได้")

prev = time.time()

while True:
    ok, frame = cap.read()
    if not ok:
        print("อ่านภาพไม่ได้")
        break

    now = time.time()
    fps = 1 / (now - prev)
    prev = now

    cv2.putText(frame, f"FPS: {fps:.1f}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("camera", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()