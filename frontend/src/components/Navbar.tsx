import { Database } from 'lucide-react'

const MENU = ['Dashboard', 'Station', 'Task', 'Device', 'Monitor', 'Reports']

export default function Navbar({ active }: { active: string }) {
  return (
    <header className="flex h-[72px] shrink-0 items-center border-b border-slate-200 bg-white px-10">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Database size={18} strokeWidth={2.2} />
        </div>
        <span className="text-xl font-bold tracking-tight">Inspector</span>
      </div>

      <nav className="ml-16 flex gap-2">
        {MENU.map((m) => (
          <button
            key={m}
            className={`rounded-lg px-4 py-2.5 text-[15px] transition-colors ${
              m === active
                ? 'bg-blue-50 font-semibold text-blue-600'
                : 'font-medium text-slate-600 hover:bg-slate-50'
            }`}
          >
            {m}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-3 border-l border-slate-200 pl-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
          AD
        </div>
        <span className="text-sm font-medium text-slate-800">ผู้ดูแลระบบ</span>
      </div>
    </header>
  )
}