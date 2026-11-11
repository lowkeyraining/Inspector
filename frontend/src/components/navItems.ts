// รายการเมนูบน nav bar — แหล่งเดียวที่กำหนดว่ามีหน้าอะไรบ้าง

export const NAV_ITEMS = [
  'Dashboard',
  'Station',
  'Task',
  'Device',
  'Monitor',
  'Report',
] as const

export type NavItem = (typeof NAV_ITEMS)[number]
