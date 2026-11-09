// หน้า Dashboard — ภาพรวมอัตราของเสียของทุกสถานีในวันที่เลือก

import { useState } from 'react'
import DateStepper from '../components/DateStepper'
import DefectRatioGauge from '../components/DefectRatioGauge'
import DefectTypeDonut from '../components/DefectTypeDonut'
import KpiRow from '../components/KpiRow'
import StationDefectChart from '../components/StationDefectChart'
import StationRail from '../components/StationRail'
import WeeklyTrendChart from '../components/WeeklyTrendChart'
import { hasDashboardData, useDashboard } from '../hooks/useDashboard'
import { dashboard as s } from '../lib/styles'

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard()
  const connected = hasDashboardData(data)

  // สองการ์ดนี้แชร์สถานีที่เลือกกัน กดที่ไหนก็ไฮไลต์พร้อมกันทั้งคู่
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [date, setDate] = useState(() => new Date())

  if (isLoading || !data) {
    // แสดงโครงการ์ดเปล่าไว้ก่อน ไม่ให้ layout กระโดดตอนข้อมูลมาถึง
    return (
      <main className={s.main}>
        <div className={s.content}>
          <div className={s.skeletonKpi}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={s.skeletonCard} />
            ))}
          </div>
          <div className={s.skeletonPanels}>
            <div className={s.skeletonPanelTall} />
            <div className={s.skeletonPanelTall} />
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className={s.main}>
        <p className={s.errorBanner}>โหลดข้อมูล Dashboard ไม่ได้ — {error.message}</p>
      </main>
    )
  }

  return (
    <main className={s.main}>
      <div className={s.content}>
        <div className={s.toolbar}>
          <DateStepper value={date} onChange={setDate} />
        </div>

        <KpiRow summary={connected ? data : null} />

        <div className={s.panelGrid}>
          <section className={s.panel}>
            <h2 className={s.panelTitle}>
              เปรียบเทียบอัตราการตรวจพบชิ้นบกพร่องตาม Station
            </h2>
            <StationDefectChart
              stations={data.stations}
              selectedId={selectedStationId ?? undefined}
              onSelect={setSelectedStationId}
            />
          </section>

          <div className={s.sideColumn}>
            <section className={s.panel}>
              <h2 className={s.panelTitle}>ประเภทปัญหาที่พบบ่อย</h2>
              <DefectTypeDonut types={data.defectTypes} />
            </section>

            <section className={s.panel}>
              <h2 className={s.panelTitle}>สัดส่วนของเสียรวม</h2>
              <DefectRatioGauge
              defectRate={connected ? data.avgDefectRate : null}
              total={connected ? data.producedToday : null}
            />
            </section>

            <section className={s.panel}>
              <h2 className={s.panelTitle}>แนวโน้มรายสัปดาห์</h2>
              <WeeklyTrendChart points={data.weekly} />
            </section>
          </div>
        </div>
      </div>

      <StationRail
        stations={data.stations}
        avgDefectRate={data.avgDefectRate}
        selectedId={selectedStationId}
        onSelect={setSelectedStationId}
      />
    </main>
  )
}
