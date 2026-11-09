// การ์ดเปรียบเทียบอัตราของเสียรายสถานี เป็นแถบแนวนอนที่กดเลือกได้

import type { StationDefect } from '../api/dashboard'
import { percent, stationOrder } from '../lib/format'
import { stationDefectChart as s } from '../lib/styles'
import { isOverThreshold } from '../lib/threshold'
import EmptyState from './EmptyState'

type Props = {
  stations: StationDefect[]
  selectedId?: string
  onSelect?: (id: string) => void
}

export default function StationDefectChart({ stations, selectedId, onSelect }: Props) {
  if (stations.length === 0) {
    return (
      <EmptyState
        title="ยังไม่มีข้อมูลสถานี"
        description="เมื่อมีการบันทึกผลตรวจของแต่ละสถานีแล้ว กราฟเปรียบเทียบจะแสดงที่นี่"
      />
    )
  }

  // normalize กับค่าสูงสุดในชุด ไม่ใช่ 100% เพราะค่าจริงอยู่แถว 0–7%
  // ถ้าเทียบกับ 100% แถบทุกอันจะสั้นจนแยกความต่างไม่ออก
  const max = Math.max(...stations.map((st) => st.defectRate))

  return (
    <div>
      <ul className={s.list}>
        {stations.map((station) => {
          const over = isOverThreshold(station.defectRate)
          const selected = station.id === selectedId
          const width = max > 0 ? `${(station.defectRate / max) * 100}%` : '0%'
          const label = `${stationOrder(station.order)} ${station.name} ${percent(station.defectRate)}`

          const content = (
            <>
              <span className={s.name}>
                <span className={s.order}>{stationOrder(station.order)}</span>
                {station.name}
              </span>
              <span className={s.track}>
                <span
                  role="img"
                  aria-label={label}
                  className={over ? s.barAlert : s.bar}
                  style={{ width }}
                />
              </span>
              <span className={over ? s.valueAlert : s.value}>{percent(station.defectRate)}</span>
            </>
          )

          return (
            <li key={station.id}>
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(station.id)}
                  aria-label={`เลือกสถานี ${stationOrder(station.order)} ${station.name}`}
                  aria-current={selected ? 'true' : undefined}
                  className={selected ? s.rowSelected : s.row}
                >
                  {content}
                </button>
              ) : (
                <div className={selected ? s.rowSelected : s.row}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>

      <p className={s.legend}>
        <span className={s.legendDot} />
        อัตราการตรวจพบที่เกินเกณฑ์
      </p>
    </div>
  )
}
