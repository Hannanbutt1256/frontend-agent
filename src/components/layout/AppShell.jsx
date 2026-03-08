import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-base relative">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto relative custom-scrollbar z-0">
        {/* Modern Background: Grain + Glow */}
        <div className="absolute inset-0 z-[-1] pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] animate-pulse-glow" />
        </div>

        <div className="p-10 max-w-7xl mx-auto min-h-full animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
