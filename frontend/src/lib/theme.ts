// สะพานส่งสีจาก CSS token ให้ Recharts ที่รับ var() ไม่ได้

/**
 * SVG presentation attribute (stroke, fill) ไม่รองรับ var() จึงต้องส่งเป็นค่าจริง
 * ไฟล์นี้ "อ่าน" ค่าจาก CSS variable ที่นิยามไว้ใน src/index.css (@theme)
 * ไม่ได้เก็บ hex ซ้ำ — แก้สีที่ index.css ที่เดียว กราฟเปลี่ยนตามเอง
 */

function cssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

type ChartColors = {
  /** เส้น/แท่งข้อมูลปกติ */
  series: string
  /** ข้อมูลที่เกินเกณฑ์ */
  alert: string
  /** เส้น grid ในกราฟ และส่วน "ปกติ" ของเกจ */
  grid: string
  /** ตัวอักษรและเส้นแกน */
  axis: string
  /** พื้นหลัง tooltip */
  surface: string
  /** ชุดสีแบ่งหมวด เรียงตามลำดับความสำคัญ */
  categories: string[]
}

/**
 * อ่านสดทุกครั้งที่เรียก (ไม่ cache) เพื่อให้ยังถูกต้องถ้าภายหลังมีสลับธีม
 * ค่าใช้จ่ายคือ getComputedStyle ไม่กี่ครั้งต่อการ render กราฟ ซึ่งน้อยมาก
 */
export const chartColors: ChartColors = {
  get series() {
    return cssVar('--color-brand')
  },
  get alert() {
    return cssVar('--color-alert')
  },
  get grid() {
    return cssVar('--color-line')
  },
  get axis() {
    return cssVar('--color-ink-muted')
  },
  get surface() {
    return cssVar('--color-surface')
  },
  get categories() {
    return [cssVar('--color-cat-1'), cssVar('--color-cat-2'), cssVar('--color-cat-3'), cssVar('--color-cat-4')]
  },
}
