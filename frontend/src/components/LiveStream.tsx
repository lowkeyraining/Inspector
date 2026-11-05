import { getStreamUrl } from '../api/inspector'

type Props = {
  source?: number | string
  fps?: number
}

export default function LiveStream({ source, fps }: Props) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-sm">
        <span className="text-slate-300">กล้อง {source ?? '-'}</span>
        <span className="text-slate-400 tabular-nums">
          {fps === undefined ? 'กำลังเชื่อมต่อ…' : `${fps.toFixed(1)} FPS`}
        </span>
      </div>
      <img src={getStreamUrl()} alt="ภาพสดจากกล้อง" className="w-full bg-black" />
    </section>
  )
}
