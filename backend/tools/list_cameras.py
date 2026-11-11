# ไล่หาว่ากล้องหมายเลขไหนเสียบอยู่บ้าง เอาเลขที่ได้ไปตั้ง CAMERA_SOURCE
# รันจากที่ไหนก็ได้: python backend/tools/list_cameras.py
import cv2

for i in range(5):                                  # ลองกล้องหมายเลข 0 ถึง 4
    cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)
    if cap.isOpened():
        ok, frame = cap.read()
        if ok:
            print(f"กล้อง {i}: ใช้ได้ ขนาดภาพ {frame.shape}")
        else:
            print(f"กล้อง {i}: เปิดได้แต่อ่านภาพไม่ได้")
    else:
        print(f"กล้อง {i}: ไม่มี")
    cap.release()                                   # ปล่อยกล้องคืนทุกครั้ง