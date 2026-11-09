// แถว KPI 4 ใบบนสุดของหน้า Dashboard

import type { DashboardSummary } from '../api/dashboard'
import { percent, thousands } from '../lib/format'
import { kpiRow as s } from '../lib/styles'
import { isOverThreshold } from '../lib/threshold'
import StatCard from './StatCard'

type Props = {
  /** null = ยังไม่ได้เชื่อมข้อมูล ให้ขึ้นการ์ดเปล่า */
  summary: DashboardSummary | null
}

const WAITING = 'รอเชื่อมข้อมูล'

export default function KpiRow({ summary }: Props) {
  if (!summary || summary.stations.length === 0) {
    return (
      <div className={s.grid}>
        <StatCard label="สถานีทั้งหมด" value="-" caption={WAITING} />
        <StatCard label="อัตราของเสียเฉลี่ย" value="-" caption={WAITING} />
        <StatCard label="จุดที่ต้องดูแลด่วน" value="-" caption={WAITING} />
        <StatCard label="ยอดผลิตวันนี้" value="-" caption={WAITING} />
      </div>
    )
  }

  const avgAlert = isOverThreshold(summary.avgDefectRate)

  // หาสถานีจาก worstStationId ไม่ fix ชื่อไว้ เพราะ backend จะชี้สถานีไหนก็ได้
  const worst = summary.stations.find((st) => st.id === summary.worstStationId)

  return (
    <div className={s.grid}>
      <StatCard
        label="สถานีทั้งหมด"
        value={summary.stationCount}
        caption="กำลังเฝ้าระวังอยู่ทั้งหมด"
      />
      <StatCard
        label="อัตราของเสียเฉลี่ย"
        value={percent(summary.avgDefectRate)}
        tone={avgAlert ? 'alert' : 'normal'}
        caption={avgAlert ? 'เกินค่า KPI ที่ตั้งไว้' : 'อยู่ในเกณฑ์ที่ตั้งไว้'}
      />
      <StatCard
        label="จุดที่ต้องดูแลด่วน"
        value={worst ? worst.name : '-'}
        tone={worst && isOverThreshold(worst.defectRate) ? 'alert' : 'normal'}
        caption={worst ? `อัตราของเสีย ${percent(worst.defectRate)}` : 'ยังไม่มีข้อมูลสถานี'}
      />
      <StatCard
        label="ยอดผลิตวันนี้"
        value={`${thousands(summary.producedToday)}/${thousands(summary.productionTarget)}`}
        caption="เทียบกับเป้าหมายของวัน"
      />
    </div>
  )
}
