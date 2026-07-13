import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Ai() {
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(false)
  const [globalValue, setGlobalValue] = useState(50)

  useEffect(() => {
    loadBots()
  }, [])

  async function loadBots() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/api/bots`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load bots')
      setBots(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function updateBot(id, difficulty, active) {
    try {
      const res = await fetch(`${API_URL}/api/bots/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, active })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to update bot')
      setBots((prev) => prev.map(b => b.id === id ? data.data : b))
    } catch (err) {
      console.error(err)
    }
  }

  async function setAll() {
    try {
      const res = await fetch(`${API_URL}/api/bots/set-all`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty: Number(globalValue) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to set all')
      setBots(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-[#131c2e] border border-white/8 rounded-3xl p-8 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-2">AI Control</p>
            <h2 className="text-white text-3xl font-black">AI Bots</h2>
          </div>
          <span className="inline-flex items-center rounded-full bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-300 border border-violet-500/20">
            Active
          </span>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <input type="number" min="0" max="100" value={globalValue} onChange={(e) => setGlobalValue(e.target.value)} className="w-24 rounded p-2 bg-[#0a1220] border border-white/10 text-white" />
          <button onClick={setAll} className="rounded-2xl bg-violet-500 px-4 py-2 text-sm font-semibold text-white">Set All</button>
          <button onClick={loadBots} className="rounded-2xl bg-slate-700 px-4 py-2 text-sm text-white">Reload</button>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a1220]">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-[#111827] text-xs uppercase tracking-[0.24em] text-slate-500">
              <tr>
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Difficulty (%)</th>
                <th className="px-4 py-4">Active</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-400">Loading bots…</td></tr>
              ) : bots.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-400">No bots found.</td></tr>
              ) : bots.map(b => (
                <tr key={b.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="px-4 py-4 text-slate-200">{b.id}</td>
                  <td className="px-4 py-4 text-slate-200">{b.name}</td>
                  <td className="px-4 py-4 text-slate-200">
                    <input type="range" min="0" max="100" value={b.difficulty} onChange={(e) => setBots(prev => prev.map(x => x.id === b.id ? { ...x, difficulty: Number(e.target.value) } : x))} />
                    <div className="text-sm mt-1">{b.difficulty}%</div>
                  </td>
                  <td className="px-4 py-4 text-slate-200">
                    <label className="inline-flex items-center gap-2">
                      <input type="checkbox" checked={!!b.active} onChange={(e) => setBots(prev => prev.map(x => x.id === b.id ? { ...x, active: e.target.checked ? 1 : 0 } : x))} />
                    </label>
                  </td>
                  <td className="px-4 py-4">
                    <button onClick={() => updateBot(b.id, Number(b.difficulty), b.active ? 1 : 0)} className="rounded bg-emerald-600 px-3 py-1 text-xs text-white">Save</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
