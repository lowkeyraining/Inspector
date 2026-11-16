# พรอมต์ร่วมฝั่ง backend (แปะหัวทุกครั้ง)

ใช้คู่กับพรอมต์งานย่อยฝั่ง backend เหมือนที่ `dashboard-cards.md` ใช้ "พรอมต์ร่วม" ของ frontend

```text
บริบทโปรเจกต์ Inspector (backend)
- Python + FastAPI + OpenCV + ultralytics (YOLO)
- ฐานข้อมูล: PostgreSQL รันด้วย Docker (docker compose) — ไม่ใช้ SQLite แม้ตอน dev
  เพราะต้องใช้ชนิดข้อมูลและพฤติกรรมเดียวกับของจริง (timestamptz, JSONB, window function)
- ORM: SQLAlchemy 2.x แบบ declarative + typed mapped_column
- Migration: Alembic — สคีมาเปลี่ยนได้เฉพาะผ่าน migration ห้าม create_all() ในแอป
- ไฟล์โปรเจกต์ โค้ด .venv และข้อมูลภาพ อยู่บนไดรฟ์ D: ทั้งหมด
- โครงไฟล์: backend/app/{main,config,camera}.py,
  backend/app/db/ (session.py, base.py, models/), backend/alembic/ (versions/)

กฎที่ห้ามละเมิด
1. ค่าตั้งทุกตัวอ่านจาก environment variable ใน backend/app/config.py ที่เดียว
   DSN ของฐานข้อมูลคือ DATABASE_URL ห้าม hardcode host/user/password ในโค้ด
2. ทุกการเปลี่ยนสคีมาต้องมีไฟล์ Alembic migration คู่มาด้วย (upgrade + downgrade ที่ใช้ได้จริง)
   ห้ามแก้ไฟล์ migration ที่ merge เข้า main แล้ว ให้ออก revision ใหม่
3. session ต่อ request ผ่าน dependency เดียว (get_db) ห้ามสร้าง engine/session ใหม่ในแต่ละ module
4. query ที่ส่งให้ API ต้องกำหนด limit/order ชัดเจน ห้ามคืนทั้งตาราง
5. คอมเมนต์เป็นภาษาไทย อธิบาย "ทำไม" ไม่ใช่ "ทำอะไร" และใส่เฉพาะจุดที่ไม่ชัดในตัวโค้ด
6. ภาพ snapshot เก็บเป็นไฟล์ใต้ SNAPSHOT_DIR บนไดรฟ์ D: ในตารางเก็บแค่ path
   ห้ามเก็บ bytes ลงคอลัมน์ เพราะไฟล์ภาพโตเร็วกว่าตัวข้อมูลหลายสิบเท่า
   (ภาพ 150 KB วันละ 2,000 ชิ้น = ~9 GB/เดือน) ถ้าอยู่ใน DB จะ dump/restore ไม่ไหว
7. endpoint ต้องรับมือกรณีไม่มีข้อมูลโดยไม่ 500 — คืน list ว่างหรือค่าศูนย์ตามชนิดข้อมูลที่ frontend รออยู่

เมื่อทำเสร็จต้องรันให้ผ่าน: docker compose up -d db, alembic upgrade head, pytest
```
