// เทสรายการเหตุการณ์แยกชิ้นงาน — เนื้อหาแต่ละแถวและกรณีไม่มีเหตุการณ์

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { DefectEvent } from '../api/dashboard'
import DefectEventList from '../components/DefectEventList'

const events: DefectEvent[] = [
  {
    id: 'ev-4821',
    time: '09:12',
    pieceNo: '4821',
    defectName: 'รอยเชื่อมมีรูพรุน',
    confidence: 0.79,
  },
  { id: 'ev-5203', time: '11:20', pieceNo: '5203', defectName: 'รอยแตก', confidence: 0.81 },
]

describe('DefectEventList', () => {
  it('ขึ้นครบทุกเหตุการณ์', () => {
    render(<DefectEventList events={events} />)

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })

  it('แต่ละแถวบอกเวลา หมายเลขชิ้นงาน และปัญหาที่พบ', () => {
    render(<DefectEventList events={events} />)

    expect(screen.getByText('09:12 · #4821 · รอยเชื่อมมีรูพรุน')).toBeInTheDocument()
    expect(screen.getByText('11:20 · #5203 · รอยแตก')).toBeInTheDocument()
  })

  it('แสดงความมั่นใจของโมเดลเป็นเปอร์เซ็นต์', () => {
    render(<DefectEventList events={events} />)

    expect(screen.getByText('79.0%')).toBeInTheDocument()
    expect(screen.getByText('81.0%')).toBeInTheDocument()
  })

  it('ทุกแถวติดป้าย NG', () => {
    render(<DefectEventList events={events} />)

    expect(screen.getAllByText('NG')).toHaveLength(2)
  })

  it('บอกว่ายังไม่พบปัญหาเมื่อไม่มีเหตุการณ์ ไม่ใช่กล่องว่าง', () => {
    render(<DefectEventList events={[]} />)

    expect(screen.getByText('วันนี้ยังไม่พบชิ้นงานที่มีปัญหา')).toBeInTheDocument()
  })
})
