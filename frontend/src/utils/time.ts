export function formatClock(d: Date) {
  return d.toLocaleTimeString('th-TH', { hour12: false })
}

export function formatHourMinute(ts: number) {
  return new Date(ts * 1000).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatRelative(ts: number) {
  const diff = Date.now() / 1000 - ts
  if (diff < 60) return 'เมื่อครู่'
  if (diff < 3600) return `${Math.floor(diff / 60)} นาทีที่แล้ว`
  return formatHourMinute(ts)
}

export function isToday(ts: number) {
  return new Date(ts * 1000).toDateString() === new Date().toDateString()
}