// การ์ดเกจสัดส่วนของเสียรวมเทียบกับยอดผลิต

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { percent, thousands } from '../lib/format'
import { defectRatioGauge as s, emptyHint } from '../lib/styles'
import { chartColors } from '../lib/theme'
import { isOverThreshold } from '../lib/threshold'

type Props = {
  /** null = ยังไม่ได้เชื่อมข้อมูล */
  defectRate: number | null
  total: number | null
}

/** กันค่าเพี้ยนหรือ NaN จาก backend ไม่ให้ทำให้วงกราฟพัง */
function clampRate(rate: number): number {
  if (!Number.isFinite(rate)) return 0
  return Math.min(Math.max(rate, 0), 1)
}

export default function DefectRatioGauge({ defectRate, total }: Props) {
  if (defectRate === null || total === null) {
    return <p className={emptyHint}>ยังไม่มีข้อมูล</p>
  }

  const rate = clampRate(defectRate)
  const over = isOverThreshold(rate)
  const defectColor = over ? chartColors.alert : chartColors.series

  const data = [
    { name: 'ของเสีย', value: rate },
    { name: 'ปกติ', value: 1 - rate },
  ]

  return (
    <div className={s.wrap}>
      <div className={s.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="85%"
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={defectColor} />
              <Cell fill={chartColors.grid} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* วางตัวเลขเป็น HTML ทับวง ไม่ใช่ <text> ใน SVG เพื่อให้ใช้ token สีและฟอนต์ชุดเดียวกับ UI */}
        <div className={s.center}>
          <span className={over ? s.centerValueAlert : s.centerValue}>{percent(rate)}</span>
          <span className={s.centerTotal}>{thousands(total)}</span>
        </div>
      </div>

      <ul className={s.legend}>
        <li className={s.legendRow}>
          <span className={s.legendDot} style={{ backgroundColor: defectColor }} />
          <span className={s.legendText}>{percent(rate)} ของเสีย</span>
        </li>
        <li className={s.legendRow}>
          <span className={s.legendDot} style={{ backgroundColor: chartColors.grid }} />
          <span className={s.legendText}>ปกติ</span>
        </li>
      </ul>
    </div>
  )
}
