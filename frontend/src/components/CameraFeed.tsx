// ภาพสดของกล้องหนึ่งตัว พร้อม placeholder และการต่อใหม่เมื่อ stream หลุด

import { useEffect, useState } from 'react'
import { getStreamUrl } from '../api/inspector'
import type { CameraConfig } from '../lib/cameras'
import { cameraFeed as s } from '../lib/styles'

type Props = {
  camera: CameraConfig
  /** ความสูง/สัดส่วนของกรอบภาพ ต่างกันระหว่างกล้องย่อยกับหน้าขยาย */
  className?: string
}

/** เว้นระยะก่อนลองต่อใหม่ — ถี่กว่านี้จะรัว backend ตอนที่มันยังไม่กลับมา */
const RETRY_MS = 5000

/**
 * ภาพสดจากกล้องหนึ่งตัว
 * ถ้าต่อ stream ไม่ได้จะขึ้น placeholder แทน broken-image icon ของเบราว์เซอร์
 * แล้วลองต่อใหม่ให้เองเรื่อย ๆ — รีสตาร์ต backend ทีเดียวภาพจะค้างถาวรถ้าไม่ลองใหม่
 */
export default function CameraFeed({ camera, className }: Props) {
  // เก็บเป็น id ของกล้องที่พัง ไม่ใช่ boolean — พอเปลี่ยนกล้องจะกลับมาลองใหม่เองโดยไม่ต้องใช้ effect
  const [failedId, setFailedId] = useState<string | null>(null)
  // นับรอบที่ต่อใหม่ ใช้ทั้งบังคับ remount และกัน URL ซ้ำเดิมจนเบราว์เซอร์หยิบของเก่ามาใช้
  const [attempt, setAttempt] = useState(0)

  const failed = failedId === camera.id

  useEffect(() => {
    if (!failed) return
    const timer = setTimeout(() => {
      setFailedId(null)
      setAttempt((n) => n + 1)
    }, RETRY_MS)
    return () => clearTimeout(timer)
  }, [failed, attempt])

  function retryNow() {
    setFailedId(null)
    setAttempt((n) => n + 1)
  }

  if (failed) {
    return (
      <div className={`${s.placeholder} ${className ?? ''}`}>
        <span>ไม่มีสัญญาณภาพ</span>
        <span className={s.placeholderHint}>ต่อ backend ไม่ได้</span>
        <button type="button" className={s.retry} onClick={retryNow}>
          ลองเชื่อมต่อใหม่
        </button>
      </div>
    )
  }

  // รอบแรกใช้ URL เปล่า ๆ ส่วนรอบต่อ ๆ ไปต้องต่างจากเดิม
  // ไม่งั้นเบราว์เซอร์อาจใช้ connection ที่ตายไปแล้วซ้ำ แล้วภาพค้างต่อเหมือนเดิม
  const base = getStreamUrl(camera.streamPath)
  const src = attempt === 0 ? base : `${base}?retry=${attempt}`

  return (
    <img
      key={`${camera.id}-${attempt}`}
      src={src}
      alt={`ภาพสดจาก${camera.name}`}
      className={`${s.image} ${className ?? ''}`}
      onError={() => setFailedId(camera.id)}
    />
  )
}
