// แถบบนสุด — โลโก้ ชื่อระบบ เมนูหลัก และผู้ใช้ที่ล็อกอินอยู่

import { navbar as s } from '../lib/styles'
import { NAV_ITEMS, type NavItem } from './navItems'

type Props = {
  active: NavItem
  onSelect: (item: NavItem) => void
  user?: { name: string; role?: string }
}

export default function NavBar({ active, onSelect, user }: Props) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '?'

  return (
    <header className={s.header}>
      <div className={s.bar}>
        {/* โลโก้ + ชื่อโปรแกรม */}
        <div className={s.brandGroup}>
          <div className={s.logoSlot} aria-hidden="true" title="ที่สำหรับโลโก้ (ยังไม่ออกแบบ)">
            LOGO
          </div>
          <span className={s.brandName}>Inspector</span>
        </div>

        {/* เมนูหลัก */}
        <nav aria-label="เมนูหลัก" className={s.nav}>
          <ul className={s.list}>
            {NAV_ITEMS.map((item) => {
              const isActive = item === active
              return (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`${s.item.base} ${isActive ? s.item.active : s.item.idle}`}
                  >
                    {item}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* ผู้ใช้งาน */}
        <div className={s.userGroup}>
          <div className={s.userText}>
            <p className={s.userName}>{user?.name ?? 'ยังไม่ได้เข้าสู่ระบบ'}</p>
            {user?.role && <p className={s.userRole}>{user.role}</p>}
          </div>
          <div className={s.avatar}>{initials}</div>
        </div>
      </div>
    </header>
  )
}
