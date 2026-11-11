// การ์ดกราฟแท่งแนวโน้มอัตราของเสียรายสัปดาห์

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WeeklyPoint } from '../api/dashboard'
import { percent } from '../lib/format'
import { chartBox, emptyHint } from '../lib/styles'
import { chartColors } from '../lib/theme'
import { isOverThreshold } from '../lib/threshold'

type Props = {
  points: WeeklyPoint[]
}

export default function WeeklyTrendChart({ points }: Props) {
  if (points.length === 0) {
    return <p className={emptyHint}>ยังไม่มีข้อมูล</p>
  }

  return (
    <div className={chartBox}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="label"
            stroke={chartColors.axis}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: chartColors.surface,
              border: `1px solid ${chartColors.grid}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value) => (typeof value === 'number' ? percent(value) : String(value))}
          />
          {/* ระบายทีละแท่งด้วย Cell เพราะสีขึ้นกับค่าของแต่ละแท่ง ไม่ใช่สีเดียวทั้งชุด */}
          <Bar dataKey="defectRate" radius={[4, 4, 0, 0]} isAnimationActive={false}>
            {points.map((point) => (
              <Cell
                key={point.label}
                fill={isOverThreshold(point.defectRate) ? chartColors.alert : chartColors.series}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
