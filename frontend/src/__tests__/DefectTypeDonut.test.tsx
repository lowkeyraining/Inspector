// เทสโดนัทประเภทปัญหา — การเรียง การยุบรายการ และ legend

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DefectTypeDonut from '../components/DefectTypeDonut'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  const { FixedSizeContainer } = await import('./rechartsSize')
  return { ...actual, ResponsiveContainer: FixedSizeContainer }
})

const types = [
  { name: 'ประกอบไม่ได้ระยะ', share: 0.42 },
  { name: 'รอยขีดข่วน', share: 0.27 },
  { name: 'สีไม่สม่ำเสมอ', share: 0.19 },
  { name: 'ชิ้นส่วนขาด', share: 0.12 },
]

describe('DefectTypeDonut', () => {
  it('legend แสดงครบตามจำนวนประเภท', () => {
    render(<DefectTypeDonut types={types} />)

    for (const t of types) {
      expect(screen.getByText(t.name)).toBeInTheDocument()
    }
  })

  it('เปอร์เซ็นต์ใน legend รวมได้ 100', () => {
    render(<DefectTypeDonut types={types} />)

    const shown = ['42.0%', '27.0%', '19.0%', '12.0%']
    for (const value of shown) {
      expect(screen.getByText(value)).toBeInTheDocument()
    }
    const total = shown.reduce((sum, v) => sum + Number.parseFloat(v), 0)
    expect(total).toBeCloseTo(100, 5)
  })

  it('เรียงจากมากไปน้อยแม้ input ไม่ได้เรียงมา', () => {
    render(<DefectTypeDonut types={[...types].reverse()} />)

    const names = screen.getAllByText(/ระยะ|ขีดข่วน|สม่ำเสมอ|ขาด/).map((el) => el.textContent)
    expect(names[0]).toBe('ประกอบไม่ได้ระยะ')
  })

  it('ยุบส่วนเกินเป็น "อื่น ๆ" เมื่อมีเกิน 4 ประเภท', () => {
    render(
      <DefectTypeDonut
        types={[...types, { name: 'อื่นที่หายาก', share: 0.05 }]}
      />,
    )

    expect(screen.getByText('อื่น ๆ')).toBeInTheDocument()
    // เหลือที่ให้สีแค่ 4 ช่อง จึงยุบ 2 รายการท้าย: 12% + 5%
    expect(screen.getByText('17.0%')).toBeInTheDocument()
  })

  it('แสดงข้อความแทนกราฟเมื่อไม่มีข้อมูล', () => {
    render(<DefectTypeDonut types={[]} />)

    expect(screen.getByText('ยังไม่มีข้อมูล')).toBeInTheDocument()
  })
})
