// เทสหน้า Dashboard — การ์ดครบและการไฮไลต์สถานีที่เชื่อมกันสองการ์ด

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DashboardSummary } from '../api/dashboard'
import { EMPTY_DASHBOARD } from '../lib/emptyDashboard'
import Dashboard from '../pages/Dashboard'
import { testSummary } from './fixtures'

vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('recharts')>()
  const { FixedSizeContainer } = await import('./rechartsSize')
  return { ...actual, ResponsiveContainer: FixedSizeContainer }
})

// คุมข้อมูลที่หน้าได้รับ เพื่อเทสทั้งตอนยังไม่เชื่อมและตอนมีข้อมูลจริง
let summary: DashboardSummary = EMPTY_DASHBOARD
vi.mock('../hooks/useDashboard', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../hooks/useDashboard')>()
  return {
    ...actual,
    useDashboard: () => ({ data: summary, isLoading: false, error: null }),
  }
})

function renderDashboard() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <Dashboard />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  summary = EMPTY_DASHBOARD
})

describe('Dashboard ตอนยังไม่ได้เชื่อมข้อมูล', () => {
  it('ยังขึ้นหัวข้อการ์ดครบทุกใบ', () => {
    renderDashboard()

    expect(
      screen.getByText('เปรียบเทียบอัตราการตรวจพบชิ้นบกพร่องตาม Station'),
    ).toBeInTheDocument()
    expect(screen.getByText('ประเภทปัญหาที่พบบ่อย')).toBeInTheDocument()
    expect(screen.getByText('สัดส่วนของเสียรวม')).toBeInTheDocument()
    expect(screen.getByText('แนวโน้มรายสัปดาห์')).toBeInTheDocument()
    expect(screen.getByText('STATION ทั้งหมด')).toBeInTheDocument()
  })

  it('การ์ด KPI เป็นการ์ดเปล่ารอเชื่อมข้อมูล', () => {
    renderDashboard()

    expect(screen.getAllByText('รอเชื่อมข้อมูล')).toHaveLength(4)
  })

  it('การ์ดกราฟบอกว่ายังไม่มีข้อมูล ไม่ใช่หน้าว่าง', () => {
    renderDashboard()

    expect(screen.getByText('ยังไม่มีข้อมูลสถานี')).toBeInTheDocument()
    expect(screen.getAllByText('ยังไม่มีข้อมูล').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('ยังไม่มีสถานีในระบบ')).toBeInTheDocument()
  })

  it('ตัวเลือกวันที่ยังใช้งานได้', () => {
    renderDashboard()

    expect(screen.getByRole('button', { name: 'วันก่อนหน้า' })).toBeInTheDocument()
  })
})

describe('Dashboard เมื่อมีข้อมูลแล้ว', () => {
  beforeEach(() => {
    summary = testSummary
  })

  it('กดสถานีใน rail แล้วแถวเดียวกันในกราฟซ้ายถูกไฮไลต์ด้วย', async () => {
    renderDashboard()

    await userEvent.click(screen.getByRole('button', { name: '03 เชื่อม 2.1%' }))

    // ทั้งสองการ์ดอ้างสถานีเดียวกัน จึงต้องมีปุ่มที่ aria-current สองอัน
    const highlighted = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-current') === 'true')

    expect(highlighted).toHaveLength(2)
    for (const el of highlighted) {
      expect(el.textContent).toContain('เชื่อม')
    }
  })

  it('กดภาพรวมทั้งหมดแล้วไม่มีสถานีไหนถูกไฮไลต์', async () => {
    renderDashboard()

    await userEvent.click(screen.getByRole('button', { name: '03 เชื่อม 2.1%' }))
    await userEvent.click(screen.getByRole('button', { name: /ภาพรวมทั้งหมด/ }))

    const highlighted = screen
      .getAllByRole('button')
      .filter((b) => b.getAttribute('aria-current') === 'true')

    expect(highlighted).toHaveLength(1)
    expect(highlighted[0].textContent).toContain('ภาพรวมทั้งหมด')
  })
})
