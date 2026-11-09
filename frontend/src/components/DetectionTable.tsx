// ตารางวัตถุที่ YOLO ตรวจเจอในเฟรมล่าสุด

import type { Detection } from '../api/types'
import { detectionTable as s } from '../lib/styles'

type Props = {
  detections: Detection[]
}

export default function DetectionTable({ detections }: Props) {
  if (detections.length === 0) {
    return <p className={s.empty}>ยังไม่พบวัตถุ</p>
  }

  return (
    <table className={s.table}>
      <thead>
        <tr className={s.headRow}>
          <th className={s.th}>คลาส</th>
          <th className={s.thRight}>ความมั่นใจ</th>
          <th className={s.thRight}>bbox</th>
        </tr>
      </thead>
      <tbody className={s.body}>
        {detections.map((d, i) => (
          <tr key={`${d.class}-${i}`} className={s.row}>
            <td className={s.td}>{d.class}</td>
            <td className={s.tdRight}>{(d.confidence * 100).toFixed(0)}%</td>
            <td className={s.tdBbox}>{d.bbox.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
