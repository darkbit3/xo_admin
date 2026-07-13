import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import StatsCards from '../components/StatsCards'
import RecentGames from '../components/RecentGames'
import ActiveUsers from '../components/ActiveUsers'
import Token from './Token'
import Balance from './Balance'
import Ai from './Ai'
import Analysis from './Analysis'

export default function Dashboard({ onLogout }) {
  const [page, setPage] = useState('dashboard')

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex">
      <Sidebar page={page} setPage={setPage} onLogout={onLogout} />

      <main className="flex-1 min-w-0 p-6 lg:p-8 overflow-y-auto">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white font-black text-2xl capitalize">{page}</h1>
            <p className="text-slate-400 text-sm mt-0.5">Welcome back, Admin 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-2 bg-[#131c2e] border border-white/8 rounded-xl px-4 py-2 text-sm text-slate-300">
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
              System Online
            </span>
            <button
              onClick={onLogout}
              className="bg-[#131c2e] border border-white/8 hover:border-white/20 rounded-xl px-4 py-2 text-sm text-slate-300 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        {page === 'dashboard' && (
          <div className="space-y-6">
            <StatsCards />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <RecentGames />
              <ActiveUsers />
            </div>
          </div>
        )}

        {page === 'users' && <ActiveUsers full />}
        {page === 'token' && <Token />}
        {page === 'balance' && <Balance />}
        {page === 'ai' && <Ai />}
        {page === 'analysis' && <Analysis />}
        {page === 'settings' && <SettingsPlaceholder />}

      </main>
    </div>
  )
}

function SettingsPlaceholder() {
  return (
    <div className="bg-[#131c2e] border border-white/8 rounded-2xl p-8 text-center text-slate-400">
      <div className="text-5xl mb-4">⚙️</div>
      <p className="font-semibold text-white">Settings</p>
      <p className="text-sm mt-1">Configuration panel coming soon.</p>
    </div>
  )
}
