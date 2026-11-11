// กราฟเส้น FPS ย้อนหลังของกล้อง

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { FpsPoint } from '../hooks/useFpsHistory'
import { chartBox } from '../lib/styles'
import { chartColors } from '../lib/theme'

type Props = {
  data: FpsPoint[]
}

export default function FpsChart({ data }: Props) {
  return (
    <div className={chartBox}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={chartColors.grid} vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis
            stroke={chartColors.axis}
            fontSize={12}
            width={32}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: chartColors.surface,
              border: `1px solid ${chartColors.grid}`,
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={() => 'FPS'}
            formatter={(value) => (typeof value === 'number' ? value.toFixed(1) : String(value))}
          />
          <Line
            type="monotone"
            dataKey="fps"
            stroke={chartColors.series}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
