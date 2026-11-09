// เทสแถว KPI — ค่าที่แสดงและการขึ้นโทนเตือน

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import KpiRow from '../components/KpiRow'
import { testSummary } from './fixtures'

describe('KpiRow', () => {
  it('แสดงการ์ดครบ 4 ใบ', () => {
    render(<KpiRow summary={testSummary} />)

    for (const label of [
      'สถานีทั้งหมด',
      'อัตราของเสียเฉลี่ย',
      'จุดที่ต้องดูแลด่วน',
      'ยอดผลิตวันนี้',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('แสดงค่าตรงกับข้อมูลที่ส่งเข้าไป', () => {
    render(<KpiRow summary={testSummary} />)

    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('6.8%')).toBeInTheDocument()
    expect(screen.getByText('6,940/7,000')).toBeInTheDocument()
  })

  it('หาสถานีแย่ที่สุดจาก worstStationId ไม่ใช่ค่าตายตัว', () => {
    render(
      <KpiRow summary={{ ...testSummary, worstStationId: 'st-03' }} />,
    )

    expect(screen.getByText('เชื่อม')).toBeInTheDocument()
    expect(screen.queryByText('ประกอบ')).not.toBeInTheDocument()
  })

  it('ใส่ tone alert เฉพาะการ์ดที่เกินเกณฑ์', () => {
    render(<KpiRow summary={testSummary} />)

    // 6.8% เกินเกณฑ์ 5% จึงต้องเตือน
    expect(screen.getByText('เกินค่า KPI ที่ตั้งไว้')).toBeInTheDocument()
    // สถานีทั้งหมด 8 ไม่ใช่ค่าที่มีเกณฑ์ จึงไม่เตือน
    expect(screen.getByText('8')).not.toHaveClass('text-alert')
  })

  it('ไม่เตือนเมื่ออัตราเฉลี่ยอยู่ในเกณฑ์', () => {
    render(<KpiRow summary={{ ...testSummary, avgDefectRate: 0.02 }} />)

    expect(screen.getByText('อยู่ในเกณฑ์ที่ตั้งไว้')).toBeInTheDocument()
    expect(screen.queryByText('เกินค่า KPI ที่ตั้งไว้')).not.toBeInTheDocument()
  })

  it('ขึ้นการ์ดเปล่าทั้ง 4 ใบเมื่อยังไม่ได้เชื่อมข้อมูล', () => {
    render(<KpiRow summary={null} />)

    expect(screen.getAllByText('-')).toHaveLength(4)
    expect(screen.getAllByText('รอเชื่อมข้อมูล')).toHaveLength(4)
  })

  it('ถือว่ายังไม่มีข้อมูลเมื่อไม่มีสถานีเลย', () => {
    render(<KpiRow summary={{ ...testSummary, stations: [] }} />)

    expect(screen.getAllByText('รอเชื่อมข้อมูล')).toHaveLength(4)
  })
})
