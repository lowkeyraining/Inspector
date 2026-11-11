# Milestones

สร้างบน GitHub ด้วย `powershell -ExecutionPolicy Bypass -File scripts\create-milestones.ps1`
(ต้องมี gh และ `gh auth login` แล้ว — รันซ้ำได้ ถ้ามี milestone ชื่อเดิมอยู่แล้วจะข้าม)

| # | Milestone | ขอบเขต |
|---|-----------|--------|
| M1 | ฐานข้อมูลและบันทึกผลตรวจจับ | PostgreSQL + migration, บันทึก NG + snapshot, นับชิ้นงาน/cycle time |
| M2 | หลายกล้อง + หน้า Device / Monitor | API กล้อง + RTSP, worker ต่อกล้อง, หน้า Device, Monitor แบบกริด |
| M3 | จัดการ Station | Station CRUD, หน้ารายการ/รายละเอียด/แก้ไข |
| M4 | เทรนและจัดการโมเดล | คลาส + รูป, Suggestion, เทรนเบื้องหลัง, ทดสอบ, เปลี่ยนเวอร์ชัน, wizard |
| M5 | Dashboard + Task ใช้ข้อมูลจริง | `/dashboard`, เชื่อม `useDashboard`, เป้าการผลิต + นำเข้า CSV/XLSX |
| M6 | Reports | ค้นหาตามฟิลเตอร์, ดู snapshot, ส่งออกไฟล์ |
| M7 | ผู้ใช้และสิทธิ์ | login, admin/พนักงาน, จำกัดหน้าและ API |
| M8 | ทดสอบจริงและส่งมอบ | เทรนกับชิ้นงานจริง, ทดสอบหน้างาน, README + เล่ม |

ลำดับ: M1 → M2 → M3 → M4 เป็นแกนหลัก, M5–M6 ต้องรอ M1, M7 ทำขนานได้, M8 ปิดท้าย
