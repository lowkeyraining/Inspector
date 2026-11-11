// เกณฑ์เตือนอัตราของเสีย ใช้ร่วมกันทุกการ์ด

/**
 * ใน mockup สีแดงต้องขึ้นพร้อมกันทุกจุดที่พูดถึงสถานีเดียวกัน
 * ถ้าแต่ละการ์ดเขียนตัวเลขเอง จะหลุดไม่ตรงกันทันทีที่เกณฑ์เปลี่ยน
 */

export const DEFECT_THRESHOLD = 0.05

export function isOverThreshold(rate: number): boolean {
  return Number.isFinite(rate) && rate > DEFECT_THRESHOLD
}

/**
 * รอบนี้ใช้เวลาหลุดจากช่วงที่ยอมรับได้หรือยัง (เช่น มาตรฐาน 4.6 ± 0.6 วิ)
 *
 * ชนขอบพอดี (5.2 วิ เมื่อมาตรฐาน 4.6 ± 0.6) นับว่า "หลุด" ตาม mockup —
 * เป็นหน้าจอเฝ้าระวัง เตือนไว้ก่อนดีกว่าปล่อยผ่านรอบที่อยู่ริมขอบพอดี
 * และยังกันปัญหาทศนิยม binary ที่ทำให้ 5.2 - 4.6 ไม่เท่ากับ 0.6 เป๊ะ
 */
export function isOutOfCycleTolerance(
  seconds: number,
  standard: number,
  tolerance: number,
): boolean {
  if (![seconds, standard, tolerance].every(Number.isFinite)) return false
  return Math.abs(seconds - standard) >= tolerance
}
