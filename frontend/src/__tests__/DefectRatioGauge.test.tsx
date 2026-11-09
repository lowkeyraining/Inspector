// เทสเกจสัดส่วนของเสีย — ค่าที่แสดง สีเตือน และค่าผิดปกติ

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DefectRatioGauge from '../components/DefectRatioGauge'
import { token } from './fixtures'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  const { FixedSizeContainer } = await import('./rechartsSize')
  return { ...actual, ResponsiveContainer: FixedSizeContainer }
})

function sliceFills(container: HTMLElement): (string | null)[] {
  return [...container.querySelectorAll('.recharts-sector')].map((s) => s.getAttribute('fill'))
}

describe('DefectRatioGauge', () => {
  it('แสดง % กลางวงและยอดรวมใต้ลงไป', () => {
    render(<DefectRatioGauge defectRate={0.068} total={6940} />)

    expect(screen.getAllByText('6.8%').length).toBeGreaterThan(0)
    expect(screen.getByText('6,940')).toBeInTheDocument()
  })

  it('ใช้สีเตือนเมื่อเกินเกณฑ์', () => {
    const { container } = render(<DefectRatioGauge defectRate={0.068} total={6940} />)

    expect(sliceFills(container)[0]).toBe(token('--color-alert'))
  })

  it('ใช้สี brand เมื่ออยู่ในเกณฑ์', () => {
    const { container } = render(<DefectRatioGauge defectRate={0.02} total={100} />)

    expect(sliceFills(container)[0]).toBe(token('--color-brand'))
  })

  it('ไม่พังเมื่อ defectRate เป็น NaN', () => {
    render(<DefectRatioGauge defectRate={Number.NaN} total={100} />)

    expect(screen.getAllByText('0.0%').length).toBeGreaterThan(0)
  })

  it('ขึ้นข้อความรอข้อมูลเมื่อยังไม่ได้เชื่อม', () => {
    render(<DefectRatioGauge defectRate={null} total={null} />)

    expect(screen.getByText('ยังไม่มีข้อมูล')).toBeInTheDocument()
  })

  it('clamp ค่าที่เกิน 1 ไม่ให้วงเพี้ยน', () => {
    render(<DefectRatioGauge defectRate={3.5} total={100} />)

    expect(screen.getAllByText('100.0%').length).toBeGreaterThan(0)
  })
})
