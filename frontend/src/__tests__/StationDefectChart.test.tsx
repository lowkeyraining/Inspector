// เทสการ์ดเปรียบเทียบรายสถานี — แถบ การเลือก และชุดข้อมูลว่าง

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import StationDefectChart from '../components/StationDefectChart'
import { testStations } from './fixtures'

describe('StationDefectChart', () => {
  it('แสดงครบทุกสถานี', () => {
    render(<StationDefectChart stations={testStations} />)

    expect(screen.getAllByRole('img')).toHaveLength(8)
    expect(screen.getByText('ประกอบ')).toBeInTheDocument()
  })

  it('ทำเครื่องหมายเฉพาะแถวที่เกินเกณฑ์', () => {
    render(<StationDefectChart stations={testStations} />)

    // st-05 = 6.4% เกินเกณฑ์ 5% อยู่ตัวเดียว
    expect(screen.getByText('6.4%')).toHaveClass('text-alert')
    expect(screen.getByText('2.1%')).not.toHaveClass('text-alert')
  })

  it('ใส่ aria-label ที่อ่านแล้วรู้ค่าให้ทุกแถบ', () => {
    render(<StationDefectChart stations={testStations} />)

    expect(screen.getByRole('img', { name: '03 เชื่อม 2.1%' })).toBeInTheDocument()
  })

  it('กดแถวแล้วส่ง id ที่ถูกต้องกลับไป', async () => {
    const onSelect = vi.fn()
    render(<StationDefectChart stations={testStations} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: /ประกอบ/ }))

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('st-05')
  })

  it('ไม่เป็นปุ่มเมื่อไม่ได้ส่ง onSelect มา', () => {
    render(<StationDefectChart stations={testStations} />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })

  it('normalize ความยาวแถบกับค่าสูงสุด ไม่ใช่ 100%', () => {
    render(<StationDefectChart stations={testStations} />)

    // 6.4% เป็นค่าสูงสุดจึงต้องเต็มราง
    expect(screen.getByRole('img', { name: /ประกอบ/ })).toHaveStyle({ width: '100%' })
  })

  it('แสดง EmptyState เมื่อไม่มีสถานี', () => {
    render(<StationDefectChart stations={[]} />)

    expect(screen.getByText('ยังไม่มีข้อมูลสถานี')).toBeInTheDocument()
  })
})
