// ทะเบียนกล้องในระบบ — แหล่งเดียวที่ UI ทุกจุดวนอ่าน

/**
 * ตอนนี้ backend เปิด MJPEG ไว้ที่ /stream เส้นเดียว (ดู backend/app/main.py)
 * จึงมีรายการเดียว แต่ UI ทุกส่วนวนจากลิสต์นี้แล้ว — เพิ่มกล้องได้โดยเพิ่ม object
 *
 * ขั้นต่อไปเมื่อ backend รองรับหลายกล้อง:
 *   1. เพิ่ม endpoint เช่น GET /cameras แล้วเปลี่ยนไฟล์นี้เป็น hook ที่ fetch มา
 *   2. เปลี่ยน streamPath เป็น `/cameras/${id}/stream`
 *   3. ให้ /health แยกข้อมูลรายกล้อง แล้วส่ง id เข้า useHealth()
 */

export type CameraConfig = {
  id: string
  name: string
  /** ตำแหน่งติดตั้ง ใช้แสดงใต้ชื่อกล้อง */
  location?: string
  /** path ของ MJPEG stream บน backend */
  streamPath: string
}

/**
 * ตอนนี้มีกล้องตัวเดียวเท่าที่ backend เปิด stream ไว้
 * streamPath ต่อท้าย base URL ของ client.ts เอง ('/api' ผ่าน proxy ของ vite)
 * จึงเขียน path ฝั่ง backend ตรง ๆ ไม่ต้องใส่ /api นำหน้า
 *
 * ลิสต์ว่างได้ Monitor จะขึ้น empty state แทน
 */
export const CAMERAS: CameraConfig[] = [
  { id: 'cam-1', name: 'กล้อง 1', location: 'สายการผลิตหลัก', streamPath: '/stream' },
]

export function findCamera(id: string): CameraConfig | undefined {
  return CAMERAS.find((c) => c.id === id)
}
