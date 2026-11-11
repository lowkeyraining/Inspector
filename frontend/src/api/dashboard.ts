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

/** cycle time ของการผลิตหนึ่งรอบ */
export type CyclePoint = {
  /** ลำดับรอบในวันนั้น เริ่มที่ 1 */
  round: number
  /** วินาทีต่อชิ้น */
  seconds: number
}

/** ชิ้นงานหนึ่งชิ้นที่ตรวจแล้วพบปัญหา */
export type DefectEvent = {
  id: string
  /** เวลาที่ตรวจพบ รูปแบบ "09:12" — backend ฟอร์แมตมาให้แล้ว */
  time: string
  /** หมายเลขชิ้นงาน เช่น "4821" */
  pieceNo: string
  /** ชื่อปัญหาที่โมเดลตรวจเจอ */
  defectName: string
  /** ความมั่นใจของโมเดล สัดส่วน 0–1 */
  confidence: number
}

/**
 * ข้อมูลรายสถานีที่ใช้ตอนเลือกสถานีใน rail
 * ต่อยอดจาก StationDefect เพราะเป็นสถานีตัวเดียวกัน แค่ลงรายละเอียดเพิ่ม
 */
export type StationDetail = StationDefect & {
  /** ชิ้นงานที่ผ่านกล้องวันนี้ */
  inspectedToday: number
  /** จำนวนชิ้นที่พบปัญหาวันนี้ */
  defectCount: number
  /** cycle time เฉลี่ยวันนี้ (วินาที) */
  avgCycleTime: number
  /** เวลามาตรฐานต่อชิ้น (วินาที) */
  standardCycleTime: number
  /** ช่วงที่ยอมรับได้ ± วินาที */
  cycleTolerance: number
  cycles: CyclePoint[]
  events: DefectEvent[]
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
  /**
   * รายละเอียดของสถานีที่มีข้อมูลพอจะลงลึกได้ ไม่จำเป็นต้องครบทุกสถานีใน stations
   * สถานีที่ไม่อยู่ในนี้จะขึ้นสถานะรอข้อมูลตอนถูกเลือก
   */
  stationDetails: StationDetail[]
}
