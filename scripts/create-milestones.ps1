# สร้าง Milestones ของ Inspector บน GitHub
# ต้องมี GitHub CLI (gh) และ login แล้ว: gh auth login
# รันจากโฟลเดอร์โปรเจกต์: powershell -ExecutionPolicy Bypass -File scripts\create-milestones.ps1
# รันซ้ำได้ ถ้ามี milestone ชื่อเดิมอยู่แล้วจะข้าม ไม่สร้างซ้อน

$ErrorActionPreference = "Stop"
$Repo = "lowkeyraining/Inspector"

# หา gh: บน PATH ก่อน ไม่งั้นใช้ path ปริยายของ winget
$Gh = (Get-Command gh -ErrorAction SilentlyContinue).Source
if (-not $Gh) { $Gh = "C:\Program Files\GitHub CLI\gh.exe" }
if (-not (Test-Path $Gh)) {
    throw "ไม่พบ gh — ติดตั้งด้วย: winget install --id GitHub.cli -e"
}

& $Gh auth status | Out-Null
if (-not $?) { throw "ยังไม่ได้ login — รัน: gh auth login" }

$existing = & $Gh api "repos/$Repo/milestones?state=all&per_page=100" --jq '.[].title'
if (-not $existing) { $existing = @() }

function New-Milestone {
    param([string]$Title, [string]$Description)

    if ($existing -contains $Title) {
        Write-Host "มีอยู่แล้ว ข้าม: $Title"
        return
    }
    & $Gh api -X POST "repos/$Repo/milestones" -f "title=$Title" -f "description=$Description" --silent
    if ($?) { Write-Host "สร้างแล้ว: $Title" }
}

New-Milestone "M1 · ฐานข้อมูลและบันทึกผลตรวจจับ" @'
ตั้ง PostgreSQL + migration (stations, cameras, models, detections, production_targets)
บันทึกเหตุการณ์ NG ทุกครั้งที่ตรวจเจอ พร้อม snapshot ลง Supabase Storage
นับชิ้นงานและ cycle time ต่อรอบ เก็บลงฐานข้อมูล
'@

New-Milestone "M2 · หลายกล้อง + หน้า Device / Monitor" @'
API กล้อง: GET/POST/PATCH/DELETE /cameras, เชื่อม RTSP จาก IP/port/stream path
CameraWorker หนึ่งตัวต่อกล้อง, /cameras/{id}/stream และ /health แยกรายกล้อง
หน้า Device: ตาราง, โมดัลลงทะเบียน, สถานะออนไลน์/ไม่เสถียร/ออฟไลน์, ปุ่มทดสอบ
หน้า Monitor: กริดทุกกล้อง + มุมมองกล้องเดียว + เหตุการณ์ล่าสุด
'@

New-Milestone "M3 · จัดการ Station" @'
API Station CRUD (ลำดับ, ขั้นตอน, กล้อง, cycle time ± tolerance)
หน้า Station: ตารางรายการ, หน้ารายละเอียด, โมดัลแก้ไข, กิจกรรมล่าสุด
'@

New-Milestone "M4 · เทรนและจัดการโมเดล" @'
กำหนดคลาส + อัปโหลดรูปต่อคลาส, สร้าง dataset อัตโนมัติ
Suggestion (จำนวนรูปต่อคลาส, class imbalance) และค่าตั้งต้นที่แนะนำ
เทรน YOLO เป็นงานเบื้องหลัง พร้อมแสดงความคืบหน้า
ทดสอบโมเดลกับรูป, เลือกใช้งาน/เปลี่ยนเวอร์ชัน, ประวัติโมเดล + กราฟ accuracy
wizard เพิ่ม Station ใหม่ 3 ขั้นตอน
'@

New-Milestone "M5 · Dashboard + Task ใช้ข้อมูลจริง" @'
endpoint /dashboard (ภาพรวมทั้งไลน์ และราย Station ตามวันที่)
เชื่อม useDashboard กับ backend แทน EMPTY_DASHBOARD
Task: CRUD เป้าการผลิตรายวัน + นำเข้า CSV/XLSX
'@

New-Milestone "M6 · Reports" @'
API ค้นหาเหตุการณ์ตาม Station, ช่วงวันที่, ประเภทปัญหา
หน้า Reports: ฟิลเตอร์, ตารางผลลัพธ์, ดูรูป snapshot, ส่งออกไฟล์
'@

New-Milestone "M7 · ผู้ใช้และสิทธิ์" @'
login, บทบาทผู้ดูแลระบบ / พนักงาน
พนักงานเห็นเฉพาะ Dashboard + Monitor ของ Station ตัวเอง
ป้องกัน API ตามบทบาท
'@

New-Milestone "M8 · ทดสอบจริงและส่งมอบ" @'
เทรนโมเดลกับชิ้นงานจริง แทน yolo26n.pt
ทดสอบหน้างาน วัด accuracy/FPS เทียบเกณฑ์
README วิธีติดตั้ง, เก็บผลลงบทที่ 4–5 ของเล่ม
'@
