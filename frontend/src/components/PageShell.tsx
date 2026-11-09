// โครงหน้ามาตรฐาน — หัวข้อ คำอธิบาย และพื้นที่เนื้อหา

import type { ReactNode } from 'react'
import { pageShell as s } from '../lib/styles'

type Props = {
  title: string
  description?: string
  children?: ReactNode
}

export default function PageShell({ title, description, children }: Props) {
  return (
    <>
      <div className={s.header}>
        <h1 className={s.title}>{title}</h1>
        {description && <p className={s.description}>{description}</p>}
      </div>
      <main className={s.main}>
        {children ?? <div className={s.placeholder}>ยังไม่ได้พัฒนา</div>}
      </main>
    </>
  )
}
