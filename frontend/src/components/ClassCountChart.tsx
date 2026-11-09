// กราฟแท่งนับจำนวนวัตถุที่ตรวจเจอแยกตามคลาส

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Detection } from '../api/types'
import { chartBox, emptyHint } from '../lib/styles'
import { chartColors } from '../lib/theme'

type Props = {
  detections: Detection[]
}

function countByClass(detections: Detection[]) {
  const counts = new Map<string, number>()
  for (const d of detections) {
    counts.set(d.class, (counts.get(d.class) ?? 0) + 1)
  }
  return [...counts].map(([name, count]) => ({ name, count }))
}

export default function ClassCountChart({ detections }: Props) {
  const data = countByClass(detections)

  if (data.length === 0) {
    return <p className={emptyHint}>ยังไม่มีข้อมูล</p>
  }

  return (
    <div className={chartBox}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="name" stroke={chartColors.axis} fontSize={12} tickLine={false} />
          <YAxis
            stroke={chartColors.axis}
            fontSize={12}
            width={32}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: chartColors.surface,
              border: `1px solid ${chartColors.grid}`,
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="count"
            fill={chartColors.series}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
