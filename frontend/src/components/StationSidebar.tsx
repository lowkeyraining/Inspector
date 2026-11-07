import { Layers } from 'lucide-react'
import type { StationInfo } from '../types'

interface Props {
  stations: StationInfo[]
  activeId: string | null
  alertIds: string[]
  counts: Record<string, number>
  onSelectAll: () => void
  onSelect: (id: string) => void
}

export default function StationSidebar({
  stations,
  activeId,
  alertIds,
  counts,
  onSelectAll,
  onSelect,
}: Props) {
  const overviewActive = activeId === null

  return (
    <aside className="w-[230px] shrink-0 border-l border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-semibold tracking-wide text-slate-600">
        กล้อง / STATION
      </div>

      <button
        onClick={onSelectAll}
        className={`flex w-full items-center gap-2.5 border-b border-slate-200 px-4 py-3.5 text-sm font-medium ${
          overviewActive ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
        }`}
      >
        <Layers size={16} className={overviewActive ? 'text-blue-600' : 'text-slate-500'} />
        ภาพรวมทุกกล้อง
      </button>

      {stations.map((s) => {
        const active = s.id === activeId
        const alert = alertIds.includes(s.id)
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`flex w-full items-center gap-3 border-b border-slate-200 px-4 py-3.5 text-sm ${
              active ? 'bg-blue-50' : 'hover:bg-slate-50'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${alert ? 'bg-rose-500' : 'bg-teal-700'}`} />
            <span
              className={
                alert
                  ? 'text-rose-500'
                  : active
                    ? 'font-semibold text-blue-600'
                    : 'text-slate-400'
              }
            >
              {s.id}
            </span>
            <span className={alert ? 'text-rose-500' : 'text-slate-800'}>{s.name}</span>
            <span className={`ml-auto text-xs font-semibold ${alert ? 'text-rose-500' : 'text-slate-600'}`}>
              {counts[s.id] ?? 0}
            </span>
          </button>
        )
      })}
    </aside>
  )
}