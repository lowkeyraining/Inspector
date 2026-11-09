// หน้า Monitor — กริดภาพสดของกล้องทุกตัว

import CameraTile from '../components/CameraTile'
import EmptyState from '../components/EmptyState'
import { CameraOffIcon } from '../components/icons'
import PageShell from '../components/PageShell'
import type { NavItem } from '../components/navItems'
import { CAMERAS } from '../lib/cameras'
import { monitor as s } from '../lib/styles'

type Props = {
  onOpenCamera: (id: string) => void
  onNavigate: (item: NavItem) => void
}

export default function Monitor({ onOpenCamera, onNavigate }: Props) {
  const hasCameras = CAMERAS.length > 0

  return (
    <PageShell
      title="Monitor"
      description={
        hasCameras
          ? `ภาพสดจากกล้องทั้งหมด ${CAMERAS.length} ตัว กดที่กล้องเพื่อขยายดูรายละเอียด`
          : 'ภาพสดจากกล้องทุกตัวในระบบ'
      }
    >
      {hasCameras ? (
        <div className={s.grid}>
          {CAMERAS.map((camera) => (
            <CameraTile key={camera.id} camera={camera} onOpen={onOpenCamera} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<CameraOffIcon />}
          title="ยังไม่มีกล้องในระบบ"
          description="เพิ่มกล้องเข้าระบบก่อน แล้วภาพสดของแต่ละตัวจะมาแสดงที่นี่"
          action={{ label: 'ไปหน้า Device', onClick: () => onNavigate('Device') }}
        />
      )}
    </PageShell>
  )
}
