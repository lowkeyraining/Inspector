import { apiFetch, apiUrl } from './client'
import type { Health } from './types'

/** GET /health — สถานะกล้อง, FPS และวัตถุที่ตรวจเจอล่าสุด */
export function getHealth(): Promise<Health> {
  return apiFetch<Health>('/health')
}

/** GET /stream — MJPEG stream ใช้เป็น src ของ <img> ไม่ต้อง fetch เอง */
export function getStreamUrl(): string {
  return apiUrl('/stream')
}
