// แถว KPI 4 ใบของมุมมองราย Station — คนละชุดกับ KpiRow ของภาพรวมทั้งไลน์

import type { StationDetail } from '../api/dashboard'
import { cycleRange, oneDecimal, percent, thousands } from '../lib/format'
import { kpiRow as s } from '../lib/styles'
import { isOverThreshold } from '../lib/threshold'
import StatCard from './StatCard'

type Props = {
  station: StationDetail
}

export default function StationKpiRow({ station }: Props) {
  const rateAlert = isOverThreshold(station.defectRate)

  // เทียบ cycle time เฉลี่ยกับเวลามาตรฐาน เพื่อบอกว่าวันนี้เร็วหรือช้ากว่าปกติ
  const diff = station.avgCycleTime - station.standardCycleTime
  const slower = diff > 0

  return (
    <div className={s.grid}>
      <StatCard
        label="ตรวจพบทั้งหมดวันนี้"
        value={thousands(station.inspectedToday)}
        caption="ชิ้นงานทั้งหมดผ่านกล้อง"
      />
      <StatCard
        label="อัตราตรวจพบสิ่งผิดปกติ"
        value={percent(station.defectRate)}
        tone={rateAlert ? 'alert' : 'normal'}
        caption={`พบปัญหา ${thousands(station.defectCount)} ชิ้นงาน`}
      />
      <StatCard
        label="Cycle time เฉลี่ยวันนี้"
        value={oneDecimal(station.avgCycleTime)}
        unit="วิ"
        caption={slower ? 'ช้ากว่าเวลามาตรฐาน' : 'เร็วกว่าเวลามาตรฐาน'}
      />
      <StatCard
        label="เวลามาตรฐาน (วิ)"
        value={cycleRange(station.standardCycleTime, station.cycleTolerance)}
        caption="อ้างอิงจากแบบสถิติล่าสุด"
      />
    </div>
  )
}
