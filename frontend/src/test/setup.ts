// ตั้งค่าที่รันก่อนทุกไฟล์เทส — matcher, ล้าง DOM และฉีด token สีให้ jsdom

import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach } from 'vitest'

/**
 * jsdom ไม่ได้ประมวลผล Tailwind ทำให้ตัวแปรสีใน @theme ไม่มีอยู่จริง
 * chartColors อ่านค่าผ่าน getComputedStyle จึงจะได้ค่าว่างและเทสสีจะผ่านแบบหลอก ๆ
 * เลยอ่าน @theme จาก index.css ตัวจริงมาใส่ให้ root — ไม่ต้องก๊อป hex มาไว้ในเทส
 */
// vitest รันโดยมี cwd อยู่ที่ราก frontend เสมอ จึงอ้างจากตรงนั้นแทน import.meta.url
// ที่ถูก transform จนไม่ใช่ file: URL
const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')
const theme = /@theme\s*\{([\s\S]*?)\}/.exec(css)?.[1] ?? ''
for (const line of theme.split('\n')) {
  const token = /(--[\w-]+)\s*:\s*([^;]+);/.exec(line)
  if (token) document.documentElement.style.setProperty(token[1], token[2].trim())
}

// ถอด component ออกจาก DOM หลังจบแต่ละเทส กัน state รั่วข้ามเทส
afterEach(cleanup)
