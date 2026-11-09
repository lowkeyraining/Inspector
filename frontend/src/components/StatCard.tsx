// การ์ดตัวเลขใบเดียว รองรับโทนเตือนเมื่อค่าเกินเกณฑ์

import { statCard as s } from '../lib/styles'

type Props = {
  label: string
  value: string | number
  unit?: string
  /** บรรทัดเล็กใต้ตัวเลข ใช้ขยายความว่าเลขนั้นแปลว่าอะไร */
  caption?: string
  /** 'alert' ใช้กับค่าที่เกินเกณฑ์ ทำให้ตัวเลขและ caption เป็นสีเตือน */
  tone?: 'normal' | 'alert'
}

export default function StatCard({ label, value, unit, caption, tone = 'normal' }: Props) {
  const isAlert = tone === 'alert'

  return (
    <div className={s.card}>
      <p className={s.label}>{label}</p>
      <p className={isAlert ? s.valueAlert : s.value}>
        {value}
        {unit && <span className={s.unit}>{unit}</span>}
      </p>
      {caption && <p className={isAlert ? s.captionAlert : s.caption}>{caption}</p>}
    </div>
  )
}
