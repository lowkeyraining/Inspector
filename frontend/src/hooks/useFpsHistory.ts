// hook สะสมค่า FPS ย้อนหลังไว้ป้อนกราฟเส้น

import { useEffect, useRef, useState } from 'react'

export type FpsPoint = { t: number; fps: number }

/**
 * เก็บค่า FPS ย้อนหลังไว้ทำกราฟ เก็บล่าสุดไม่เกิน maxPoints จุด
 * ใช้ updatedAt (dataUpdatedAt จาก TanStack Query) เป็นตัวจับรอบ
 * ไม่งั้นรอบที่ FPS เท่าเดิมจะไม่ถูกบันทึก
 */
export function useFpsHistory(
  fps: number | undefined,
  updatedAt: number,
  maxPoints = 60,
): FpsPoint[] {
  const [history, setHistory] = useState<FpsPoint[]>([])
  const tick = useRef(0)

  useEffect(() => {
    if (fps === undefined || updatedAt === 0) return
    setHistory((prev) => [...prev, { t: tick.current++, fps }].slice(-maxPoints))
    // fps อ่านจาก closure รอบเดียวกับ updatedAt — ไม่ต้องใส่ใน deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedAt, maxPoints])

  return history
}
