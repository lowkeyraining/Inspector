// ชนิดข้อมูลของหน้า Dashboard — สถานี ประเภทปัญหา และแนวโน้มรายสัปดาห์

export type StationDefect = {
  id: string
  order: number
  name: string
  /** สัดส่วน 0–1 ไม่ใช่เปอร์เซ็นต์ */
  defectRate: number
}

export type DefectType = {
  name: string
  /** สัดส่วน 0–1 */
  share: number
}

export type WeeklyPoint = {
  label: string
  defectRate: number
}

export type DashboardSummary = {
  stationCount: number
  avgDefectRate: number
  worstStationId: string
  producedToday: number
  productionTarget: number
  stations: StationDefect[]
  defectTypes: DefectType[]
  weekly: WeeklyPoint[]
}
