// ข้อมูลตัวอย่างและตัวช่วยที่ไฟล์เทสใช้ร่วมกัน

import type { Detection } from '../api/types'
import type { CameraConfig } from '../lib/cameras'

export const testCamera: CameraConfig = {
  id: 'cam-test',
  name: 'กล้องทดสอบ',
  location: 'ห้องแล็บ',
  streamPath: '/stream',
}

export const testDetections: Detection[] = [
  { class: 'person', confidence: 0.912, bbox: [10, 20, 30, 40] },
  { class: 'laptop', confidence: 0.655, bbox: [50, 60, 70, 80] },
  { class: 'person', confidence: 0.503, bbox: [90, 10, 110, 30] },
]

import type { DashboardSummary, StationDefect } from '../api/dashboard'
import { MOCK_DASHBOARD } from '../lib/mockDashboard'

export const testStations: StationDefect[] = MOCK_DASHBOARD.stations
export const testSummary: DashboardSummary = MOCK_DASHBOARD

/** อ่าน token สีจาก root ที่ setup.ts ใส่ไว้ เพื่อไม่ต้องเขียน hex ซ้ำในเทส */
export function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}
