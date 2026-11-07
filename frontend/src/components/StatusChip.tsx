interface Props {
  cameraOk: boolean
  alert: boolean
  size?: 'sm' | 'md'
}

export default function StatusChip({ cameraOk, alert, size = 'md' }: Props) {
  const sizing = size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'

  if (!cameraOk) {
    return <span className={`rounded-full bg-slate-100 font-medium text-slate-500 ${sizing}`}>ออฟไลน์</span>
  }
  if (alert) {
    return <span className={`rounded-full bg-rose-100 font-medium text-rose-500 ${sizing}`}>พบสิ่งผิดปกติ</span>
  }
  return <span className={`rounded-full bg-emerald-50 font-medium text-emerald-600 ${sizing}`}>ปกติ</span>
}