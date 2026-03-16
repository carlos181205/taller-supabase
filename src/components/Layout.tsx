// src/components/Layout.tsx
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function Layout() {
  return (
    <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'1rem 1.5rem' }}>
      <Navbar />
      <Outlet />
    </div>
  )
}