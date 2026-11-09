// กล่องสถานะว่าง ใช้ซ้ำได้ทุกหน้าที่ยังไม่มีข้อมูล

import type { ReactNode } from 'react'
import { emptyState as s } from '../lib/styles'

type Props = {
  icon?: ReactNode
  title: string
  description?: string
  /** ปุ่มพาไปทำขั้นต่อไป เช่น ไปหน้าเพิ่มกล้อง */
  action?: { label: string; onClick: () => void }
}

/** กล่องสถานะว่าง ใช้ตอนยังไม่มีข้อมูลให้แสดง */
export default function EmptyState({ icon, title, description, action }: Props) {
  return (
    <div className={s.box}>
      {icon && <div className={s.icon}>{icon}</div>}
      <p className={s.title}>{title}</p>
      {description && <p className={s.description}>{description}</p>}
      {action && (
        <button type="button" onClick={action.onClick} className={s.action}>
          {action.label}
        </button>
      )}
    </div>
  )
}
