// เทส DetectionTable — การแสดงแถวและการฟอร์แมตค่า

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import DetectionTable from '../components/DetectionTable'
import { testDetections } from './fixtures'

describe('DetectionTable', () => {
  it('บอกว่ายังไม่พบวัตถุเมื่อลิสต์ว่าง', () => {
    render(<DetectionTable detections={[]} />)

    expect(screen.getByText('ยังไม่พบวัตถุ')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('แสดงครบทุกแถวแม้คลาสซ้ำกัน', () => {
    render(<DetectionTable detections={testDetections} />)

    // 3 แถวข้อมูล + 1 แถวหัวตาราง
    expect(screen.getAllByRole('row')).toHaveLength(4)
    expect(screen.getAllByText('person')).toHaveLength(2)
  })

  it('ปัดความมั่นใจเป็นเปอร์เซ็นต์จำนวนเต็ม', () => {
    render(<DetectionTable detections={testDetections} />)

    expect(screen.getByText('91%')).toBeInTheDocument()
    expect(screen.getByText('66%')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('แสดง bbox คั่นด้วยจุลภาค', () => {
    render(<DetectionTable detections={testDetections} />)

    expect(screen.getByText('10, 20, 30, 40')).toBeInTheDocument()
  })
})
