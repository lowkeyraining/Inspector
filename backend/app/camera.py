import threading
import time

import cv2

from . import config

RETRY_SECONDS = 2              # เปิดกล้องไม่ได้ ให้ลองใหม่ทุกกี่วินาที
MAX_READ_FAILS = 30            # อ่านภาพพลาดติดกันกี่ครั้งถึงจะถือว่ากล้องหลุด


class CameraReader:
    """อ่านภาพจากกล้อง 1 ตัวใน thread ของตัวเอง เก็บไว้แค่เฟรมล่าสุด"""

    def __init__(self, source):
        self.source = source
        self._lock = threading.Lock()
        self._frame = None
        self._frame_id = 0
        self._ok = False
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

    def latest(self):
        """คืนค่า (หมายเลขเฟรม, ภาพ, กล้องพร้อมไหม)"""
        with self._lock:
            return self._frame_id, self._frame, self._ok

    def _open(self):
        backend = cv2.CAP_DSHOW if isinstance(self.source, int) else cv2.CAP_ANY
        cap = cv2.VideoCapture(self.source, backend)
        if not cap.isOpened():
            cap.release()
            return None

        if isinstance(self.source, int):
            # MJPG ทำให้เว็บแคม USB ส่งภาพความละเอียดสูงได้โดยไม่กระตุก
            cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"MJPG"))
            cap.set(cv2.CAP_PROP_FRAME_WIDTH, config.FRAME_WIDTH)
            cap.set(cv2.CAP_PROP_FRAME_HEIGHT, config.FRAME_HEIGHT)

        w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        print(f"[camera {self.source}] ความละเอียดจริง {w}x{h}")
        return cap

    def _set_ok(self, ok):
        with self._lock:
            self._ok = ok
            if not ok:
                self._frame = None

    def _loop(self):
        cap = None
        fails = 0

        while self._running:
            if cap is None:
                cap = self._open()
                if cap is None:
                    self._set_ok(False)
                    print(f"[camera {self.source}] เปิดไม่ได้ จะลองใหม่ใน {RETRY_SECONDS} วินาที")
                    time.sleep(RETRY_SECONDS)
                    continue
                print(f"[camera {self.source}] เปิดสำเร็จ")
                self._set_ok(True)
                fails = 0

            ok, frame = cap.read()
            if not ok:
                fails += 1
                if fails >= MAX_READ_FAILS:
                    print(f"[camera {self.source}] หลุด จะเปิดใหม่")
                    cap.release()
                    cap = None
                    self._set_ok(False)
                else:
                    time.sleep(0.05)
                continue
            fails = 0

            with self._lock:
                self._frame = frame
                self._frame_id += 1

        if cap is not None:
            cap.release()