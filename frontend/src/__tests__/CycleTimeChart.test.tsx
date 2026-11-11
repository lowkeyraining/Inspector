// เทสกราฟ cycle time รายรอบ — จำนวนแท่ง สีของรอบที่หลุดช่วง และสรุปใต้กราฟ

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import CycleTimeChart from '../components/CycleTimeChart'
import { token } from './fixtures'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  const { FixedSizeContainer } = await import('./rechartsSize')
  return { ...actual, ResponsiveContainer: FixedSizeContainer }
})

const STANDARD = 4.6
const TOLERANCE = 0.6

const cycles = [
  { round: 1, seconds: 4.2 },
  { round: 2, seconds: 4.4 },
  { round: 3, seconds: 4.5 },
  { round: 4, seconds: 5.6 },
  { round: 5, seconds: 4.3 },
  { round: 6, seconds: 5.2 },
]

function renderChart(points = cycles) {
  return render(<CycleTimeChart cycles={points} standard={STANDARD} tolerance={TOLERANCE} />)
}

/** recharts วาดทั้งแท่งและเส้นอ้างอิง ต้องหยิบเฉพาะ rect ของแท่งข้อมูล */
function barFills(container: HTMLElement): (string | null)[] {
  return [...container.querySelectorAll('.recharts-bar-rectangle .recharts-rectangle')].map((bar) =>
    bar.getAttribute('fill'),
  )
}

describe('CycleTimeChart', () => {
  it('จำนวนแท่งตรงกับจำนวนรอบ', () => {
    const { container } = renderChart()

    expect(barFills(container)).toHaveLength(6)
  })

  it('ระบายสีเตือนเฉพาะรอบที่หลุดช่วงเวลามาตรฐาน', () => {
    const { container } = renderChart()

    // มาตรฐาน 4.6 ± 0.6 → ช่วงคือ 4.0–5.2 ; #4 (5.6) เกิน และ #6 (5.2) ชนขอบพอดี
    expect(barFills(container)).toEqual([
      token('--color-brand'),
      token('--color-brand'),
      token('--color-brand'),
      token('--color-alert'),
      token('--color-brand'),
      token('--color-alert'),
    ])
  })

  it('label ของแกน X บอกทั้งลำดับรอบและเวลา', () => {
    renderChart()

    expect(screen.getAllByText('#4 (5.6s)').length).toBeGreaterThan(0)
  })

  it('สรุปใต้กราฟนับจำนวนรอบที่หลุดช่วง', () => {
    renderChart()

    expect(screen.getByText('2 รอบหลุดช่วงเวลามาตรฐาน')).toBeInTheDocument()
  })

  it('บอกว่าทุกรอบปกติเมื่อไม่มีรอบไหนหลุดช่วง', () => {
    renderChart([
      { round: 1, seconds: 4.5 },
      { round: 2, seconds: 4.7 },
    ])

    expect(screen.getByText('ทุกรอบอยู่ในช่วงเวลามาตรฐาน')).toBeInTheDocument()
  })

  it('แสดงข้อความแทนกราฟเมื่อไม่มีข้อมูล', () => {
    renderChart([])

    expect(screen.getByText('ยังไม่มีข้อมูล')).toBeInTheDocument()
  })
})
