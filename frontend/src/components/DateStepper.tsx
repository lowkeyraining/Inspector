// ตัวเลือกวันที่ของหน้า Dashboard — เลื่อนทีละวัน ไม่ให้เลือกอนาคต

import { useState } from 'react'

import { dateStepper as s } from '../lib/styles'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from './icons'

type Props = {
  value: Date
  onChange: (next: Date) => void
  /** กันเลือกวันในอนาคตที่ยังไม่มีข้อมูล ค่าเริ่มต้นคือวันนี้ */
  maxDate?: Date
}

const thaiDate = new Intl.DateTimeFormat('th-TH', { dateStyle: 'long' })

function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function sameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString()
}

export default function DateStepper({ value, onChange, maxDate }: Props) {
  // เก็บ "วันนี้" ไว้ครั้งเดียวตอน mount แทนการเรียก new Date() ทุกรอบ render
  // ไม่งั้นค่าจะเปลี่ยนเองระหว่าง render และผลลัพธ์ไม่เสถียร
  const [today] = useState(() => new Date())
  const limit = maxDate ?? today
  const atLimit = sameDay(value, limit) || value >= limit

  return (
    <div className={s.wrap}>
      <button
        type="button"
        aria-label="วันก่อนหน้า"
        className={s.arrow}
        onClick={() => onChange(addDays(value, -1))}
      >
        <span className={s.arrowIcon}>
          <ChevronLeftIcon />
        </span>
      </button>

      <div className={s.chip}>
        <span className={s.chipIcon}>
          <CalendarIcon />
        </span>
        {/* Intl ให้ พ.ศ. มาเองสำหรับ th-TH จึงห้ามบวก 543 ซ้ำ */}
        <span className={s.chipText}>{thaiDate.format(value)}</span>
      </div>

      <button
        type="button"
        aria-label="วันถัดไป"
        className={s.arrow}
        disabled={atLimit}
        onClick={() => onChange(addDays(value, 1))}
      >
        <span className={s.arrowIcon}>
          <ChevronRightIcon />
        </span>
      </button>
    </div>
  )
}
