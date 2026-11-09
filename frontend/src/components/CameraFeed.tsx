// ภาพสดของกล้องหนึ่งตัว พร้อม placeholder เมื่อต่อไม่ได้

import { useState } from 'react'
import { getStreamUrl } from '../api/inspector'
import type { CameraConfig } from '../lib/cameras'
import { cameraFeed as s } from '../lib/styles'

type Props = {
  camera: CameraConfig
  /** ความสูง/สัดส่วนของกรอบภาพ ต่างกันระหว่างกล้องย่อยกับหน้าขยาย */
  className?: string
}

/**
 * ภาพสดจากกล้องหนึ่งตัว
 * ถ้าต่อ stream ไม่ได้จะขึ้น placeholder แทน broken-image icon ของเบราว์เซอร์
 */
export default function CameraFeed({ camera, className }: Props) {
  // เก็บเป็น id ของกล้องที่พัง ไม่ใช่ boolean — พอเปลี่ยนกล้องจะกลับมาลองใหม่เองโดยไม่ต้องใช้ effect
  const [failedId, setFailedId] = useState<string | null>(null)

  if (failedId === camera.id) {
    return (
      <div className={`${s.placeholder} ${className ?? ''}`}>
        <span>ไม่มีสัญญาณภาพ</span>
        <span className={s.placeholderHint}>ต่อ backend ไม่ได้</span>
      </div>
    )
  }

  return (
    <img
      key={camera.id}
      src={getStreamUrl(camera.streamPath)}
      alt={`ภาพสดจาก${camera.name}`}
      className={`${s.image} ${className ?? ''}`}
      onError={() => setFailedId(camera.id)}
    />
  )
}
