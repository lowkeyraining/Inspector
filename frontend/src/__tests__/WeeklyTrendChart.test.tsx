// เทสกราฟรายสัปดาห์ — จำนวนแท่งและสีของแท่งที่เกินเกณฑ์

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import WeeklyTrendChart from '../components/WeeklyTrendChart'
import { token } from './fixtures'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  const { FixedSizeContainer } = await import('./rechartsSize')
  return { ...actual, ResponsiveContainer: FixedSizeContainer }
})

const points = [
  { label: 'W1', defectRate: 0.041 },
  { label: 'W2', defectRate: 0.055 },
  { label: 'W3', defectRate: 0.038 },
  { label: 'W4', defectRate: 0.068 },
]

describe('WeeklyTrendChart', () => {
  it('จำนวนแท่งตรงกับ points', () => {
    const { container } = render(<WeeklyTrendChart points={points} />)

    expect(container.querySelectorAll('.recharts-rectangle')).toHaveLength(4)
  })

  it('ระบายสีเตือนเฉพาะแท่งที่เกินเกณฑ์', () => {
    const { container } = render(<WeeklyTrendChart points={points} />)

    const fills = [...container.querySelectorAll('.recharts-rectangle')].map((bar) =>
      bar.getAttribute('fill'),
    )

    // W2 (5.5%) และ W4 (6.8%) เกินเกณฑ์ 5% ส่วน W1 W3 ไม่เกิน
    expect(fills).toEqual([
      token('--color-brand'),
      token('--color-alert'),
      token('--color-brand'),
      token('--color-alert'),
    ])
  })

  it('แสดง label ของทุกสัปดาห์บนแกน X', () => {
    render(<WeeklyTrendChart points={points} />)

    for (const p of points) {
      expect(screen.getAllByText(p.label).length).toBeGreaterThan(0)
    }
  })

  it('แสดงข้อความแทนกราฟเมื่อไม่มีข้อมูล', () => {
    render(<WeeklyTrendChart points={[]} />)

    expect(screen.getByText('ยังไม่มีข้อมูล')).toBeInTheDocument()
  })
})
