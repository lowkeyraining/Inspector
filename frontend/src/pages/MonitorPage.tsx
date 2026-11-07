import { useEffect, useState } from 'react'
import LiveView from '../components/LiveView'
import StatusChip from '../components/StatusChip'
import type { LiveState } from '../hooks/useLive'
import type { StationInfo } from '../types'
import { formatClock, formatHourMinute, isToday } from '../utils/time'

function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return <>{formatClock(now)}</>
}

interface Props {
  station: StationInfo
  live: LiveState
}

const card = 'rounded-xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)]'

export default function MonitorPage({ station, live }: Props) {
  const { statuses, events, connected } = live
  const status = statuses[station.id]
  const cameraOk = status?.camera_ok ?? false

  const detections = [...(status?.detections ?? [])].sort((a, b) => b.confidence - a.confidence)
  const hasDefect = detections.length > 0
  const top = detections[0]

  const todayEvents = events.filter((e) => e.station_id === station.id && isToday(e.timestamp))

  return (
    <div className="space-y-6 px-10 py-10">
      {/* แถบหัว */}
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
          Station {station.id} — {station.name}
        </span>
        <StatusChip cameraOk={cameraOk} alert={hasDefect} />
        <span
          className={`ml-auto flex items-center gap-2 text-sm font-semibold ${
            connected ? 'text-rose-500' : 'text-slate-400'
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${connected ? 'bg-rose-500' : 'bg-slate-400'}`} />
          {connected ? 'LIVE' : 'กำลังเชื่อมต่อ...'}
        </span>
      </div>

      {/* ภาพสด */}
      {cameraOk ? (
        <LiveView
          key={station.id}
          src={`/api/stations/${station.id}/stream`}
          overlay={
            <span className="absolute left-4 top-4 rounded-md bg-slate-800/90 px-2.5 py-1.5 text-xs font-semibold text-white">
              <Clock />
            </span>
          }
        />
      ) : (
        <div className="flex aspect-[21/9] w-full items-center justify-center rounded-xl bg-slate-900 text-sm text-slate-400">
          กล้องไม่พร้อม กำลังลองเชื่อมต่อใหม่...
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.65fr_1fr]">
        {/* ผลตรวจจับล่าสุด */}
        <section className={card}>
          <h2 className="mb-5 text-[17px] font-semibold">
            ผลตรวจจับล่าสุด{top && ` (Confidence ${Math.round(top.confidence * 100)}%)`}
          </h2>
          {detections.length === 0 ? (
            <p className="text-sm text-slate-400">ไม่พบสิ่งผิดปกติในภาพ</p>
          ) : (
            <ul className="space-y-4">
              {detections.slice(0, 3).map((d, i) => {
                const pct = Math.round(d.confidence * 100)
                const isTop = i === 0
                return (
                  <li key={i}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-slate-600">{d.class}</span>
                      <span className={`font-semibold ${isTop ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-200">
                      <div
                        className={`h-1.5 rounded-full ${isTop ? 'bg-rose-400' : 'bg-emerald-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* สถานะกล้องวันนี้ */}
        <section className={card}>
          <h2 className="mb-5 text-[17px] font-semibold">สถานะกล้องวันนี้</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <dt className="text-xs text-slate-400">เหตุการณ์วันนี้</dt>
              <dd className="mt-1 text-xl font-bold text-rose-500">{todayEvents.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">ความเร็วประมวลผล</dt>
              <dd className="mt-1 text-xl font-bold">{cameraOk ? `${status.fps} FPS` : '-'}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">แหล่งภาพ</dt>
              <dd className="mt-1 text-xl font-bold">กล้อง {station.source}</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-400">การเชื่อมต่อ</dt>
              <dd className={`mt-1 text-xl font-bold ${cameraOk ? '' : 'text-slate-400'}`}>
                {cameraOk ? 'ออนไลน์' : 'ออฟไลน์'}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* เหตุการณ์แยกชิ้นงานวันนี้ */}
      <section className={card}>
        <h2 className="mb-5 text-[17px] font-semibold">เหตุการณ์แยกชิ้นงานวันนี้ ({todayEvents.length})</h2>
        {todayEvents.length === 0 ? (
          <p className="text-sm text-slate-400">ยังไม่มีเหตุการณ์วันนี้</p>
        ) : (
          <ul className="space-y-2.5">
            {todayEvents.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-lg bg-rose-100/70 px-4 py-3.5 text-sm text-rose-400">
                <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white">NG</span>
                <span>
                  {formatHourMinute(e.timestamp)} · #{e.id} · {e.class} {Math.round(e.confidence * 100)}%
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}