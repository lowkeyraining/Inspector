// ฟังก์ชันฟอร์แมตตัวเลขที่ใช้ซ้ำหลายการ์ด

/** 0.068 -> "6.8%" */
export function percent(rate: number): string {
  const safe = Number.isFinite(rate) ? rate : 0
  return `${(safe * 100).toFixed(1)}%`
}

/** 6940 -> "6,940" */
export function thousands(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  return safe.toLocaleString()
}

/** เติมศูนย์หน้าลำดับสถานีให้เป็นสองหลักตาม mockup */
export function stationOrder(order: number): string {
  return String(order).padStart(2, '0')
}
