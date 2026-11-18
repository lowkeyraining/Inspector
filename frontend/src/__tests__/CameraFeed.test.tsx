// เทส CameraFeed — URL ของ stream และ placeholder เมื่อโหลดไม่ขึ้น

import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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

  it('กดลองเชื่อมต่อใหม่แล้วเปิด stream เส้นใหม่ ไม่ใช้ URL เดิมซ้ำ', () => {
    render(<CameraFeed camera={testCamera} />)
    fireEvent.error(screen.getByRole('img'))

    fireEvent.click(screen.getByRole('button', { name: 'ลองเชื่อมต่อใหม่' }))

    // URL ต้องต่างจากรอบแรก ไม่งั้นเบราว์เซอร์อาจหยิบ connection ที่ตายแล้วมาใช้ซ้ำ
    expect(screen.getByRole('img')).toHaveAttribute('src', '/api/stream?retry=1')
  })

  it('ต่อใหม่ให้เองเมื่อเวลาผ่านไป ไม่ต้องรอคนกด', () => {
    // รีสตาร์ต backend ทีเดียวภาพจะค้างถาวรถ้าไม่มีตัวลองใหม่อัตโนมัติ
    vi.useFakeTimers()
    render(<CameraFeed camera={testCamera} />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.queryByRole('img')).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(screen.getByRole('img')).toHaveAttribute('src', '/api/stream?retry=1')
  })
})

afterEach(() => {
  vi.useRealTimers()
})
