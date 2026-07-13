import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const AVATAR_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-amber-500 to-orange-500',
  'from-purple-500 to-pink-600',
  'from-green-500 to-emerald-600',
  'from-teal-500 to-cyan-500',
  'from-rose-500 to-red-600',
]

function getInitials(username) {
  if (!username) return 'U'
  const cleaned = username.replace(/^@/, '')
  return cleaned.slice(0, 2).toUpperCase()
}

export default function ActiveUsers({ full }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadPlayers() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/api/players`)
        if (!res.ok) throw new Error(`Failed to load players (${res.status})`)
        const data = await res.json()
        if (isMounted) {
          setPlayers(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to fetch players')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPlayers()
    return () => {
      isMounted = false
    }
  }, [])

  const rows = full ? players : players.slice(0, 5)
  const onlineCount = players.length

  return (
    <div className="bg-[#131c2e] border border-white/8 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <div className="flex items-center gap-2">
          <p className="text-white font-bold text-sm">Active Users</p>
          <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80] animate-pulse" />
            {loading ? 'Loading...' : `${onlineCount} online`}
          </span>
        </div>
        <span className="text-xs text-slate-500">Live</span>
      </div>

      <div className="divide-y divide-white/4">
        {loading && (
          <div className="px-5 py-6 text-sm text-slate-400">Loading active players…</div>
        )}

        {error && !loading && (
          <div className="px-5 py-6 text-sm text-rose-300">{error}</div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="px-5 py-6 text-sm text-slate-400">No active players found.</div>
        )}

        {!loading && !error && rows.map((player, index) => {
          const initials = getInitials(player.username)
          const betAmount = player.selected_bet_amount ?? 0
          const color = AVATAR_COLORS[index % AVATAR_COLORS.length]
          return (
            <div key={player.id ?? player.username} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white text-sm font-black shrink-0`}>
                {initials}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-semibold truncate">{player.username}</p>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                </div>
                <p className="text-slate-500 text-xs mt-0.5">Bet ₿{betAmount}</p>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-xs shrink-0">
                <div className="text-center">
                  <p className="text-white font-bold">{player.balance ?? 0}</p>
                  <p className="text-slate-500">Balance</p>
                </div>
                <div className="text-center">
                  <p className="text-green-400 font-bold">{player.status || 'online'}</p>
                  <p className="text-slate-500">Status</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
