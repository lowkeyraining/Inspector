# Prototype (ภาพออกแบบหน้าจอ)

ภาพ mockup ของแต่ละหน้า ตั้งชื่อตามหน้าที่ของภาพ เรียงตามลำดับเมนูใน nav bar

| ไฟล์ | หน้า | รายละเอียด |
|------|------|------------|
| `01-dashboard-overview-admin.png` | Dashboard | ภาพรวมทั้งไลน์ (ผู้ดูแลระบบ) — KPI 4 ใบ, กราฟเทียบอัตราผิดปกติราย Station, โดนัทประเภทปัญหา, เกจสัดส่วนของเสีย, แนวโน้มรายสัปดาห์, rail Station ด้านขวา |
| `02-dashboard-station-admin.png` | Dashboard | เลือก Station 03 (ผู้ดูแลระบบ) — KPI รายสถานี, กราฟ cycle time รายรอบ, เหตุการณ์แยกชิ้นงานวันนี้ |
| `03-dashboard-station-operator.png` | Dashboard | มุมมองพนักงาน — nav เหลือ Dashboard / Monitor, ไม่มี rail |
| `04-station-list.png` | Station | ตารางรายการ Station: ลำดับ, ขั้นตอน, โมเดลที่ใช้ + accuracy, เวลามาตรฐาน |
| `05-station-detail.png` | Station | หน้ารายละเอียด Station 03: ข้อมูล Station, โมเดลที่ใช้งาน, กิจกรรมล่าสุด |
| `06-station-edit-modal.png` | Station | โมดัลแก้ไขข้อมูล Station (ชื่อ, ขั้นตอน, cycle time, tolerance) |
| `07-station-change-model-modal.png` | Station | โมดัลเปลี่ยนโมเดล — เลือกจากเวอร์ชันที่มี หรือสร้างและเทรนใหม่ |
| `08-station-model-history.png` | Station | ประวัติโมเดล: ตารางทุกเวอร์ชัน + กราฟ accuracy ต่อ epoch + คำแนะนำเวอร์ชันที่ควรใช้ |
| `09-station-wizard-1-setup.png` | Station | Wizard เพิ่ม Station ใหม่ ขั้นที่ 1 — ตั้งค่า Station (ลำดับ, ขั้นตอน, กล้อง, cycle time) |
| `10-station-wizard-2-classes.png` | Station | Wizard ขั้นที่ 2 — กำหนดคลาสและอัปโหลดรูปตัวอย่างต่อคลาส |
| `11-station-wizard-2-training-config.png` | Station | Wizard ขั้นที่ 2 — Suggestion และค่าตั้งต้นการเทรน (algorithm, epochs, batch size, learning rate) |
| `12-station-wizard-2-test-result.png` | Station | Wizard ขั้นที่ 2 — ทดสอบโมเดลกับรูป แล้วกดใช้งานโมเดลนี้จริง |
| `13-task-list.png` | Task | ตารางเป้าจำนวนการผลิตรายวัน + ฟิลเตอร์ช่วงวันที่ |
| `14-task-import-modal.png` | Task | โมดัลเพิ่มข้อมูลจำนวนการผลิต — ลากไฟล์ CSV/XLSX หรือกรอกเอง |
| `15-device-list.png` | Device | ตารางกล้องต่อ Station: PC ที่เชื่อมต่อ, ซิงค์ล่าสุด, สถานะออนไลน์/ไม่เสถียร/ออฟไลน์ |
| `16-device-register-modal.png` | Device | โมดัลลงทะเบียนอุปกรณ์ใหม่ (IP, port, stream path, ความละเอียด, เฟรมเรต) |
| `17-monitor-grid.png` | Monitor | กริดภาพสดทุกกล้อง + ป้ายสถานะต่อกล้อง + เหตุการณ์ล่าสุด |
| `18-monitor-camera-admin.png` | Monitor | กล้องเดียวแบบขยาย (ผู้ดูแลระบบ) — ภาพสด, ผลตรวจจับล่าสุด, สถานะกล้องวันนี้, rail กล้องด้านขวา |
| `19-monitor-camera-operator.png` | Monitor | กล้องเดียวแบบขยาย (พนักงาน) — ไม่มี rail |
| `20-reports-list.png` | Reports | ค้นหาเหตุการณ์ตาม Station / ช่วงวันที่ / ประเภทปัญหา แล้วแสดงเป็นตาราง |
