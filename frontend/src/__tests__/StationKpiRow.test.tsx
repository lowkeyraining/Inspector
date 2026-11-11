// เทส KPI ราย Station — ตัวเลขทั้งสี่ใบ โทนเตือน และการเทียบ cycle time กับมาตรฐาน

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { StationDetail } from '../api/dashboard'
import StationKpiRow from '../components/StationKpiRow'
import { MOCK_DASHBOARD } from '../lib/mockDashboard'

/** st-03 ของ mock ตรงกับ mockup หน้า Dashboard ราย Station */
const welding = MOCK_DASHBOARD.stationDetails.find((st) => st.id === 'st-03') as StationDetail

function withStation(patch: Partial<StationDetail>) {
  return { ...welding, ...patch }
}

describe('StationKpiRow', () => {
  it('ขึ้นหัวข้อครบทั้งสี่ใบ', () => {
    render(<StationKpiRow station={welding} />)

    expect(screen.getByText('ตรวจพบทั้งหมดวันนี้')).toBeInTheDocument()
    expect(screen.getByText('อัตราตรวจพบสิ่งผิดปกติ')).toBeInTheDocument()
    expect(screen.getByText('Cycle time เฉลี่ยวันนี้')).toBeInTheDocument()
    expect(screen.getByText('เวลามาตรฐาน (วิ)')).toBeInTheDocument()
  })

  it('จำนวนชิ้นงานใส่ลูกน้ำคั่นหลักพัน', () => {
    render(<StationKpiRow station={welding} />)

    expect(screen.getByText('1,204')).toBeInTheDocument()
  })

  it('เวลามาตรฐานขึ้นเป็นช่วง ± ตามที่ตั้งไว้', () => {
    render(<StationKpiRow station={welding} />)

    expect(screen.getByText('4.6±0.6')).toBeInTheDocument()
  })

  it('บอกว่าเร็วกว่ามาตรฐานเมื่อ cycle time เฉลี่ยต่ำกว่าเวลามาตรฐาน', () => {
    render(<StationKpiRow station={withStation({ avgCycleTime: 4.2 })} />)

    expect(screen.getByText('เร็วกว่าเวลามาตรฐาน')).toBeInTheDocument()
  })

  it('บอกว่าช้ากว่ามาตรฐานเมื่อ cycle time เฉลี่ยสูงกว่าเวลามาตรฐาน', () => {
    render(<StationKpiRow station={withStation({ avgCycleTime: 5.1 })} />)

    expect(screen.getByText('ช้ากว่าเวลามาตรฐาน')).toBeInTheDocument()
  })

  it('อัตราที่ไม่เกินเกณฑ์ไม่ใช้โทนเตือน', () => {
    const { container } = render(<StationKpiRow station={withStation({ defectRate: 0.021 })} />)

    expect(container.querySelector('.text-alert')).toBeNull()
  })

  it('อัตราที่เกินเกณฑ์ใช้โทนเตือน', () => {
    const { container } = render(<StationKpiRow station={withStation({ defectRate: 0.064 })} />)

    expect(container.querySelector('.text-alert')).not.toBeNull()
    expect(screen.getByText('6.4%')).toBeInTheDocument()
  })
})
