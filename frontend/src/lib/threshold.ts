// เกณฑ์เตือนอัตราของเสีย ใช้ร่วมกันทุกการ์ด

/**
 * ใน mockup สีแดงต้องขึ้นพร้อมกันทุกจุดที่พูดถึงสถานีเดียวกัน
 * ถ้าแต่ละการ์ดเขียนตัวเลขเอง จะหลุดไม่ตรงกันทันทีที่เกณฑ์เปลี่ยน
 */

export const DEFECT_THRESHOLD = 0.05

export function isOverThreshold(rate: number): boolean {
  return Number.isFinite(rate) && rate > DEFECT_THRESHOLD
}
