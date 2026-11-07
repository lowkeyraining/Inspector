import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

interface Props {
  src: string
  overlay?: ReactNode
}

export default function LiveView({ src, overlay }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [full, setFull] = useState(false)

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === ref.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggle = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else ref.current?.requestFullscreen()
  }

  return (
    <div
      ref={ref}
      className={
        full
          ? 'relative flex items-center justify-center bg-black'
          : 'relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-slate-900'
      }
    >
      <img
        src={src}
        alt="ภาพสดจากกล้อง"
        onDoubleClick={toggle}
        className={full ? 'h-full w-full object-contain' : 'h-full w-full object-cover object-center'}
      />
      {overlay}
      <button
        onClick={toggle}
        title={full ? 'ออกจากโหมดเต็มจอ' : 'ขยายเต็มจอ'}
        className="absolute right-4 top-4 rounded-md bg-slate-800/80 p-2 text-white transition-colors hover:bg-slate-700"
      >
        {full ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  )
}