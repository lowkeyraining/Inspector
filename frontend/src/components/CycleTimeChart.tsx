// กราฟแท่ง cycle time รายรอบ เทียบกับเวลามาตรฐาน ± ช่วงที่ยอมรับได้

import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CyclePoint } from '../api/dashboard'
import { cycleLabel, oneDecimal } from '../lib/format'
import { cycleTimeChart as s, emptyHint } from '../lib/styles'
import { chartColors } from '../lib/theme'
import { isOutOfCycleTolerance } from '../lib/threshold'

type Props = {
  cycles: CyclePoint[]
  /** เวลามาตรฐานต่อชิ้น (วินาที) */
  standard: number
  /** ช่วงที่ยอมรับได้ ± วินาที */
  tolerance: number
}

export default function CycleTimeChart({ cycles, standard, tolerance }: Props) {
  if (cycles.length === 0) {
    return <p className={emptyHint}>ยังไม่มีข้อมูล</p>
  }

  // label คำนวณไว้ล่วงหน้า แกน X จะได้ไม่ต้องเรียกฟังก์ชันซ้ำทุกครั้งที่ recharts วาด
  const data = cycles.map((c) => ({ ...c, label: cycleLabel(c.round, c.seconds) }))
  const overCount = cycles.filter((c) => isOutOfCycleTolerance(c.seconds, standard, tolerance))
    .length

  return (
    <>
      <div className={s.box}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="label"
              stroke={chartColors.axis}
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            {/* ซ่อนแกน Y แต่ยังต้องกำหนด domain ให้เส้นมาตรฐานกับแท่งอยู่สเกลเดียวกัน */}
            <YAxis hide domain={[0, (max: number) => Math.max(max, standard + tolerance) * 1.15]} />
            <ReferenceLine
              y={standard}
              stroke={chartColors.axis}
              strokeDasharray="4 4"
              strokeOpacity={0.6}
            />
            <Tooltip
              cursor={false}
              contentStyle={{
                background: chartColors.surface,
                border: `1px solid ${chartColors.grid}`,
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(value) =>
                typeof value === 'number' ? `${oneDecimal(value)} วิ` : String(value)
              }
            />
            {/* ระบายทีละแท่ง เพราะสีขึ้นกับว่ารอบนั้นหลุดช่วงที่ยอมรับหรือไม่ */}
            <Bar dataKey="seconds" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {data.map((point) => (
                <Cell
                  key={point.round}
                  fill={
                    isOutOfCycleTolerance(point.seconds, standard, tolerance)
                      ? chartColors.alert
                      : chartColors.series
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p className={s.caption}>
        <span className={s.captionDot} />
        {overCount === 0
          ? 'ทุกรอบอยู่ในช่วงเวลามาตรฐาน'
          : `${overCount} รอบหลุดช่วงเวลามาตรฐาน`}
      </p>
    </>
  )
}
