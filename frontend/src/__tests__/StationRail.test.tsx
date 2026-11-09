// เทสแถบรายการสถานี — การเลือก สถานะ และลำดับความสำคัญของสีเตือน

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import StationRail from '../components/StationRail'
import { testStations } from './fixtures'

function setup(selectedId: string | null = null, onSelect = vi.fn()) {
  render(
    <StationRail
      stations={testStations}
      avgDefectRate={0.068}
      selectedId={selectedId}
      onSelect={onSelect}
    />,
  )
  return onSelect
}

describe('StationRail', () => {
  it('มีแถว "ภาพรวมทั้งหมด" เสมอ พร้อมค่าเฉลี่ย', () => {
    setup()

    expect(screen.getByRole('button', { name: /ภาพรวมทั้งหมด/ })).toBeInTheDocument()
    expect(screen.getByText('6.8%')).toBeInTheDocument()
  })

  it('กดแถวสถานีแล้วได้ id กลับไป', async () => {
    const onSelect = setup()

    await userEvent.click(screen.getByRole('button', { name: /ติดฉลาก/ }))

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('st-07')
  })

  it('กดภาพรวมทั้งหมดแล้วได้ null', async () => {
    const onSelect = setup('st-03')

    await userEvent.click(screen.getByRole('button', { name: /ภาพรวมทั้งหมด/ }))

    expect(onSelect).toHaveBeenCalledExactlyOnceWith(null)
  })

  it('แถวที่เลือกมี aria-current', () => {
    setup('st-03')

    expect(screen.getByRole('button', { name: /เชื่อม/ })).toHaveAttribute('aria-current', 'true')
    expect(screen.getByRole('button', { name: /บรรจุ/ })).not.toHaveAttribute('aria-current')
  })

  it('แถวที่เกินเกณฑ์ใช้พื้น alert-soft แม้ตอนถูกเลือก', () => {
    setup('st-05')

    const row = screen.getByRole('button', { name: /ประกอบ/ })
    expect(row).toHaveClass('bg-alert-soft')
    expect(row).not.toHaveClass('bg-brand-soft')
  })

  it('ไม่พังเมื่อไม่มีสถานีเลย', () => {
    render(
      <StationRail stations={[]} avgDefectRate={0} selectedId={null} onSelect={() => {}} />,
    )

    expect(screen.getByRole('button', { name: /ภาพรวมทั้งหมด/ })).toBeInTheDocument()
    expect(screen.getByText('ยังไม่มีสถานีในระบบ')).toBeInTheDocument()
  })
})
