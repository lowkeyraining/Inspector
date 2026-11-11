# ชุดพรอมต์สำหรับการ์ดในหน้า Dashboard

แกะจาก mockup หน้า Dashboard แตกเป็นพรอมต์ย่อยทีละการ์ด ใช้เรียงตามลำดับ 0 → 9
แต่ละพรอมต์จบในตัวเอง (ทำแล้ว build ผ่าน test ผ่าน) เพื่อให้รีวิวทีละชิ้นได้

> **วิธีใช้:** แปะ "พรอมต์ร่วม" ก่อนเสมอ แล้วตามด้วยพรอมต์ของการ์ดที่ต้องการ

---

## 0. พรอมต์ร่วม (แปะหัวทุกครั้ง)

```text
บริบทโปรเจกต์ Inspector (frontend)
- React 19 + TypeScript + Vite + Tailwind 4 + TanStack Query + Recharts
- โครงไฟล์: src/api (fetch + type), src/hooks, src/components, src/pages, src/lib
- เทสต์: vitest + @testing-library/react ไฟล์อยู่ใน src/__tests__

กฎที่ห้ามละเมิด
1. className ทุกตัวต้องไปอยู่ใน src/lib/styles.ts เป็น object export ชื่อตามคอมโพเนนต์
   ไฟล์ .tsx เหลือแต่ logic กับโครง JSX ห้ามมี className เป็น string ยาวใน .tsx
2. ห้ามเขียน hex สีที่ไหนทั้งสิ้น ใช้ token จาก @theme ใน src/index.css เท่านั้น
   (brand, brand-soft, brand-border, page, surface, subtle, line, ink, ink-body, ink-muted)
3. สีที่ส่งให้ Recharts ต้องเรียกผ่าน chartColors ใน src/lib/theme.ts
   ถ้าต้องใช้สีใหม่ ให้เพิ่ม token ใน index.css + เพิ่ม getter ใน theme.ts ห้าม hardcode
4. คอมเมนต์เป็นภาษาไทย อธิบาย "ทำไม" ไม่ใช่ "ทำอะไร" และใส่เฉพาะจุดที่ไม่ชัดในตัวโค้ด
5. ทุกคอมโพเนนต์ต้องรับมือกรณีไม่มีข้อมูล (array ว่าง / undefined) โดยไม่พัง

เมื่อทำเสร็จต้องรันให้ผ่านทั้งหมด: npx tsc -b, npm run lint, npm test
```

---

## 1. ชนิดข้อมูลและ mock ของหน้า Dashboard

```text
สร้างชนิดข้อมูลและ mock สำหรับหน้า Dashboard ก่อนลงมือทำ UI

สร้าง src/api/dashboard.ts เก็บ type:
- StationDefect  { id: string; order: number; name: string; defectRate: number }
- DefectType     { name: string; share: number }      // share เป็นสัดส่วน 0–1
- WeeklyPoint    { label: string; defectRate: number }
- DashboardSummary {
    stationCount: number
    avgDefectRate: number          // 0–1
    worstStationId: string
    producedToday: number
    productionTarget: number
    stations: StationDefect[]
    defectTypes: DefectType[]
    weekly: WeeklyPoint[]
  }

สร้าง src/lib/mockDashboard.ts ส่งออก MOCK_DASHBOARD: DashboardSummary
ใส่ข้อมูล 8 สถานีตาม mockup: 01 ขึ้นรูป 0.8%, 02 เจาะรู 0.5%, 03 เชื่อม 2.1%,
04 พ่นสี 0.9%, 05 ประกอบ 6.4%, 06 บรรจุ 1.1%, 07 ติดฉลาก 0.3%, 08 ตรวจสอบ 0.4%
avgDefectRate 0.068, producedToday 6940, productionTarget 7000

สร้าง src/lib/threshold.ts เก็บเกณฑ์เตือนที่เดียว:
- export const DEFECT_THRESHOLD = 0.05
- export function isOverThreshold(rate: number): boolean
เหตุผล: ใน mockup สีแดงปรากฏพร้อมกันทุกจุดที่พูดถึงสถานีที่เกินเกณฑ์
ทุกการ์ดต้องอ่านเกณฑ์จากไฟล์นี้ ห้ามเขียนตัวเลขเกณฑ์ซ้ำในคอมโพเนนต์

ยังไม่ต้องแตะ UI ในขั้นนี้
```

---

## 2. การ์ด KPI (แถวบน 4 ใบ)

```text
ต่อยอด src/components/StatCard.tsx ให้รองรับการ์ด KPI ในหน้า Dashboard

เพิ่ม props (ของเดิมต้องใช้ได้เหมือนเดิม ไม่ breaking):
- caption?: string              // บรรทัดเล็กใต้ตัวเลข เช่น "เกินค่า KPI ที่ตั้งไว้"
- tone?: 'normal' | 'alert'     // ค่าเริ่มต้น 'normal'

tone 'alert' ทำให้ตัวเลขใหญ่และ caption เป็นสีเตือน ส่วน label ยังเป็น ink-muted เหมือนเดิม
เพิ่ม token สีเตือนใน src/index.css (--color-alert, --color-alert-soft) แล้วอ้างผ่าน token
โครงการ์ด: label เล็ก → ค่าใหญ่ (tabular-nums) → caption เล็ก

สร้าง src/components/KpiRow.tsx รับ summary: DashboardSummary แล้ว render StatCard 4 ใบ
ในกริด grid-cols-1 sm:grid-cols-2 xl:grid-cols-4
1. "สถานีทั้งหมด"       ค่า stationCount   caption "กำลังเฝ้าระวังอยู่ทั้งหมด"
2. "อัตราของเสียเฉลี่ย"  ค่า avgDefectRate เป็น % ทศนิยม 1 ตำแหน่ง tone alert ถ้าเกินเกณฑ์
3. "จุดที่ต้องดูแลด่วน"  ค่าเป็นชื่อสถานีที่แย่ที่สุด tone alert caption บอก % ของสถานีนั้น
4. "ยอดผลิตวันนี้"      ค่า "6,940/7,000" ฟอร์แมตด้วย toLocaleString()

การ์ดใบที่ 3 ต้องหาสถานีจาก worstStationId ไม่ใช่เขียน "Station 05" ตายตัว

เทสต์ใน src/__tests__/KpiRow.test.tsx: การ์ดครบ 4 ใบ, ค่าที่แสดงถูกต้อง,
การ์ดที่เกินเกณฑ์ได้ tone alert ส่วนที่ไม่เกินไม่ได้
```

---

## 3. ตัวเลือกวันที่ (DateStepper)

```text
สร้าง src/components/DateStepper.tsx — แถบเลือกวันที่มุมขวาบนของหน้า Dashboard

หน้าตา: ปุ่มย้อนกลับ | ชิปที่มีไอคอนปฏิทิน + วันที่ภาษาไทย | ปุ่มถัดไป
ชิปใช้พื้น surface ขอบ line มุมมน ปุ่มลูกศรเป็นปุ่มสี่เหลี่ยมมนแยกกันคนละกล่อง

Props: { value: Date; onChange: (next: Date) => void; maxDate?: Date }
- ปุ่มถัดไปต้อง disabled เมื่อ value อยู่ที่ maxDate แล้ว (ค่าเริ่มต้น maxDate = วันนี้)
  เพราะยังไม่มีข้อมูลของอนาคต
- ฟอร์แมตวันที่ด้วย Intl.DateTimeFormat("th-TH", { dateStyle: "long" })
  ซึ่งให้ พ.ศ. อัตโนมัติ ห้ามบวก 543 เอง
- ไอคอนปฏิทินใช้ของที่มีอยู่แล้วใน src/components/icons.tsx ถ้าไม่มีให้เพิ่มเป็น inline svg
  ที่รับสีจาก currentColor และใส่ aria-hidden
- ปุ่มลูกศรต้องมี aria-label ("วันก่อนหน้า" / "วันถัดไป")

เทสต์ src/__tests__/DateStepper.test.tsx: กดย้อนกลับแล้ว onChange ได้วันก่อนหน้า 1 วัน,
ปุ่มถัดไป disabled เมื่ออยู่ที่ maxDate
```

---

## 4. การ์ดเปรียบเทียบอัตราของเสียรายสถานี (การ์ดใหญ่ฝั่งซ้าย)

```text
สร้าง src/components/StationDefectChart.tsx
หัวข้อการ์ด "เปรียบเทียบอัตราการตรวจพบชิ้นบกพร่องตาม Station"

ไม่ใช้ Recharts กับตัวนี้ — ทำเป็นลิสต์แถบแนวนอนด้วย div จะคุม layout และ a11y ได้ดีกว่า
แต่ละแถวเป็นกริด 3 คอลัมน์: [ลำดับ + ชื่อสถานี] [รางแถบ] [% ชิดขวา]
- ความยาวแถบ = defectRate หารด้วยค่าสูงสุดในชุดข้อมูล (normalize) ไม่ใช่เทียบกับ 100%
  เพราะค่าจริงอยู่แถว 0–7% ถ้าเทียบกับ 100% จะมองไม่เห็นความต่าง
- แถบปกติสี brand แถบที่ isOverThreshold() เป็นสีเตือน พร้อมกับ % ตัวนั้นด้วย
- แถวที่ถูกเลือกมีพื้น brand-soft เต็มแถว

Props: { stations: StationDefect[]; selectedId?: string; onSelect?: (id: string) => void }
- ถ้ามี onSelect ให้แต่ละแถวเป็น button ทั้งแถว (กดด้วยคีย์บอร์ดได้) ถ้าไม่มีให้เป็น div
- stations ว่าง → ใช้ EmptyState ที่มีอยู่แล้ว
- ใต้ลิสต์มี legend บรรทัดเดียว: จุดสีเตือน + "อัตราการตรวจพบที่เกินเกณฑ์"
- ทุกแถบใส่ role="img" + aria-label ที่อ่านแล้วรู้ค่า เช่น "03 เชื่อม 2.1 เปอร์เซ็นต์"

เทสต์ src/__tests__/StationDefectChart.test.tsx: แสดงครบ 8 แถว,
แถวที่เกินเกณฑ์ถูกทำเครื่องหมาย, กดแถวแล้ว onSelect ได้ id ที่ถูกต้อง, ชุดว่างแสดง EmptyState
```

---

## 5. การ์ดประเภทปัญหาที่พบบ่อย (โดนัท + legend)

```text
สร้าง src/components/DefectTypeDonut.tsx
หัวข้อการ์ด "ประเภทปัญหาที่พบบ่อย"

Recharts PieChart + Pie innerRadius ประมาณ 55% outerRadius ประมาณ 80% ไม่มีเส้นคั่น
วางโดนัทซ้าย legend ขวาเป็นรายการแนวตั้ง แต่ละบรรทัด: % ตัวหนา + ชื่อประเภท

Props: { types: DefectType[] }
- สีชุดนี้เป็น categorical ต้องเพิ่ม token ชุดใหม่ (เช่น --color-cat-1 ถึง --color-cat-4)
  ใน index.css แล้วเพิ่ม chartColors.categories: string[] ใน theme.ts
  ห้าม hardcode สีใน component
- เรียงจากมากไปน้อยเสมอ ไม่ว่า input จะเรียงมายังไง
- ถ้าเกิน 4 ประเภท ให้ยุบส่วนที่เหลือเป็น "อื่น ๆ" รายการเดียว ไม่เพิ่มสีใหม่
- types ว่าง → ข้อความ "ยังไม่มีข้อมูล" ด้วย emptyHint ที่มีอยู่แล้ว
- isAnimationActive={false} เหมือนกราฟตัวอื่นในโปรเจกต์
- ใส่ aria-label สรุปทั้งกราฟบนกล่องครอบ

เทสต์ src/__tests__/DefectTypeDonut.test.tsx: legend แสดงครบตามจำนวนประเภท,
% รวมได้ 100, กรณีเกิน 4 ประเภทมีรายการ "อื่น ๆ"
```

---

## 6. การ์ดสัดส่วนของเสียรวม (เกจ)

```text
สร้าง src/components/DefectRatioGauge.tsx
หัวข้อการ์ด "สัดส่วนของเสียรวม"

โดนัท 2 ส่วน (ของเสีย / ปกติ) มีตัวเลขใหญ่อยู่กลางวง + ฐานตัวเล็กใต้ลงไป
ขวาวงเป็น legend 2 บรรทัด: จุดสี + "x.x% ของเสีย" และ "ปกติ"

Props: { defectRate: number; total: number }
- ตัวเลขกลางวงคือ defectRate เป็น % ทศนิยม 1 ตำแหน่ง ใต้ลงไปเป็น total แบบ toLocaleString()
- ข้อความกลางวงต้องเป็น HTML วางทับด้วย absolute ไม่ใช่ text element ใน SVG
  เพื่อให้ใช้ token สีและฟอนต์เดียวกับส่วนอื่นของ UI
- สีส่วน "ของเสีย" ใช้สีเตือนเมื่อ isOverThreshold() ไม่งั้นใช้ brand ส่วน "ปกติ" ใช้สี line
- defectRate ต้อง clamp ไว้ใน 0–1 กัน NaN และค่าเพี้ยนจาก backend

เทสต์ src/__tests__/DefectRatioGauge.test.tsx: แสดง % และ total ถูกต้อง,
ค่าเกินเกณฑ์ใช้สีเตือน, ส่ง defectRate เป็น NaN แล้วไม่พัง
```

---

## 7. การ์ดแนวโน้มรายสัปดาห์

```text
สร้าง src/components/WeeklyTrendChart.tsx
หัวข้อการ์ด "แนวโน้มรายสัปดาห์"

Recharts BarChart แท่งแนวตั้ง 4 แท่ง (W1–W4) แกน X เป็น label สัปดาห์
Props: { points: WeeklyPoint[] }
- ใช้ Cell ระบายทีละแท่ง: แท่งที่ isOverThreshold() เป็นสีเตือน ที่เหลือสี brand
  (นี่คือเหตุผลที่ต้องใช้ Cell ไม่ใช่ fill เดียวทั้งชุด)
- radius={[4, 4, 0, 0]} และ isAnimationActive={false} ให้ตรงกับ ClassCountChart ที่มีอยู่
- ซ่อนแกน Y แต่ให้ tooltip บอกค่าเป็น % ทศนิยม 1 ตำแหน่ง
- points ว่าง → emptyHint
- ความสูงใช้ chartBox จาก styles.ts

เทสต์ src/__tests__/WeeklyTrendChart.test.tsx: จำนวนแท่งตรงกับ points,
แท่งที่เกินเกณฑ์ใช้สีเตือน
```

---

## 8. แถบรายการสถานีด้านขวา (side rail)

```text
สร้าง src/components/StationRail.tsx — คอลัมน์ขวาสุดของหน้า Dashboard

โครง: หัวแถบ "STATION ทั้งหมด" พื้น subtle ตามด้วยลิสต์แถว
แถวแรกคงที่คือ "ภาพรวมทั้งหมด" (id = null) แสดงอัตราเฉลี่ยรวม
ตามด้วยสถานี 01–08 แต่ละแถว: จุดสถานะ + ลำดับ + ชื่อ + % ชิดขวา

Props: { stations: StationDefect[]; avgDefectRate: number;
         selectedId: string | null; onSelect: (id: string | null) => void }
- แถวที่เลือกอยู่: พื้น brand-soft ตัวอักษรสี brand
- แถวที่เกินเกณฑ์: จุด ชื่อ และ % เป็นสีเตือนทั้งแถว และต้องเกินเกณฑ์ชนะการเลือก
  (ถ้าแถวนั้นทั้งถูกเลือกและเกินเกณฑ์ ให้พื้นเป็น alert-soft ไม่ใช่ brand-soft)
- ทุกแถวเป็น button ความกว้างเต็ม มี aria-current เมื่อถูกเลือก
- รายการยาวเกินให้เลื่อนในตัวเอง ไม่ดันหน้าให้สูงขึ้น

เทสต์ src/__tests__/StationRail.test.tsx: มีแถว "ภาพรวมทั้งหมด" เสมอ,
กดแถวสถานีแล้ว onSelect ได้ id, กด "ภาพรวมทั้งหมด" แล้วได้ null,
แถวที่เลือกมี aria-current
```

---

## 9. ประกอบหน้า Dashboard

```text
ประกอบ src/pages/Dashboard.tsx จากคอมโพเนนต์ที่ทำไว้ (ตอนนี้ยังเป็น PageShell เปล่า)

Layout: main เป็นกริด [เนื้อหา | rail] — lg:grid-cols-[1fr_260px]
ฝั่งเนื้อหาเรียงบนลงล่าง:
1. แถวบนสุด: DateStepper ชิดขวา
2. KpiRow
3. กริด 2 คอลัมน์ lg:grid-cols-[2fr_1fr]
   - ซ้าย: StationDefectChart
   - ขวา: DefectTypeDonut, DefectRatioGauge, WeeklyTrendChart เรียงลงมา
ฝั่ง rail: StationRail (sticky ใต้ NavBar)

state ในหน้า:
- selectedStationId: string | null — แชร์กันระหว่าง StationDefectChart กับ StationRail
  กดที่ไหนก็ไฮไลต์พร้อมกันทั้งสองที่
- date: Date ของ DateStepper

ข้อมูลยังใช้ MOCK_DASHBOARD ไปก่อน แต่ให้ดึงผ่าน hook src/hooks/useDashboard.ts
ที่ห่อ useQuery ไว้ โดย queryFn คืน mock แบบ async เพื่อให้สลับเป็น API จริงทีหลัง
แก้แค่ queryFn ที่เดียว ไม่ต้องแตะหน้า
ระหว่าง isLoading ให้แสดงโครงการ์ดเปล่า ไม่ใช่หน้าว่าง เพื่อไม่ให้ layout กระโดด

เทสต์ src/__tests__/Dashboard.test.tsx: render แล้วเจอหัวข้อการ์ดครบทุกใบ,
กดสถานีใน rail แล้วแถวเดียวกันในกราฟซ้ายถูกไฮไลต์
```
