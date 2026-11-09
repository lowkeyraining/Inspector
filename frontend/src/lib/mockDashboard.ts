// ข้อมูลตัวอย่างของหน้า Dashboard ใช้ระหว่างรอ backend

import type { DashboardSummary } from '../api/dashboard'

/** ข้อมูลตัวอย่างตาม mockup ใช้ระหว่างรอ backend ทำ endpoint ของ Dashboard */
export const MOCK_DASHBOARD: DashboardSummary = {
  stationCount: 8,
  avgDefectRate: 0.068,
  worstStationId: 'st-05',
  producedToday: 6940,
  productionTarget: 7000,

  stations: [
    { id: 'st-01', order: 1, name: 'ขึ้นรูป', defectRate: 0.008 },
    { id: 'st-02', order: 2, name: 'เจาะรู', defectRate: 0.005 },
    { id: 'st-03', order: 3, name: 'เชื่อม', defectRate: 0.021 },
    { id: 'st-04', order: 4, name: 'พ่นสี', defectRate: 0.009 },
    { id: 'st-05', order: 5, name: 'ประกอบ', defectRate: 0.064 },
    { id: 'st-06', order: 6, name: 'บรรจุ', defectRate: 0.011 },
    { id: 'st-07', order: 7, name: 'ติดฉลาก', defectRate: 0.003 },
    { id: 'st-08', order: 8, name: 'ตรวจสอบ', defectRate: 0.004 },
  ],

  defectTypes: [
    { name: 'ประกอบไม่ได้ระยะ', share: 0.42 },
    { name: 'รอยขีดข่วน', share: 0.27 },
    { name: 'สีไม่สม่ำเสมอ', share: 0.19 },
    { name: 'ชิ้นส่วนขาด', share: 0.12 },
  ],

  weekly: [
    { label: 'W1', defectRate: 0.041 },
    { label: 'W2', defectRate: 0.055 },
    { label: 'W3', defectRate: 0.038 },
    { label: 'W4', defectRate: 0.068 },
  ],
}
