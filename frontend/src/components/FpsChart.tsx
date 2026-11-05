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

type Props = {
  data: FpsPoint[]
}

export default function FpsChart({ data }: Props) {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#1e293b" vertical={false} />
          <XAxis dataKey="t" hide />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            width={32}
            tickLine={false}
            axisLine={false}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: 8,
              fontSize: 12,
            }}
            labelFormatter={() => 'FPS'}
            formatter={(value) => (typeof value === 'number' ? value.toFixed(1) : String(value))}
          />
          <Line
            type="monotone"
            dataKey="fps"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
