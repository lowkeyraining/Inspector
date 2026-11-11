// ตัวกลางเรียก backend — ประกอบ base URL และโยน error เมื่อสถานะไม่ใช่ 2xx

/** base URL: ใช้ VITE_API_URL ถ้ากำหนดไว้ ไม่งั้นยิงผ่าน proxy ของ vite ที่ /api */
const BASE_URL = (import.meta.env.VITE_API_URL ?? '/api').replace(/\/$/, '')

/** ต่อ path เข้ากับ base URL — ใช้กับ <img src> หรือที่ที่ต้องการ URL ตรง ๆ */
export function apiUrl(path: string): string {
  return `${BASE_URL}${path}`
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init)
  if (!res.ok) {
    throw new Error(`${path} ตอบกลับ ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<T>
}
