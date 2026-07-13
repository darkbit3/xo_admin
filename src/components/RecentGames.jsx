const GAMES = [
  { id: '#4821', playerX: '@user_alpha', playerO: '@sigma_x',   bet: 50,  winner: 'X', time: '2m ago' },
  { id: '#4820', playerX: '@delta_pro',  playerO: '@king_o',    bet: 100, winner: 'O', time: '5m ago' },
  { id: '#4819', playerX: '@user_gamma', playerO: '@pro_xo',    bet: 20,  winner: 'D', time: '11m ago' },
  { id: '#4818', playerX: '@user_beta',  playerO: '@user_alpha', bet: 200, winner: 'X', time: '18m ago' },
  { id: '#4817', playerX: '@sigma_x',    playerO: '@delta_pro',  bet: 500, winner: 'O', time: '24m ago' },
  { id: '#4816', playerX: '@pro_xo',     playerO: '@user_gamma', bet: 30,  winner: 'X', time: '31m ago' },
]

const BADGE = {
  X: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  O: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  D: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
}
const LABEL = { X: 'X Wins', O: 'O Wins', D: 'Draw' }

export default function RecentGames({ full }) {
  const rows = full ? GAMES : GAMES.slice(0, 5)
  return (
    <div className="bg-[#131c2e] border border-white/8 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
        <p className="text-white font-bold text-sm">Recent Games</p>
        <span className="text-xs text-slate-500">{GAMES.length} total</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs uppercase tracking-widest border-b border-white/5">
              <th className="text-left px-5 py-3 font-semibold">ID</th>
              <th className="text-left px-5 py-3 font-semibold">Players</th>
              <th className="text-left px-5 py-3 font-semibold">Bet</th>
              <th className="text-left px-5 py-3 font-semibold">Result</th>
              <th className="text-left px-5 py-3 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((g, i) => (
              <tr
                key={g.id}
                className={`border-b border-white/4 hover:bg-white/3 transition ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}
              >
                <td className="px-5 py-3 text-slate-400 font-mono text-xs">{g.id}</td>
                <td className="px-5 py-3">
                  <span className="text-blue-400 font-semibold">{g.playerX}</span>
                  <span className="text-slate-600 mx-1.5 text-xs">vs</span>
                  <span className="text-orange-400 font-semibold">{g.playerO}</span>
                </td>
                <td className="px-5 py-3 text-amber-400 font-bold">₿ {g.bet}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${BADGE[g.winner]}`}>
                    {LABEL[g.winner]}
                  </span>
                </td>
                <td className="px-5 py-3 text-slate-500 text-xs">{g.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
