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

  // ตั้งใจใส่ไม่ครบทุกสถานี เพื่อให้เทสครอบคลุมกรณีเลือกสถานีที่ยังไม่มีรายละเอียดด้วย
  stationDetails: [
    {
      id: 'st-03',
      order: 3,
      name: 'เชื่อม',
      defectRate: 0.021,
      inspectedToday: 1204,
      defectCount: 25,
      avgCycleTime: 4.2,
      standardCycleTime: 4.6,
      cycleTolerance: 0.6,
      cycles: [
        { round: 1, seconds: 4.2 },
        { round: 2, seconds: 4.4 },
        { round: 3, seconds: 4.5 },
        { round: 4, seconds: 5.6 },
        { round: 5, seconds: 4.3 },
        { round: 6, seconds: 5.2 },
        { round: 7, seconds: 4.1 },
        { round: 8, seconds: 4.4 },
      ],
      events: [
        {
          id: 'ev-4821',
          time: '09:12',
          pieceNo: '4821',
          defectName: 'รอยเชื่อมมีรูพรุน',
          confidence: 0.79,
        },
        {
          id: 'ev-5012',
          time: '10:15',
          pieceNo: '5012',
          defectName: 'รอยเชื่อมมีรูพรุน',
          confidence: 0.68,
        },
        { id: 'ev-5203', time: '11:20', pieceNo: '5203', defectName: 'รอยแตก', confidence: 0.81 },
      ],
    },
    {
      id: 'st-05',
      order: 5,
      name: 'ประกอบ',
      defectRate: 0.064,
      inspectedToday: 1180,
      defectCount: 76,
      avgCycleTime: 3.4,
      standardCycleTime: 3.0,
      cycleTolerance: 0.4,
      cycles: [
        { round: 1, seconds: 3.1 },
        { round: 2, seconds: 3.4 },
        { round: 3, seconds: 2.5 },
        { round: 4, seconds: 3.2 },
        { round: 5, seconds: 3.9 },
        { round: 6, seconds: 3.3 },
      ],
      events: [
        {
          id: 'ev-6101',
          time: '08:40',
          pieceNo: '6101',
          defectName: 'ประกอบไม่ได้ระยะ',
          confidence: 0.88,
        },
        {
          id: 'ev-6244',
          time: '13:05',
          pieceNo: '6244',
          defectName: 'ชิ้นส่วนขาด',
          confidence: 0.72,
        },
      ],
    },
  ],
}
