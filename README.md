# Inspector

ระบบติดตามกระบวนการผลิตแบบเรียลไทม์ด้วยหลักการคอมพิวเตอร์วิทัศน์
A Real-Time Production Process Monitoring System Using Computer Vision

กล้องจับภาพสายการผลิต → YOLO ตรวจจับชิ้นงาน → backend ส่งภาพและผลตรวจออกเป็น API
→ frontend แสดงภาพสด สถิติ และภาพรวมอัตราของเสียของแต่ละสถานี

## โครงสร้างโปรเจกต์

```
backend/            FastAPI + OpenCV + ultralytics (YOLO)
  app/camera.py     เธรดอ่านกล้อง ตรวจจับ และเก็บเฟรม/ผลล่าสุดไว้ให้ API หยิบ
  app/main.py       endpoint: GET /health, GET /stream (MJPEG)
  app/config.py     ค่าตั้งทั้งหมดอ่านจาก environment variable
  tools/            สคริปต์รันมือ แยกจากแอป ไม่ใช่ unit test (ดูหัวไฟล์แต่ละตัว)

frontend/           React 19 + TypeScript + Vite + Tailwind 4 + TanStack Query + Recharts
  src/api/          ตัวกลางเรียก backend และชนิดข้อมูล
  src/hooks/        useHealth, useFpsHistory, useDashboard
  src/components/   คอมโพเนนต์ UI ทั้งหมด
  src/pages/        6 หน้าตาม nav bar + หน้า Camera แบบขยาย
  src/lib/          styles.ts (className ทุกตัว), theme.ts (สีให้กราฟ), ค่าตั้งอื่น ๆ
  src/__tests__/    vitest + @testing-library/react

docs/               เอกสาร
  progress.md       สถานะงาน ทำแล้ว/รอทำต่อ
  milestones.md     M1–M8 และลำดับการทำ
  prototype/        ภาพออกแบบหน้าจอ 20 หน้า (ดู prototype/README.md เป็นสารบัญ)
  prompts/          พรอมต์ที่ใช้สั่งงานแต่ละรอบ

scripts/            สคริปต์ระดับโปรเจกต์ (สร้าง Milestones บน GitHub)
```

## วิธีรัน

### Backend

```powershell
.venv\Scripts\activate
pip install -r backend\requirements.txt
uvicorn backend.app.main:app --reload
```

ขึ้นที่ `http://127.0.0.1:8000` — ตรวจว่าทำงานด้วย `/health` และดูภาพสดที่ `/stream`

ค่าตั้งผ่าน environment variable (ดูค่าเริ่มต้นใน `backend/app/config.py`):

| ตัวแปร | ค่าเริ่มต้น | ความหมาย |
| --- | --- | --- |
| `CAMERA_SOURCE` | `1` | เลขกล้อง USB หรือ URL `rtsp://...` |
| `MODEL_PATH` | `yolo26n.pt` | ไฟล์น้ำหนักโมเดล YOLO |
| `CONF_THRESHOLD` | `0.5` | ความมั่นใจต่ำสุดที่ยอมรับ |
| `IMGSZ` | `640` | ขนาดภาพเข้าโมเดล ลดเป็น `320` ถ้าช้า |
| `JPEG_QUALITY` | `80` | คุณภาพ JPEG ของ stream |

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

ค่าเริ่มต้นยิง API ผ่าน proxy ของ vite ที่ `/api` → `http://127.0.0.1:8000`
(ดู `vite.config.ts`) ถ้าจะชี้ไป backend ตรง ๆ ให้ตั้ง `VITE_API_URL` ใน `frontend/.env`
ตามตัวอย่างใน `.env.example`

## คำสั่งตรวจก่อนส่งงาน (frontend)

```powershell
npx tsc -b      # ชนิดข้อมูล
npm run lint    # oxlint
npm test        # vitest
```

## กฎการเขียนโค้ดในโปรเจกต์นี้

1. `className` ทุกตัวอยู่ใน `src/lib/styles.ts` ไฟล์ `.tsx` เหลือแต่ logic กับโครง JSX
2. ห้ามเขียน hex สีนอก `src/index.css` — ใช้ token ใน `@theme` เท่านั้น
3. สีที่ส่งให้ Recharts เรียกผ่าน `chartColors` ใน `src/lib/theme.ts`
   (SVG รับ `var()` ไม่ได้ ไฟล์นี้จึงอ่านค่าจริงจาก CSS variable มาให้ ไม่เก็บ hex ซ้ำ)
4. เกณฑ์เตือนอัตราของเสียอยู่ที่ `src/lib/threshold.ts` ที่เดียว
5. คอมเมนต์เป็นภาษาไทย อธิบาย "ทำไม" ไม่ใช่ "ทำอะไร"
6. ทุกคอมโพเนนต์ต้องรับมือกรณีไม่มีข้อมูล (array ว่าง / undefined) โดยไม่พัง
