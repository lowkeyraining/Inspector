// เทสหน้า Monitor — ทั้งกรณีมีกล้องและไม่มีกล้อง

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CameraConfig } from '../lib/cameras'
import Monitor from '../pages/Monitor'
import { testCamera } from './fixtures'

// CAMERAS เป็นค่าคงที่ของ module จึง mock เพื่อคุมทั้งสองกรณีได้
const cameras: CameraConfig[] = []
vi.mock('../lib/cameras', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/cameras')>()
  return { ...actual, get CAMERAS() { return cameras } }
})

beforeEach(() => {
  cameras.length = 0
})

describe('Monitor เมื่อไม่มีกล้อง', () => {
  it('แสดง empty state แทนกริด', () => {
    render(<Monitor onOpenCamera={() => {}} onNavigate={() => {}} />)

    expect(screen.getByText('ยังไม่มีกล้องในระบบ')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /ขยาย/ })).not.toBeInTheDocument()
  })

  it('ไม่ชวนให้กดกล้องในคำอธิบายหัวหน้า', () => {
    render(<Monitor onOpenCamera={() => {}} onNavigate={() => {}} />)

    expect(screen.getByText('ภาพสดจากกล้องทุกตัวในระบบ')).toBeInTheDocument()
  })

  it('ปุ่มในกล่องพาไปหน้า Device', async () => {
    const onNavigate = vi.fn()
    render(<Monitor onOpenCamera={() => {}} onNavigate={onNavigate} />)

    await userEvent.click(screen.getByRole('button', { name: 'ไปหน้า Device' }))

    expect(onNavigate).toHaveBeenCalledExactlyOnceWith('Device')
  })
})

describe('Monitor เมื่อมีกล้อง', () => {
  beforeEach(() => {
    cameras.push(testCamera)
  })

  it('แสดงไทล์กล้องแทน empty state', () => {
    render(<Monitor onOpenCamera={() => {}} onNavigate={() => {}} />)

    expect(screen.getByRole('button', { name: 'ขยาย กล้องทดสอบ' })).toBeInTheDocument()
    expect(screen.queryByText('ยังไม่มีกล้องในระบบ')).not.toBeInTheDocument()
  })

  it('บอกจำนวนกล้องในคำอธิบายหัวหน้า', () => {
    render(<Monitor onOpenCamera={() => {}} onNavigate={() => {}} />)

    expect(screen.getByText(/ทั้งหมด 1 ตัว/)).toBeInTheDocument()
  })

  it('ส่ง id ของกล้องที่กดกลับไปทาง onOpenCamera', async () => {
    const onOpenCamera = vi.fn()
    render(<Monitor onOpenCamera={onOpenCamera} onNavigate={() => {}} />)

    await userEvent.click(screen.getByRole('button', { name: 'ขยาย กล้องทดสอบ' }))

    expect(onOpenCamera).toHaveBeenCalledExactlyOnceWith('cam-test')
  })
})
