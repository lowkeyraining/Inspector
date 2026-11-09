// endpoint ของกล้อง — /health และ URL ของ MJPEG stream

import { apiFetch, apiUrl } from './client'
import type { Health } from './types'

/** GET /health — สถานะกล้อง, FPS และวัตถุที่ตรวจเจอล่าสุด */
export function getHealth(): Promise<Health> {
  return apiFetch<Health>('/health')
}

/**
 * URL ของ MJPEG stream ใช้เป็น src ของ <img> ไม่ต้อง fetch เอง
 * รับ path มาจาก CameraConfig.streamPath เพื่อรองรับหลายกล้อง
 */
export function getStreamUrl(streamPath = '/stream'): string {
  return apiUrl(streamPath)
}
