// ตัวแทน ResponsiveContainer ที่ยัดขนาดคงที่ เพราะ jsdom วัดขนาดไม่ได้

import { cloneElement, type ReactElement } from 'react'

type Sizable = { width?: number; height?: number }

/**
 * ResponsiveContainer วัดขนาดจาก layout จริง แต่ jsdom ให้ทุกอย่างสูง 0
 * กราฟจึงไม่ถูก render เลย เทสสี/จำนวนแท่งจะมองไม่เห็นอะไร
 * ตัวนี้แทนที่ด้วยการยัดขนาดคงที่ให้ลูกโดยตรง
 */
export function FixedSizeContainer({ children }: { children: ReactElement<Sizable> }) {
  return cloneElement(children, { width: 400, height: 240 })
}
