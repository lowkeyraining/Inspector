// hook ดึงข้อมูลหน้า Dashboard — ยังไม่ได้เชื่อม backend จึงคืนค่าเปล่า

import { useQuery } from '@tanstack/react-query'
import type { DashboardSummary } from '../api/dashboard'
import { EMPTY_DASHBOARD } from '../lib/emptyDashboard'

/**
 * ยังไม่มี endpoint ของ Dashboard บน backend
 * ตอนนี้คืนค่าเปล่าเพื่อให้การ์ดขึ้นโครงรอข้อมูลจริง
 * เมื่อ backend พร้อม ให้เปลี่ยนแค่ queryFn ที่นี่ที่เดียว หน้าและการ์ดไม่ต้องแก้
 *   queryFn: () => apiFetch<DashboardSummary>('/dashboard')
 */
export function useDashboard() {
  return useQuery<DashboardSummary>({
    queryKey: ['dashboard'],
    queryFn: async () => EMPTY_DASHBOARD,
  })
}

/** การ์ดใช้เช็คว่าควรขึ้นสถานะรอข้อมูลหรือยัง */
export function hasDashboardData(summary: DashboardSummary | undefined): boolean {
  return Boolean(summary && summary.stations.length > 0)
}
