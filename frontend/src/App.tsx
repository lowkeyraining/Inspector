import { useState } from 'react'
import Navbar from './components/Navbar'
import StationSidebar from './components/StationSidebar'
import MonitorPage from './pages/MonitorPage'
import OverviewPage from './pages/OverviewPage'
import { useLive } from './hooks/useLive'
import { isToday } from './utils/time'

export default function App() {
  const live = useLive()
  const [selectedId, setSelectedId] = useState<string | null>(null)   // null = ภาพรวมทุกกล้อง

  const alertIds = live.stations
    .filter((s) => (live.statuses[s.id]?.detections.length ?? 0) > 0)
    .map((s) => s.id)

  const counts: Record<string, number> = {}
  for (const e of live.events) {
    if (isToday(e.timestamp)) counts[e.station_id] = (counts[e.station_id] ?? 0) + 1
  }

  const station = live.stations.find((s) => s.id === selectedId)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar active="Monitor" />
      <div className="flex flex-1">
        <main className="min-w-0 flex-1">
          {station ? (
            <MonitorPage station={station} live={live} />
          ) : (
            <OverviewPage live={live} onOpen={setSelectedId} />
          )}
        </main>
        <StationSidebar
          stations={live.stations}
          activeId={station ? station.id : null}
          alertIds={alertIds}
          counts={counts}
          onSelectAll={() => setSelectedId(null)}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  )
}