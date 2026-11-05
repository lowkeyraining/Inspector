import ClassCountChart from '../components/ClassCountChart'
import DetectionTable from '../components/DetectionTable'
import FpsChart from '../components/FpsChart'
import LiveStream from '../components/LiveStream'
import StatCard from '../components/StatCard'
import { useFpsHistory } from '../hooks/useFpsHistory'
import { useHealth } from '../hooks/useHealth'

export default function Dashboard() {
  const { data, error, dataUpdatedAt } = useHealth()
  const fpsHistory = useFpsHistory(data?.fps, dataUpdatedAt)

  const detections = data?.detections ?? []
  const classCount = new Set(detections.map((d) => d.class)).size

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <h1 className="text-xl font-semibold">Inspector</h1>
        <p className="text-sm text-slate-400">
          ระบบติดตามกระบวนการผลิตแบบเรียลไทม์ด้วยหลักการคอมพิวเตอร์วิทัศน์
        </p>
      </header>

      {error && (
        <p className="border-b border-rose-900/50 bg-rose-950/40 px-6 py-2 text-sm text-rose-300">
          ต่อ backend ไม่ได้ — {error.message}
        </p>
      )}

      <main className="grid gap-6 p-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="FPS" value={data ? data.fps.toFixed(1) : '-'} />
            <StatCard label="วัตถุที่ตรวจเจอ" value={detections.length} unit="ชิ้น" />
            <StatCard label="จำนวนคลาส" value={classCount} />
          </div>
          <LiveStream source={data?.source} fps={data?.fps} />
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-3 text-sm font-medium text-slate-300">FPS ย้อนหลัง</h2>
            <FpsChart data={fpsHistory} />
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-3 text-sm font-medium text-slate-300">จำนวนตามคลาส</h2>
            <ClassCountChart detections={detections} />
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="mb-3 text-sm font-medium text-slate-300">รายการที่ตรวจเจอ</h2>
            <DetectionTable detections={detections} />
          </section>
        </div>
      </main>
    </div>
  )
}
