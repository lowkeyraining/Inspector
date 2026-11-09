// เทส CameraFeed — URL ของ stream และ placeholder เมื่อโหลดไม่ขึ้น

import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CameraFeed from '../components/CameraFeed'
import { testCamera } from './fixtures'

describe('CameraFeed', () => {
  it('ชี้ src ไปที่ streamPath ของกล้องผ่าน proxy', () => {
    render(<CameraFeed camera={testCamera} />)

    expect(screen.getByRole('img')).toHaveAttribute('src', '/api/stream')
  })

  it('ขึ้น placeholder แทน broken image เมื่อโหลด stream ไม่สำเร็จ', () => {
    render(<CameraFeed camera={testCamera} />)

    fireEvent.error(screen.getByRole('img'))

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('ไม่มีสัญญาณภาพ')).toBeInTheDocument()
    expect(screen.getByText('ต่อ backend ไม่ได้')).toBeInTheDocument()
  })

  it('กลับมาลองใหม่เมื่อเปลี่ยนไปกล้องตัวอื่น', () => {
    const { rerender } = render(<CameraFeed camera={testCamera} />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByText('ไม่มีสัญญาณภาพ')).toBeInTheDocument()

    rerender(<CameraFeed camera={{ ...testCamera, id: 'cam-other' }} />)

    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
