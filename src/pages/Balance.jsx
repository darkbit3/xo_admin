import { useEffect, useState } from 'react'
import { useAuthFetch } from '../utils/authFetch'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Balance() {
  const authFetch = useAuthFetch()
  const [owners, setOwners] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loadingOwners, setLoadingOwners] = useState(false)
  const [loadingTx, setLoadingTx] = useState(false)
  const [tab, setTab] = useState('owners')

  const totalOwnerBalance = owners.reduce((sum, owner) => sum + Number(owner.owner_balance || 0), 0)
  const isRefreshing = loadingOwners || loadingTx

  async function loadOwners() {
    try {
      setLoadingOwners(true)
      const res = await authFetch(`${API_URL}/api/admin/owners`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load owners')
      setOwners(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingOwners(false)
    }
  }

  async function loadTx() {
    try {
      setLoadingTx(true)
      const res = await authFetch(`${API_URL}/api/admin/transactions?limit=100`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load transactions')
      setTransactions(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingTx(false)
    }
  }

  async function refreshData() {
    await Promise.all([loadOwners(), loadTx()])
  }

  useEffect(() => {
    refreshData()
  }, [])

  return (
    <div className="space-y-6">
      <section className="bg-[#131c2e] border border-white/8 rounded-3xl p-8 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-2">Balance Overview</p>
            <h2 className="text-white text-3xl font-black">Owners & Transactions</h2>
            <p className="text-slate-400 text-sm mt-2">
              Total owner balance: <span className="text-white font-semibold">₿ {totalOwnerBalance.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <div className="inline-flex rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 border border-emerald-500/20">
              Admin View
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="inline-flex rounded-xl bg-[#0a1220] p-2">
            <button onClick={() => setTab('owners')} className={`px-4 py-2 rounded-lg ${tab === 'owners' ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}>Owners</button>
            <button onClick={() => setTab('transactions')} className={`ml-2 px-4 py-2 rounded-lg ${tab === 'transactions' ? 'bg-emerald-600 text-white' : 'text-slate-300'}`}>Transactions</button>
          </div>
        </div>

        {tab === 'owners' && (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a1220]">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="border-b border-white/10 bg-[#111827] text-xs uppercase tracking-[0.24em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Token ID</th>
                  <th className="px-4 py-4">Token</th>
                  <th className="px-4 py-4">Owner</th>
                  <th className="px-4 py-4">Owner Balance</th>
                  <th className="px-4 py-4">Backend</th>
                </tr>
              </thead>
              <tbody>
                {loadingOwners ? (
                  <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-400">Loading owners…</td></tr>
                ) : owners.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-6 text-center text-slate-400">No owners yet.</td></tr>
                ) : owners.map((o) => (
                  <tr key={o.token_id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="px-4 py-4 text-slate-200">{o.token_id}</td>
                    <td className="px-4 py-4 font-mono text-slate-100">{o.token}</td>
                    <td className="px-4 py-4 text-slate-200">{o.owner_username || '—'}</td>
                    <td className="px-4 py-4 text-slate-200">{o.owner_balance != null ? `₿ ${Number(o.owner_balance).toFixed(2)}` : '—'}</td>
                    <td className="px-4 py-4 text-slate-200">{o.backend || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'transactions' && (
          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a1220]">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="border-b border-white/10 bg-[#111827] text-xs uppercase tracking-[0.24em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4">Owner</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Reference</th>
                  <th className="px-4 py-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {loadingTx ? (
                  <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-400">Loading transactions…</td></tr>
                ) : transactions.length === 0 ? (
                  <tr><td colSpan="6" className="px-4 py-6 text-center text-slate-400">No transactions yet.</td></tr>
                ) : transactions.map((t) => (
                  <tr key={t.id} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="px-4 py-4 text-slate-200">{t.id}</td>
                    <td className="px-4 py-4 text-slate-200">{t.owner_username || '—'}</td>
                    <td className={`px-4 py-4 ${t.amount >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>{t.amount >= 0 ? `+₿ ${Number(t.amount).toFixed(2)}` : `-₿ ${Math.abs(Number(t.amount)).toFixed(2)}`}</td>
                    <td className="px-4 py-4 text-slate-200">{t.type}</td>
                    <td className="px-4 py-4 text-slate-200">{t.reference || '—'}</td>
                    <td className="px-4 py-4 text-slate-200">{t.created_at ? new Date(t.created_at * 1000).toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
