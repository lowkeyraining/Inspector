# สถานะงาน

อัปเดต 9 พ.ย. 2569 — สาขา `feature/dashboard-cards`

## ทำแล้ว

### Backend (FastAPI + YOLO)

- `CameraWorker` เป็นเธรดเดี่ยวอ่านกล้องด้วย OpenCV ส่งเข้า YOLO แล้วเก็บ
  เฟรม JPEG, รายการวัตถุที่เจอ และ FPS ล่าสุดไว้ใต้ lock ให้ API มาหยิบ
  (API ไม่ต้องรอโมเดล จึงไม่ค้างเวลาหลายคนเปิดพร้อมกัน)
- วาดกรอบและชื่อคลาสลงบนเฟรมก่อนเข้ารหัส JPEG
- `GET /health` คืน `{ source, fps, detections[] }`
- `GET /stream` เป็น MJPEG (`multipart/x-mixed-replace`) ใช้เป็น `src` ของ `<img>` ได้ตรง ๆ
- เปิด/ปิดเธรดผ่าน lifespan ของ FastAPI
- ค่าตั้งทั้งหมดย้ายออกจากโค้ดไปอยู่ใน environment variable (`app/config.py`)

### Frontend — โครงสร้าง

- React 19 + TypeScript + Vite + Tailwind 4 + TanStack Query + Recharts
- `src/api/client.ts` ประกอบ base URL จาก `VITE_API_URL` ไม่งั้นใช้ proxy `/api` ของ vite
- ธีมสว่างเป็น token ใน `@theme` ของ `src/index.css`
  (brand, page, surface, subtle, line, ink, alert, cat-1…4)
- `src/lib/styles.ts` เก็บ `className` ทั้งหมด, `src/lib/theme.ts` ส่งสีจริงให้ Recharts
- nav bar 6 หน้า (Dashboard, Station, Task, Device, Monitor, Report)
  โดย `navItems.ts` เป็นแหล่งเดียวที่กำหนดว่ามีหน้าอะไร
- `button { user-select: none }` ชั้น base — กดปุ่มแล้วข้อความไม่ถูกลากคลุม

### Frontend — หน้ากล้อง

- `Monitor` เป็นกริดภาพสดของกล้องทุกตัวจากทะเบียน `src/lib/cameras.ts`
  ตอนนี้ทะเบียนว่างอยู่ จึงขึ้น empty state
- `Camera` เป็นหน้าขยายของกล้องตัวเดียว: ภาพสด, การ์ดสถิติ, กราฟ FPS,
  กราฟจำนวนตามคลาส และตารางผลตรวจจับ
- `useHealth` poll `/health`, `useFpsHistory` เก็บประวัติ FPS ไว้วาดกราฟ

### Frontend — การ์ดหน้า Dashboard

ทำครบตามพรอมต์ใน [prompts/dashboard-cards.md](prompts/dashboard-cards.md) ทั้ง 9 ข้อ

- ชนิดข้อมูล `DashboardSummary` และลูก ๆ ใน `src/api/dashboard.ts`
- เกณฑ์เตือนที่เดียวใน `src/lib/threshold.ts` (`DEFECT_THRESHOLD = 0.05`)
- `KpiRow` + `StatCard` (เพิ่ม `caption`, `tone`) — KPI 4 ใบแถวบน
- `DateStepper` — เลือกวันที่ ฟอร์แมต พ.ศ. ด้วย `Intl.DateTimeFormat("th-TH")`
  ปุ่มถัดไป disabled เมื่อถึงวันนี้
- `StationDefectChart` — แถบแนวนอนทำด้วย div (normalize ตามค่าสูงสุด ไม่เทียบ 100%)
- `DefectTypeDonut` — โดนัท Recharts เรียงมากไปน้อย ยุบส่วนเกิน 4 ประเภทเป็น "อื่น ๆ"
- `DefectRatioGauge` — เกจสัดส่วนของเสีย ตัวเลขกลางวงเป็น HTML ทับ SVG, clamp 0–1 กัน NaN
- `WeeklyTrendChart` — แท่งรายสัปดาห์ ระบายทีละแท่งด้วย `Cell` เมื่อเกินเกณฑ์
- `StationRail` — คอลัมน์ขวา มีแถว "ภาพรวมทั้งหมด" เสมอ, เกินเกณฑ์ชนะการเลือก
- `Dashboard` ประกอบทั้งหมด แชร์ `selectedStationId` ระหว่างกราฟซ้ายกับ rail
  และขึ้นโครงการ์ดเปล่าระหว่างโหลดเพื่อไม่ให้ layout กระโดด

### เทสต์

`npx tsc -b`, `npm run lint`, `npm test` ผ่านทั้งหมด — 12 ไฟล์ 63 เทสต์

## รอทำต่อ

1. **endpoint ของ Dashboard บน backend** — ตอนนี้ `useDashboard` คืน `EMPTY_DASHBOARD`
   การ์ดทุกใบจึงขึ้นสถานะ "รอเชื่อมข้อมูล"
   เมื่อ backend พร้อม แก้แค่ `queryFn` ใน `src/hooks/useDashboard.ts` ที่เดียว
   เป็น `apiFetch<DashboardSummary>('/dashboard')` หน้าและการ์ดไม่ต้องแก้
   (`MOCK_DASHBOARD` เหลือไว้ให้เทสต์ใช้เป็นข้อมูลตัวอย่างเท่านั้น)
2. **รองรับหลายกล้อง** — ขั้นตอนเขียนไว้ใน `src/lib/cameras.ts`:
   เพิ่ม `GET /cameras`, เปลี่ยน `streamPath` เป็น `/cameras/{id}/stream`,
   ให้ `/health` แยกข้อมูลรายกล้อง แล้วส่ง id เข้า `useHealth()`
3. **4 หน้าที่ยังเป็น `PageShell` เปล่า** — Station, Task, Device, Report
4. **เก็บข้อมูลลงฐานข้อมูล** — ยังไม่มีการบันทึกผลตรวจจับ ตัวเลขย้อนหลัง
   (รายสัปดาห์ / ตามวันที่ที่ `DateStepper` เลือก) จึงยังไม่มีแหล่งข้อมูลจริง
5. **โมเดลของงานจริง** — `yolo26n.pt` เป็นน้ำหนักทั่วไป ยังไม่ได้เทรนกับชิ้นงาน
