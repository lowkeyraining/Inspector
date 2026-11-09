// กล้องย่อยในหน้า Monitor — กดแล้วขยายเข้าหน้า Camera

import type { CameraConfig } from '../lib/cameras'
import { cameraTile as s } from '../lib/styles'
import CameraFeed from './CameraFeed'

type Props = {
  camera: CameraConfig
  onOpen: (id: string) => void
}

/** กล้องย่อยใน Monitor — กดแล้วขยายเข้าหน้า Camera */
export default function CameraTile({ camera, onOpen }: Props) {
  return (
    <button
      type="button"
      onClick={() => onOpen(camera.id)}
      className={s.button}
      // ปุ่มมีภาพ + ชื่อกล้องอยู่ข้างใน ตั้งชื่อให้ชัดว่ากดแล้วเกิดอะไร
      aria-label={`ขยาย ${camera.name}`}
    >
      <CameraFeed camera={camera} className={s.feed} />
      <div className={s.caption}>
        <span className={s.name}>{camera.name}</span>
        {camera.location && <span className={s.location}>{camera.location}</span>}
      </div>
    </button>
  )
}
