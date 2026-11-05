import type { Detection } from '../api/types'

type Props = {
  detections: Detection[]
}

export default function DetectionTable({ detections }: Props) {
  if (detections.length === 0) {
    return <p className="text-sm text-slate-500">ยังไม่พบวัตถุ</p>
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="text-xs uppercase text-slate-500">
          <th className="pb-2 font-medium">คลาส</th>
          <th className="pb-2 text-right font-medium">ความมั่นใจ</th>
          <th className="pb-2 text-right font-medium">bbox</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-800">
        {detections.map((d, i) => (
          <tr key={`${d.class}-${i}`} className="text-slate-300">
            <td className="py-1.5">{d.class}</td>
            <td className="py-1.5 text-right tabular-nums">
              {(d.confidence * 100).toFixed(0)}%
            </td>
            <td className="py-1.5 text-right font-mono text-xs text-slate-500">
              {d.bbox.join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
