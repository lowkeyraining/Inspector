// หน้า Camera — ภาพสดแบบขยายพร้อมสถิติของกล้องตัวนั้น

import CameraFeed from '../components/CameraFeed'
import ClassCountChart from '../components/ClassCountChart'
import DetectionTable from '../components/DetectionTable'
import FpsChart from '../components/FpsChart'
import StatCard from '../components/StatCard'
import { useFpsHistory } from '../hooks/useFpsHistory'
import { useHealth } from '../hooks/useHealth'
import type { CameraConfig } from '../lib/cameras'
import { cameraPage as s } from '../lib/styles'

type Props = {
  camera: CameraConfig
  onBack: () => void
}

/** หน้ากล้องแบบขยาย — ภาพสดพร้อมสถิติและผลตรวจจับของกล้องตัวนั้น */
export default function Camera({ camera, onBack }: Props) {
  // backend ยังมีกล้องเดียว เมื่อรองรับหลายกล้องแล้วส่ง camera.id เข้าไปด้วย
  const { data, error, dataUpdatedAt } = useHealth()
  const fpsHistory = useFpsHistory(data?.fps, dataUpdatedAt)

  const detections = data?.detections ?? []
  const classCount = new Set(detections.map((d) => d.class)).size

  return (
    <>
      <div className={s.header}>
        <button type="button" onClick={onBack} className={s.back}>
          ← กลับไป Monitor
        </button>
        <div>
          <h1 className={s.title}>{camera.name}</h1>
          {camera.location && <p className={s.meta}>{camera.location}</p>}
        </div>
      </div>

      {error && <p className={s.errorBanner}>ต่อ backend ไม่ได้ — {error.message}</p>}

      <main className={s.main}>
        <div className={s.column}>
          <div className={s.statGrid}>
            <StatCard label="FPS" value={data ? data.fps.toFixed(1) : '-'} />
            <StatCard label="วัตถุที่ตรวจเจอ" value={detections.length} unit="ชิ้น" />
            <StatCard label="จำนวนคลาส" value={classCount} />
          </div>

          <section className={s.feedFrame}>
            <div className={s.feedHeader}>
              <span className={s.feedSource}>แหล่งภาพ {data?.source ?? '-'}</span>
              <span className={s.feedFps}>
                {data === undefined ? 'กำลังเชื่อมต่อ…' : `${data.fps.toFixed(1)} FPS`}
              </span>
            </div>
            <CameraFeed camera={camera} className={s.feedImage} />
          </section>
        </div>

        <div className={s.column}>
          <section className={s.panel}>
            <h2 className={s.panelTitle}>FPS ย้อนหลัง</h2>
            <FpsChart data={fpsHistory} />
          </section>

          <section className={s.panel}>
            <h2 className={s.panelTitle}>จำนวนตามคลาส</h2>
            <ClassCountChart detections={detections} />
          </section>

          <section className={s.panel}>
            <h2 className={s.panelTitle}>รายการที่ตรวจเจอ</h2>
            <DetectionTable detections={detections} />
          </section>
        </div>
      </main>
    </>
  )
}
