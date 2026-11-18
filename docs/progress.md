# สถานะงาน

อัปเดต 18 พ.ย. 2569 — สาขา `Database`

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

### Frontend — มุมมองราย Station บนหน้า Dashboard

ทำตาม [prototype/02-dashboard-station-admin.png](prototype/02-dashboard-station-admin.png)

- กดสถานีใน `StationRail` หรือในกราฟเทียบรายสถานี แล้วหน้าสลับเป็นมุมมองสถานีนั้น
  (เดิมกดแล้วแค่ไฮไลต์ แผงซ้ายไม่เปลี่ยน) กด "ภาพรวมทั้งหมด" เพื่อกลับ
- ชนิดข้อมูลใหม่ใน `src/api/dashboard.ts`: `CyclePoint`, `DefectEvent`,
  `StationDetail` (ต่อยอดจาก `StationDefect`) และฟิลด์ `stationDetails` ใน `DashboardSummary`
- `StationKpiRow` — KPI 4 ใบคนละชุดกับภาพรวม (ตรวจพบวันนี้, อัตราผิดปกติ,
  cycle time เฉลี่ย, เวลามาตรฐาน ± ช่วงที่ยอมรับ)
- `CycleTimeChart` — แท่ง cycle time รายรอบ + เส้นประเวลามาตรฐาน
  ระบายแดงเฉพาะรอบที่หลุดช่วง และสรุปจำนวนรอบที่หลุดไว้ใต้กราฟ
- `DefectEventList` — เหตุการณ์แยกชิ้นงานวันนี้ (เวลา · หมายเลขชิ้น · ปัญหา · ความมั่นใจ)
- `isOutOfCycleTolerance` ใน `src/lib/threshold.ts` — เกณฑ์ cycle time อยู่ที่เดียวกับ
  เกณฑ์อัตราของเสีย ชนขอบพอดีนับว่าหลุด (ตาม mockup และกันปัญหาทศนิยม binary)
- `stationDetails` ใน `MOCK_DASHBOARD` ตั้งใจใส่แค่ st-03 กับ st-05 ไม่ครบทุกสถานี
  เพื่อให้เทสต์ครอบคลุมกรณีเลือกสถานีที่ยังไม่มีรายละเอียดด้วย

### Backend — ตารางฐานข้อมูลและข้อมูลจำลองของ Dashboard

- ตารางใน `backend/app/db/models/`
  - `stations` — รหัส (`st-01` ที่ frontend ใช้เป็น id), ลำดับในสาย (unique),
    ชื่อ, เวลามาตรฐานต่อชิ้น และช่วงที่ยอมรับได้ (Numeric ไม่ใช่ Float
    เพราะหน้าจอเทียบค่าแบบชนขอบนับว่าหลุด)
  - `defect_types` — ประเภทปัญหา ชื่อไม่ซ้ำ ใช้จับกลุ่มบนโดนัท
  - `inspections` — หนึ่งแถวต่อชิ้นงานต่อสถานี เก็บ `inspected_at` (UTC)
    และ `cycle_seconds` ทุกชิ้น ไม่ใช่แค่ชิ้นที่เสีย เพราะต้องใช้หารเป็นอัตราของเสีย
    มี index คู่ `(station_id, inspected_at)` ตามรูปคำถามของหน้า Dashboard
  - `defects` — ปัญหาที่เจอในชิ้นนั้น แยกตารางเพราะชิ้นเดียวอาจเจอหลายปัญหา
    เก็บ `confidence` และ `snapshot_path` (ไฟล์ภาพอยู่บนดิสก์ ดู `config.SNAPSHOT_DIR`)
  - `production_targets` — เป้าการผลิตรายวัน วันละแถว ใช้ทำ KPI "ผลิตวันนี้ / เป้า"
- migration `20261118_1159_c4e4966cd18b_dashboard_tables.py` (autogenerate)
  ทดสอบ `upgrade head` / `downgrade base` ทั้งสองทางแล้ว
- `backend/tools/seed_dashboard.py` สร้างข้อมูลจำลอง 5 วันล่าสุด
  `python backend/tools/seed_dashboard.py --reset`
  - กะ 08:00–17:00 เวลาไทย เว้นพักเที่ยง เก็บลง DB เป็น UTC (UTC+7 คงที่ ไม่ใช้ tzdata)
  - ชิ้นงานเดินตามสาย สถานีถัดไปเห็นชิ้นเดิมช้ากว่า 45 วินาทีต่อสถานี
  - อัตราของเสียฐานรายสถานีตาม mockup (`st-05 ประกอบ` แย่สุด) คูณตัวแปรรายวัน
    ให้กราฟแนวโน้มมีทิศทาง, เสาร์–อาทิตย์โหลดเบากว่าแต่ไม่ว่าง
    เพื่อให้ `DateStepper` กดย้อนหลังได้ทุกวันในช่วง
  - `random.Random` ล็อก seed ไว้ รันซ้ำได้ชุดเดิม เทียบเลขบนจอกับใน DB ได้
  - เขียนด้วย `COPY` ของ psycopg เพราะ 5 วันคูณ 8 สถานีเป็นสองแสนแถว
    (ORM ช้าเกินไป) จึงกำหนด id เองแล้วเลื่อน sequence ตามหลัง
  - ชุดปัจจุบัน: ชิ้นงาน 26,559 ชิ้น, ผลตรวจ 212,472 แถว, พบปัญหา 3,369 แถว (~68 MB)

### Backend — endpoint ของ Dashboard

- `GET /dashboard?date=YYYY-MM-DD` ใน `backend/app/dashboard.py`
  ไม่ใส่ `date` = วันนี้ตามเวลาไทย คืนก้อนเดียวครบทุกการ์ด
  (แยก endpoint ต่อการ์ดไม่ได้ เพราะทุกการ์ดต้องพูดถึงวันเดียวกัน
  ถ้าการ์ดใดช้ากว่า ตัวเลขบนจอจะมาจากคนละช่วงเวลาชั่วคราว)
- ฟิลด์ที่ส่งออกเป็น camelCase ผ่าน `alias_generator=to_camel` ของ pydantic
  ให้ตรงกับ `frontend/src/api/dashboard.ts` โดยฝั่ง Python ยังเขียน snake_case
- กรองด้วยช่วงเวลา (`inspected_at >= start AND < end`) ไม่ห่อคอลัมน์ด้วยฟังก์ชัน
  เพื่อให้ยังใช้ index `ix_inspections_station_inspected_at` ได้ — วันละ ~55,000 แถว
  ใช้เวลาราว 0.5 วินาที ก้อน JSON ~130 KB
- นับจำนวนชิ้นกับจำนวนปัญหาคนละ query ชิ้นเดียวมีได้หลายปัญหา
  ถ้า join รวมคราวเดียว `count()` ของชิ้นงานจะถูกคูณตามจำนวนปัญหา
- `producedToday` นับ `piece_no` ไม่ซ้ำ ไม่ใช่จำนวนแถว (ชิ้นเดียวผ่านทุกสถานี)
- `cycles` ส่ง 12 รอบล่าสุดเป็นค่าจริงรายชิ้น ไม่ใช่ค่าเฉลี่ยรายชั่วโมง —
  เฉลี่ยแล้วความแกว่งหายหมด กราฟจะเป็นเส้นแบนและไม่มีรอบไหนขึ้นสีแดงเลย
- `weekly` ส่งเฉพาะสัปดาห์ที่มีชิ้นงานจริง แท่ง 0% จะอ่านเป็น
  "สัปดาห์นั้นไม่มีของเสีย" ทั้งที่แปลว่าไม่มีข้อมูล
- วันที่ไม่มีข้อมูลไม่ใช่ error — คืนศูนย์/ลิสต์ว่าง และ `worstStationId` เป็น `""`
  ไม่งั้นการ์ด "จุดที่ต้องดูแลด่วน" จะสุ่มโชว์สถานีแรกพร้อมอัตรา 0%

### Frontend — เชื่อม Dashboard กับข้อมูลจริง

- `useDashboard(date)` ยิง `/dashboard?date=...` โพลซ้ำทุก 30 วิ
  และใช้ `keepPreviousData` ให้การ์ดไม่กระพริบเป็นโครงเปล่าตอนเปลี่ยนวัน
- `toApiDate` แปลง Date เป็น `YYYY-MM-DD` ตามเวลาเครื่อง ห้ามใช้ `toISOString()`
  เพราะแปลงเป็น UTC ก่อน ช่วง 00:00–06:59 เวลาไทยจะได้วันก่อนหน้า
- `Dashboard` ประกาศ state วันที่ก่อนแล้วส่งเข้า hook และเช็ก error ก่อน loading
  ไม่งั้น backend ล่มแล้ว `data` เป็น undefined จะค้างที่โครงการ์ดตลอด
- `defectEventList.list` ตรึง `max-h-80` + `overflow-y-auto` — วันจริงสถานีเดียว
  มี NG ได้หลายร้อยชิ้น ปล่อยไหลยาวแล้วหน้าสูงถึง 8,442px การ์ดข้าง ๆ ถูกดันจนหาไม่เจอ
  (ไม่ตัดข้อมูลฝั่ง backend เพราะหัวข้อการ์ดนับจากความยาวลิสต์ ตัดแล้วตัวเลขจะโกหก)
- `MOCK_DASHBOARD` กับ `EMPTY_DASHBOARD` เหลือไว้ให้เทสต์ใช้อย่างเดียว

### เทสต์

- frontend: `npx tsc -b`, `npm run lint`, `npm test` ผ่านทั้งหมด — 15 ไฟล์ 84 เทสต์
- backend: `python -m pytest` ผ่าน 19 เทสต์
  (`test_db_connection.py` ต่อ Postgres จริง, `test_seed_dashboard.py`
  เทสต์ตัวคิดเวลาในกะและ cycle time โดยไม่แตะ DB เพราะ seed จริงต้อง `--reset`,
  `test_dashboard.py` ยิง `build_summary` กับ Postgres จริงเพื่อจับ SQL ที่พัง
  และรูปร่าง JSON ที่ไม่ตรงกับฝั่ง frontend ซึ่ง mock จับให้ไม่ได้)

## รอทำต่อ

1. **แบ่งหน้าให้รายการเหตุการณ์** — ตอนนี้ `/dashboard` ส่งเหตุการณ์ NG ของวันนั้น
   มาครบทุกแถว (วันตัวอย่าง ~1,100 แถว ก้อน ~130 KB) ถ้าของจริง NG เยอะกว่านี้มาก
   ต้องทำแบ่งหน้าพร้อมกันทั้งสองฝั่ง เพราะหัวข้อการ์ดนับจากความยาวลิสต์
2. **รองรับหลายกล้อง** — ขั้นตอนเขียนไว้ใน `src/lib/cameras.ts`:
   เพิ่ม `GET /cameras`, เปลี่ยน `streamPath` เป็น `/cameras/{id}/stream`,
   ให้ `/health` แยกข้อมูลรายกล้อง แล้วส่ง id เข้า `useHealth()`
3. **4 หน้าที่ยังเป็น `PageShell` เปล่า** — Station, Task, Device, Report
4. **บันทึกผลตรวจจับจากกล้องจริง** — ตารางพร้อมแล้วแต่ `CameraWorker`
   ยังไม่เขียนลง DB ตัวเลขที่มีอยู่ตอนนี้มาจาก `seed_dashboard.py` ทั้งหมด
   และยังไม่มีไฟล์ภาพจริงตาม `snapshot_path`
5. **โมเดลของงานจริง** — `yolo26n.pt` เป็นน้ำหนักทั่วไป ยังไม่ได้เทรนกับชิ้นงาน
