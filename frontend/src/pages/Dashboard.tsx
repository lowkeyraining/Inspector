// หน้า Dashboard — ภาพรวมทั้งไลน์ หรือเจาะลงสถานีเดียวเมื่อเลือกจาก rail

import { useState } from 'react'
import CycleTimeChart from '../components/CycleTimeChart'
import DateStepper from '../components/DateStepper'
import DefectEventList from '../components/DefectEventList'
import DefectRatioGauge from '../components/DefectRatioGauge'
import DefectTypeDonut from '../components/DefectTypeDonut'
import KpiRow from '../components/KpiRow'
import StationDefectChart from '../components/StationDefectChart'
import StationKpiRow from '../components/StationKpiRow'
import StationRail from '../components/StationRail'
import WeeklyTrendChart from '../components/WeeklyTrendChart'
import { hasDashboardData, useDashboard } from '../hooks/useDashboard'
import { cycleRange, stationOrder } from '../lib/format'
import { dashboard as s } from '../lib/styles'

export default function Dashboard() {
  const { data, isLoading, error } = useDashboard()
  const connected = hasDashboardData(data)

  // null = ภาพรวมทั้งไลน์ ถ้ามีค่าแปลว่าเจาะลงสถานีนั้น
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

  // สถานีที่เลือกอาจยังไม่มีรายละเอียด — แยกสองตัวแปรไว้ จะได้บอกต่างกันระหว่าง
  // "ไม่ได้เลือกสถานี" (ภาพรวม) กับ "เลือกแล้วแต่ข้อมูลยังไม่มา" (ขึ้นสถานะรอ)
  const selectedStation = selectedStationId
    ? data.stations.find((st) => st.id === selectedStationId)
    : undefined
  const detail = selectedStationId
    ? data.stationDetails.find((st) => st.id === selectedStationId)
    : undefined

  const toolbar = (
    <div className={s.toolbar}>
      {selectedStation ? (
        <span className={s.stationChip}>
          Station {stationOrder(selectedStation.order)} — {selectedStation.name}
        </span>
      ) : (
        <span />
      )}
      <DateStepper value={date} onChange={setDate} />
    </div>
  )

  if (selectedStationId) {
    return (
      <main className={s.main}>
        <div className={s.content}>
          {toolbar}

          {detail ? (
            <>
              <StationKpiRow station={detail} />

              <div className={s.stationGrid}>
                <section className={s.panel}>
                  <h2 className={s.panelTitle}>
                    Cycle time รายรอบ — เทียบเวลามาตรฐาน{' '}
                    {cycleRange(detail.standardCycleTime, detail.cycleTolerance)} วิ
                  </h2>
                  <CycleTimeChart
                    cycles={detail.cycles}
                    standard={detail.standardCycleTime}
                    tolerance={detail.cycleTolerance}
                  />
                </section>

                <section className={s.panel}>
                  <h2 className={s.panelTitle}>
                    เหตุการณ์แยกชิ้นงานวันนี้ ({detail.events.length})
                  </h2>
                  <DefectEventList events={detail.events} />
                </section>
              </div>
            </>
          ) : (
            <p className={s.waitingPanel}>
              ยังไม่มีข้อมูลรายละเอียดของสถานีนี้ — กด "ภาพรวมทั้งหมด" เพื่อกลับไปดูทั้งไลน์
            </p>
          )}
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

  return (
    <main className={s.main}>
      <div className={s.content}>
        {toolbar}

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
