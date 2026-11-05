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
    return <p className="text-sm text-slate-500">ยังไม่มีข้อมูล</p>
  }

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            width={32}
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
