// การ์ดโดนัทสัดส่วนประเภทปัญหาที่พบบ่อย

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import type { DefectType } from '../api/dashboard'
import { percent } from '../lib/format'
import { defectTypeDonut as s, emptyHint } from '../lib/styles'
import { chartColors } from '../lib/theme'

type Props = {
  types: DefectType[]
}

/** จำนวนสีที่มีในชุด categorical — เกินกว่านี้ต้องยุบรวมไม่ใช่เพิ่มสี */
const MAX_SLICES = 4

/** เรียงมากไปน้อยเสมอ แล้วยุบส่วนเกินเป็น "อื่น ๆ" ให้พอดีกับจำนวนสีที่มี */
function toSlices(types: DefectType[]): DefectType[] {
  const sorted = [...types].sort((a, b) => b.share - a.share)
  if (sorted.length <= MAX_SLICES) return sorted

  const head = sorted.slice(0, MAX_SLICES - 1)
  const restShare = sorted.slice(MAX_SLICES - 1).reduce((sum, t) => sum + t.share, 0)
  return [...head, { name: 'อื่น ๆ', share: restShare }]
}

export default function DefectTypeDonut({ types }: Props) {
  if (types.length === 0) {
    return <p className={emptyHint}>ยังไม่มีข้อมูล</p>
  }

  const slices = toSlices(types)
  const palette = chartColors.categories
  const summary = slices.map((t) => `${t.name} ${percent(t.share)}`).join(', ')

  return (
    <div className={s.wrap} role="group" aria-label={`ประเภทปัญหาที่พบบ่อย: ${summary}`}>
      <div className={s.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="share"
              nameKey="name"
              innerRadius="55%"
              outerRadius="80%"
              stroke="none"
              isAnimationActive={false}
            >
              {slices.map((slice, i) => (
                <Cell key={slice.name} fill={palette[i % palette.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className={s.legend}>
        {slices.map((slice, i) => (
          <li key={slice.name} className={s.legendRow}>
            <span
              className={s.legendDot}
              style={{ backgroundColor: palette[i % palette.length] }}
            />
            <span className={s.legendValue}>{percent(slice.share)}</span>
            <span className={s.legendName}>{slice.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
