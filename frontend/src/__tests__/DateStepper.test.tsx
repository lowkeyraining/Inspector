// เทส DateStepper — การเลื่อนวันและการปิดปุ่มที่ขอบเขต

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DateStepper from '../components/DateStepper'

const day = (iso: string) => new Date(`${iso}T12:00:00`)

describe('DateStepper', () => {
  it('กดย้อนกลับแล้วได้วันก่อนหน้า 1 วัน', async () => {
    const onChange = vi.fn()
    render(<DateStepper value={day('2026-03-10')} onChange={onChange} maxDate={day('2026-03-20')} />)

    await userEvent.click(screen.getByRole('button', { name: 'วันก่อนหน้า' }))

    const next = onChange.mock.calls[0][0] as Date
    expect(next.getDate()).toBe(9)
    expect(next.getMonth()).toBe(2)
  })

  it('กดถัดไปแล้วได้วันถัดไป 1 วัน', async () => {
    const onChange = vi.fn()
    render(<DateStepper value={day('2026-03-10')} onChange={onChange} maxDate={day('2026-03-20')} />)

    await userEvent.click(screen.getByRole('button', { name: 'วันถัดไป' }))

    expect((onChange.mock.calls[0][0] as Date).getDate()).toBe(11)
  })

  it('ปิดปุ่มถัดไปเมื่ออยู่ที่ maxDate แล้ว', () => {
    render(<DateStepper value={day('2026-03-20')} onChange={() => {}} maxDate={day('2026-03-20')} />)

    expect(screen.getByRole('button', { name: 'วันถัดไป' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'วันก่อนหน้า' })).toBeEnabled()
  })

  it('แสดงวันที่เป็น พ.ศ. โดยไม่บวก 543 เอง', () => {
    render(<DateStepper value={day('2026-03-10')} onChange={() => {}} maxDate={day('2026-03-20')} />)

    // ค.ศ. 2026 = พ.ศ. 2569
    expect(screen.getByText(/2569/)).toBeInTheDocument()
  })
})
