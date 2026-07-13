const NAV = [
  { id: 'dashboard', icon: '▦', label: 'Dashboard' },
  { id: 'users',     icon: '👥', label: 'Users' },
  { id: 'token',     icon: '🔑', label: 'Token' },
  { id: 'balance',   icon: '💰', label: 'Balance' },
  { id: 'ai',        icon: '🤖', label: 'AI' },
  { id: 'analysis',  icon: '📊', label: 'Analysis' },
  { id: 'settings',  icon: '⚙️', label: 'Settings' },
]

export default function Sidebar({ page, setPage, onLogout }) {
  return (
    <aside className="hidden md:flex flex-col w-60 min-h-screen bg-[#0d1424] border-r border-white/6 px-4 py-6 shrink-0">

      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-white font-black text-base">X</span>
        </div>
        <div>
          <p className="text-white font-black text-sm tracking-tight">XO Game</p>
          <p className="text-slate-500 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3">Menu</p>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${page === n.id
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <span className="text-base w-5 text-center">{n.icon}</span>
            {n.label}
            {page === n.id && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
          </button>
        ))}
      </nav>

      {/* User / logout */}
      <div className="mt-6 pt-6 border-t border-white/6">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate">Admin</p>
            <p className="text-slate-500 text-xs truncate">admin@xo.com</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition"
        >
          <span className="text-base w-5 text-center">↩</span>
          Logout
        </button>
      </div>

    </aside>
  )
}
