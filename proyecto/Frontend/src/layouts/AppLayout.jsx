import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import MobileHeader from '../components/MobileHeader.jsx'
import Footer from '../components/Footer.jsx'

function AppLayout() {
  return (
    <div className="h-full bg-background font-body-lg text-on-surface flex overflow-hidden custom-scrollbar">
      <MobileHeader />
      <Sidebar />

      <main className="flex-1 flex flex-col h-full md:ml-drawer-width pt-16 md:pt-0 overflow-y-auto bg-background">
        <Outlet />
        <Footer />
      </main>
    </div>
  )
}

export default AppLayout
