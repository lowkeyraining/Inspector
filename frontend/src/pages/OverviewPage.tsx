import { AlertTriangle } from 'lucide-react'
import StatusChip from '../components/StatusChip'
import type { LiveState } from '../hooks/useLive'
import { formatRelative, isToday } from '../utils/time'

interface Props {
  live: LiveState
  onOpen: (stationId: string) => void
}

export default function OverviewPage({ live, onOpen }: Props) {
  const { stations, statuses, events } = live
  const todayEvents = events.filter((e) => isToday(e.timestamp))

  return (
    <div className="space-y-10 px-10 py-10">
      {stations.length === 0 && <p className="text-sm text-slate-400">กำลังโหลดรายชื่อสถานี...</p>}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {stations.map((s) => {
          const st = statuses[s.id]
          const cameraOk = st?.camera_ok ?? false
          const alert = (st?.detections.length ?? 0) > 0
          return (
            <button
              key={s.id}
              onClick={() => onOpen(s.id)}
              className={`overflow-hidden rounded-xl border bg-white text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-md ${
                alert ? 'border-rose-400' : 'border-slate-200'
              }`}
            >
              <div className="relative aspect-video bg-slate-900">
                {cameraOk ? (
                  <img
                    src={`/api/stations/${s.id}/stream`}
                    alt={`ภาพสดสถานี ${s.id}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-400">
                    กล้องไม่พร้อม
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between px-4 py-4">
                <span className="font-semibold">
                  {s.id} · {s.name}
                </span>
                <StatusChip cameraOk={cameraOk} alert={alert} size="sm" />
              </div>
            </button>
          )
        })}
      </div>

      <section className="max-w-[640px]">
        <h2 className="mb-4 flex items-center gap-3 text-[17px] font-semibold">
          เหตุการณ์ล่าสุด
          <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-500">
            {todayEvents.length} รายการ
          </span>
        </h2>
        {todayEvents.length === 0 ? (
          <p className="text-sm text-slate-400">ยังไม่มีเหตุการณ์วันนี้</p>
        ) : (
          <ul className="space-y-3">
            {todayEvents.slice(0, 10).map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3.5 text-sm"
              >
                <AlertTriangle size={18} className="shrink-0 text-rose-500" />
                <span className="font-semibold text-rose-500">
                  Station {e.station_id} - ชิ้นที่ #{e.id} พบสิ่งผิดปกติ
                </span>
                <span className="text-slate-500">
                  {e.class} · {Math.round(e.confidence * 100)}%
                </span>
                <span className="ml-auto shrink-0 text-xs text-slate-400">{formatRelative(e.timestamp)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}