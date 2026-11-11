// ข้อมูลเปล่าของหน้า Dashboard ใช้ตอนยังไม่ได้เชื่อม backend

import type { DashboardSummary } from '../api/dashboard'

/**
 * ค่าเริ่มต้นที่ทำให้ทุกการ์ดขึ้นสถานะ "รอเชื่อมข้อมูล"
 * แยกจาก MOCK_DASHBOARD เพราะตัวนั้นเหลือไว้ให้เทสใช้เป็นข้อมูลตัวอย่างเท่านั้น
 */
export const EMPTY_DASHBOARD: DashboardSummary = {
  stationCount: 0,
  avgDefectRate: 0,
  worstStationId: '',
  producedToday: 0,
  productionTarget: 0,
  stations: [],
  defectTypes: [],
  weekly: [],
  stationDetails: [],
}
