// แถบรายการสถานีด้านขวาของหน้า Dashboard ใช้เลือกสถานีที่สนใจ

import type { StationDefect } from '../api/dashboard'
import { percent, stationOrder } from '../lib/format'
import { stationRail as s } from '../lib/styles'
import { isOverThreshold } from '../lib/threshold'

type Props = {
  stations: StationDefect[]
  avgDefectRate: number
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export default function StationRail({ stations, avgDefectRate, selectedId, onSelect }: Props) {
  return (
    <aside className={s.wrap}>
      <p className={s.header}>STATION ทั้งหมด</p>

      <ul className={s.list}>
        <li>
          <button
            type="button"
            onClick={() => onSelect(null)}
            aria-label={`ภาพรวมทั้งหมด ${percent(avgDefectRate)}`}
            aria-current={selectedId === null ? 'true' : undefined}
            className={selectedId === null ? s.rowSelected : s.row}
          >
            <span className={s.name}>ภาพรวมทั้งหมด</span>
            <span className={s.value}>{percent(avgDefectRate)}</span>
          </button>
        </li>

        {stations.length === 0 && <li className={s.empty}>ยังไม่มีสถานีในระบบ</li>}

        {stations.map((station) => {
          const over = isOverThreshold(station.defectRate)
          const selected = station.id === selectedId

          // แถวที่เกินเกณฑ์ต้องแดงเสมอ สถานะ "เกินเกณฑ์" สำคัญกว่าสถานะ "ถูกเลือก"
          const rowClass = over
            ? selected
              ? s.rowAlertSelected
              : s.rowAlert
            : selected
              ? s.rowSelected
              : s.row

          return (
            <li key={station.id}>
              <button
                type="button"
                onClick={() => onSelect(station.id)}
                // span ย่อยในแถวเป็น inline ทำให้ชื่อปุ่มถูกอ่านติดกันเป็น "03เชื่อม2.1%"
                // ตั้งชื่อเองให้อ่านรู้เรื่องและไม่ชนกับปุ่มในกราฟฝั่งซ้าย
                aria-label={`${stationOrder(station.order)} ${station.name} ${percent(station.defectRate)}`}
                aria-current={selected ? 'true' : undefined}
                className={rowClass}
              >
                <span className={over ? s.dotAlert : s.dot} />
                <span className={s.order}>{stationOrder(station.order)}</span>
                <span className={s.name}>{station.name}</span>
                <span className={over ? s.valueAlert : s.value}>
                  {percent(station.defectRate)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
