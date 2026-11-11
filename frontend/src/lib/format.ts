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

/**
 * 4.2 -> "4.2" — ตรึงทศนิยมหนึ่งตำแหน่งเสมอ
 * ไม่งั้นค่า 4 กับ 4.2 จะกว้างไม่เท่ากัน แล้วตัวเลขในการ์ดขยับตอนข้อมูลอัปเดต
 */
export function oneDecimal(value: number): string {
  const safe = Number.isFinite(value) ? value : 0
  return safe.toFixed(1)
}

/** 4.6, 0.6 -> "4.6±0.6" ใช้กับเวลามาตรฐานต่อชิ้น */
export function cycleRange(standard: number, tolerance: number): string {
  return `${oneDecimal(standard)}±${oneDecimal(tolerance)}`
}

/** รอบที่ 1 เวลา 4.2 วิ -> "#1 (4.2s)" ใช้เป็น label แกน X ของกราฟ cycle time */
export function cycleLabel(round: number, seconds: number): string {
  return `#${round} (${oneDecimal(seconds)}s)`
}
