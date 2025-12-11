import { Outlet } from 'react-router-dom'
import { AppMenuOverlay } from './AppMenuOverlay'

export function AppLayout() {
  return (
    <>
      <Outlet />
      <AppMenuOverlay />
    </>
  )
}
