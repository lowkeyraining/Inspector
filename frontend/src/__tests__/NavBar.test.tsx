// เทส NavBar — รายการเมนู สถานะที่เลือก และชื่อผู้ใช้

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import NavBar from '../components/NavBar'
import { NAV_ITEMS } from '../components/navItems'

describe('NavBar', () => {
  it('แสดงเมนูครบทุกอันตาม NAV_ITEMS', () => {
    render(<NavBar active="Dashboard" onSelect={() => {}} />)

    for (const item of NAV_ITEMS) {
      expect(screen.getByRole('button', { name: item })).toBeInTheDocument()
    }
  })

  it('ทำเครื่องหมายเฉพาะเมนูที่เลือกอยู่ด้วย aria-current', () => {
    render(<NavBar active="Monitor" onSelect={() => {}} />)

    expect(screen.getByRole('button', { name: 'Monitor' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })

  it('ส่งชื่อเมนูที่กดกลับไปทาง onSelect', async () => {
    const onSelect = vi.fn()
    render(<NavBar active="Dashboard" onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button', { name: 'Report' }))

    expect(onSelect).toHaveBeenCalledExactlyOnceWith('Report')
  })

  it('ย่อชื่อผู้ใช้เป็นตัวอักษรต้นสองตัว', () => {
    render(<NavBar active="Dashboard" onSelect={() => {}} user={{ name: 'Washi Cloud' }} />)

    expect(screen.getByText('WC')).toBeInTheDocument()
    expect(screen.getByText('Washi Cloud')).toBeInTheDocument()
  })

  it('บอกว่ายังไม่ได้เข้าสู่ระบบเมื่อไม่มี user', () => {
    render(<NavBar active="Dashboard" onSelect={() => {}} />)

    expect(screen.getByText('ยังไม่ได้เข้าสู่ระบบ')).toBeInTheDocument()
  })
})
