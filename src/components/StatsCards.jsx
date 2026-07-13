const STATS = [
  {
    label: 'Total Users',
    value: '2,841',
    change: '+12%',
    up: true,
    icon: '👥',
    color: 'from-blue-500 to-blue-600',
    glow: 'shadow-blue-500/25',
  },
  {
    label: 'Games Played',
    value: '18,472',
    change: '+8%',
    up: true,
    icon: '🎮',
    color: 'from-purple-500 to-purple-600',
    glow: 'shadow-purple-500/25',
  },
  {
    label: 'Total Bets',
    value: '₿ 94,210',
    change: '+23%',
    up: true,
    icon: '💰',
    color: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/25',
  },
  {
    label: 'Active Now',
    value: '143',
    change: '-4%',
    up: false,
    icon: '🟢',
    color: 'from-green-500 to-emerald-600',
    glow: 'shadow-green-500/25',
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map(s => (
        <div
          key={s.label}
          className="bg-[#131c2e] border border-white/8 rounded-2xl p-5 hover:border-white/15 transition"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg ${s.glow} text-lg`}>
              {s.icon}
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
              s.up
                ? 'bg-green-500/12 text-green-400 border border-green-500/25'
                : 'bg-red-500/12 text-red-400 border border-red-500/25'
            }`}>
              {s.change}
            </span>
          </div>
          <p className="text-2xl font-black text-white">{s.value}</p>
          <p className="text-slate-400 text-xs font-medium mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
