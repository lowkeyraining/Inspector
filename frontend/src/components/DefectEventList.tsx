// รายการชิ้นงานที่ตรวจพบปัญหาในวันนี้ของสถานีที่เลือก

import type { DefectEvent } from '../api/dashboard'
import { percent } from '../lib/format'
import { defectEventList as s } from '../lib/styles'

type Props = {
  events: DefectEvent[]
}

export default function DefectEventList({ events }: Props) {
  if (events.length === 0) {
    return <p className={s.empty}>วันนี้ยังไม่พบชิ้นงานที่มีปัญหา</p>
  }

  return (
    <ul className={s.list}>
      {events.map((event) => (
        <li key={event.id} className={s.row}>
          <span className={s.badge}>NG</span>
          {/* รวมเป็น span เดียว ไม่งั้น screen reader อ่านติดกันเป็นก้อนเดียวอ่านไม่รู้เรื่อง */}
          <span className={s.text}>
            {event.time} · #{event.pieceNo} · {event.defectName}
          </span>
          <span className={s.confidence}>{percent(event.confidence)}</span>
        </li>
      ))}
    </ul>
  )
}
