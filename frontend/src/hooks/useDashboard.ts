// hook ดึงข้อมูลหน้า Dashboard จาก backend (GET /dashboard?date=YYYY-MM-DD)

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiFetch } from '../api/client'
import type { DashboardSummary } from '../api/dashboard'

/** โพลซ้ำทุก 30 วิ ให้ตัวเลขของวันนี้ขยับตามกล้องโดยไม่ต้องรีเฟรชหน้า */
const REFRESH_MS = 30_000

/**
 * แปลง Date เป็น "YYYY-MM-DD" ตามเวลาเครื่อง
 * ห้ามใช้ toISOString() เพราะแปลงเป็น UTC ก่อน ช่วง 00:00–06:59 เวลาไทยจะได้วันก่อนหน้า
 */
export function toApiDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function useDashboard(date: Date) {
  const day = toApiDate(date)
  return useQuery<DashboardSummary>({
    queryKey: ['dashboard', day],
    queryFn: () => apiFetch<DashboardSummary>(`/dashboard?date=${day}`),
    refetchInterval: REFRESH_MS,
    // เปลี่ยนวันแล้วโชว์ข้อมูลวันเดิมค้างไว้จนวันใหม่มาถึง ไม่ให้การ์ดกระพริบเป็นโครงเปล่า
    placeholderData: keepPreviousData,
  })
}

/** การ์ดใช้เช็คว่าควรขึ้นสถานะรอข้อมูลหรือยัง */
export function hasDashboardData(summary: DashboardSummary | undefined): boolean {
  return Boolean(summary && summary.stations.length > 0)
}
