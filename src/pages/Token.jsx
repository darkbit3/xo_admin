import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function Token() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedToken, setSelectedToken] = useState(null)
  const [mode, setMode] = useState('create')
  const [form, setForm] = useState({ name: '', token: '', backend: '', expiresAt: '' })
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const openModal = () => {
    setMode('create')
    setForm({ name: '', token: '', backend: '', expiresAt: '' })
    setIsModalOpen(true)
  }
  const closeModal = () => setIsModalOpen(false)
  const closeDetailModal = () => {
    setDetailModalOpen(false)
    setSelectedToken(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const generateTokenValue = () => {
    const value = `tk-${Math.random().toString(36).slice(2, 10)}`
    setForm((prev) => ({ ...prev, token: value }))
  }

  const setNeverExpiration = () => {
    setForm((prev) => ({ ...prev, expiresAt: 'Never' }))
  }

  useEffect(() => {
    const loadTokens = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${API_URL}/api/tokens`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Failed to load tokens')
        setTokens(data.map((item) => ({
          id: item.id,
          token: item.token,
          backend: item.backend || '',
          date: item.expires_at ? new Date(item.expires_at).toISOString().slice(0, 10) : 'Never',
          state: item.status || 'active',
        })))
      } catch (err) {
        setError(err.message || 'Could not load tokens')
      } finally {
        setLoading(false)
      }
    }

    loadTokens()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const payload = {
        token: form.token || `tk-${Date.now()}`,
        owner_id: null,
        backend: form.backend || '',
        expires_at: form.expiresAt === 'Never' ? null : form.expiresAt ? Date.parse(form.expiresAt) : null,
        status: 'active',
      }

      const res = await fetch(`${API_URL}/api/tokens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to create token')

      setTokens((prev) => [{
        id: data.id,
        token: data.token,
        backend: data.backend || form.backend || '',
        date: form.expiresAt === 'Never' ? 'Never' : (form.expiresAt || 'N/A'),
        state: data.status || 'active',
      }, ...prev])

      setForm({ name: '', token: '', backend: '', expiresAt: '' })
      closeModal()
    } catch (err) {
      setError(err.message || 'Could not save token')
    }
  }

  const openDetailModal = (tokenItem) => {
    setSelectedToken(tokenItem)
    setForm({
      name: tokenItem.backend || '',
      token: tokenItem.token || '',
      backend: tokenItem.backend || '',
      expiresAt: tokenItem.date === 'Never' ? 'Never' : tokenItem.date || '',
    })
    setMode('view')
    setDetailModalOpen(true)
  }

  const startEdit = () => {
    setMode('edit')
  }

  const saveEditedToken = async (event) => {
    event.preventDefault()
    if (!selectedToken) return

    try {
      const payload = {
        token: form.token || selectedToken.token,
        backend: form.backend || '',
        expires_at: form.expiresAt === 'Never' ? null : form.expiresAt ? Date.parse(form.expiresAt) : null,
        status: selectedToken.state || 'active',
      }

      const res = await fetch(`${API_URL}/api/tokens/${Number(selectedToken.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to update token')

      setTokens((prev) => prev.map((item) => item.id === selectedToken.id ? {
        ...item,
        token: data.token || item.token,
        backend: data.backend || item.backend,
        date: data.expires_at ? new Date(data.expires_at).toISOString().slice(0, 10) : 'Never',
        state: data.status || item.state,
      } : item))

      setSelectedToken((prev) => prev ? {
        ...prev,
        token: data.token || prev.token,
        backend: data.backend || prev.backend,
        date: data.expires_at ? new Date(data.expires_at).toISOString().slice(0, 10) : 'Never',
        state: data.status || prev.state,
      } : prev)

      setMode('view')
    } catch (err) {
      setError(err.message || 'Could not update token')
    }
  }

  const deleteToken = async (tokenId) => {
    try {
      const res = await fetch(`${API_URL}/api/tokens/${Number(tokenId)}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to delete token')

      setTokens((prev) => prev.filter((item) => item.id !== tokenId))
      closeDetailModal()
    } catch (err) {
      setError(err.message || 'Could not delete token')
    }
  }

  return (
    <div className="space-y-6">
      <section className="bg-[#131c2e] border border-white/8 rounded-3xl p-8 shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-2">Token Management</p>
            <h2 className="text-white text-3xl font-black">Token Page</h2>
          </div>
          <button
            onClick={openModal}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400 transition"
          >
            Generate Token
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#0a1220]">
          <table className="min-w-full text-left text-sm text-slate-300">
            <thead className="border-b border-white/10 bg-[#111827] text-xs uppercase tracking-[0.24em] text-slate-500">
              <tr>
                <th className="px-4 py-4">ID</th>
                <th className="px-4 py-4">Token</th>
                <th className="px-4 py-4">Backend</th>
                <th className="px-4 py-4">Expire Date</th>
                <th className="px-4 py-4">State</th>
                <th className="px-4 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-400">Loading tokens…</td>
                </tr>
              ) : tokens.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-slate-400">No tokens yet.</td>
                </tr>
              ) : tokens.map((item) => (
                <tr key={item.id} className="border-b border-white/10 hover:bg-white/5 transition">
                  <td className="px-4 py-4 text-slate-200">{item.id}</td>
                  <td className="px-4 py-4 font-mono text-slate-100">{item.token}</td>
                  <td className="px-4 py-4 text-slate-200">{item.backend}</td>
                  <td className="px-4 py-4 text-slate-200">{item.date}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.state === 'active' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                      {item.state}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openDetailModal(item)}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 hover:bg-white/10 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openDetailModal(item)}
                        className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/20 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteToken(item.id)}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs text-rose-300 hover:bg-rose-500/20 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detailModalOpen && selectedToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl bg-[#111827] border border-white/10 p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-[0.35em] mb-2">Token Details</p>
                <h3 className="text-white text-2xl font-black">{mode === 'edit' ? 'Edit Token' : 'Token Details'}</h3>
              </div>
              <button onClick={closeDetailModal} className="text-slate-400 hover:text-white">✕</button>
            </div>

            {mode === 'edit' ? (
              <form onSubmit={saveEditedToken} className="grid gap-5">
                <div className="rounded-2xl border border-white/10 bg-[#0f1720] p-4">
                  <label className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2 block">Token</label>
                  <div className="flex gap-3">
                    <input
                      name="token"
                      value={form.token}
                      onChange={handleChange}
                      className="flex-1 rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={generateTokenValue}
                      className="rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-600 transition"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#0f1720] p-4">
                    <label className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2 block">Backend URL</label>
                    <input
                      name="backend"
                      value={form.backend}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0f1720] p-4">
                    <label className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2 block">Expiration</label>
                    <div className="flex gap-3 flex-col sm:flex-row">
                      <input
                        name="expiresAt"
                        type="date"
                        value={form.expiresAt === 'Never' ? '' : form.expiresAt}
                        onChange={handleChange}
                        className="flex-1 rounded-2xl border border-white/10 bg-[#111827] px-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={setNeverExpiration}
                        className="rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-600 transition"
                      >
                        Never
                      </button>
                    </div>
                    {form.expiresAt === 'Never' && (
                      <span className="mt-2 block text-slate-400 text-xs">Expiration set to never.</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="submit" className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setMode('view')} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid gap-5">
                <div className="rounded-2xl border border-white/10 bg-[#0f1720] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2">Token</p>
                  <p className="font-mono text-slate-100 break-all">{selectedToken.token}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-[#0f1720] p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2">Backend</p>
                    <p className="text-slate-200">{selectedToken.backend}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#0f1720] p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2">Expiration</p>
                    <p className="text-slate-200">{selectedToken.date}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0f1720] p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mb-2">State</p>
                  <p className="text-slate-200 capitalize">{selectedToken.state}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-6">
              {mode !== 'edit' && (
                <>
                  <button onClick={startEdit} className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400">
                    Edit
                  </button>
                  <button onClick={() => deleteToken(selectedToken.id)} className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-400">
                    Delete
                  </button>
                </>
              )}
              <button onClick={closeDetailModal} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <div className="w-full max-w-2xl rounded-3xl bg-[#111827] border border-white/10 p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-[0.35em] mb-2">Create Token</p>
                <h3 className="text-white text-2xl font-black">Generate new token</h3>
              </div>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <label className="text-slate-300 text-sm font-semibold">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter token name"
                  className="w-full rounded-2xl border border-white/10 bg-[#0f1720] px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-slate-300 text-sm font-semibold">Token</label>
                <div className="flex gap-3">
                  <input
                    name="token"
                    value={form.token}
                    onChange={handleChange}
                    placeholder="Optional token string"
                    className="flex-1 rounded-2xl border border-white/10 bg-[#0f1720] px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={generateTokenValue}
                    className="rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-600 transition"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-slate-300 text-sm font-semibold">Backend URL</label>
                <input
                  name="backend"
                  value={form.backend}
                  onChange={handleChange}
                  placeholder="https://your-backend-url.com"
                  className="w-full rounded-2xl border border-white/10 bg-[#0f1720] px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-slate-300 text-sm font-semibold">Expire Date</label>
                <div className="flex gap-3 flex-col sm:flex-row">
                  <input
                    name="expiresAt"
                    type="date"
                    value={form.expiresAt === 'Never' ? '' : form.expiresAt}
                    onChange={handleChange}
                    className="flex-1 rounded-2xl border border-white/10 bg-[#0f1720] px-4 py-3 text-slate-100 outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={setNeverExpiration}
                    className="rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-600 transition"
                  >
                    Never
                  </button>
                </div>
                {form.expiresAt === 'Never' && (
                  <span className="text-slate-400 text-xs">Expiration set to never.</span>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400"
                >
                  Save Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
