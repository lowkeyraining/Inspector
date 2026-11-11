// รากของแอป — ถือ state ว่ากำลังอยู่หน้าไหนและกำลังขยายกล้องตัวไหน แล้วเลือก page มา render

import { useState } from 'react'
import NavBar from './components/NavBar'
import { type NavItem } from './components/navItems'
import { findCamera } from './lib/cameras'
import { app } from './lib/styles'
import Camera from './pages/Camera'
import Dashboard from './pages/Dashboard'
import Device from './pages/Device'
import Monitor from './pages/Monitor'
import Report from './pages/Report'
import Station from './pages/Station'
import Task from './pages/Task'

export default function App() {
  const [active, setActive] = useState<NavItem>('Dashboard')
  /** กล้องที่กำลังขยายดูอยู่ — ตั้งค่าจากการกดกล้องย่อยในหน้า Monitor */
  const [openCameraId, setOpenCameraId] = useState<string | null>(null)

  function handleSelect(item: NavItem) {
    setActive(item)
    setOpenCameraId(null)
  }

  const openCamera = openCameraId ? findCamera(openCameraId) : undefined

  function renderPage() {
    // หน้ากล้องแบบขยายซ้อนอยู่บน Monitor — nav ยังค้างที่ Monitor อยู่
    if (openCamera) {
      return <Camera camera={openCamera} onBack={() => setOpenCameraId(null)} />
    }

    switch (active) {
      case 'Dashboard':
        return <Dashboard />
      case 'Station':
        return <Station />
      case 'Task':
        return <Task />
      case 'Device':
        return <Device />
      case 'Monitor':
        return <Monitor onOpenCamera={setOpenCameraId} onNavigate={handleSelect} />
      case 'Report':
        return <Report />
    }
  }

  return (
    <div className={app.root}>
      <NavBar
        active={active}
        onSelect={handleSelect}
        user={{ name: 'Washi Cloud', role: 'ผู้ดูแลระบบ' }}
      />
      {renderPage()}
    </div>
  )
}
