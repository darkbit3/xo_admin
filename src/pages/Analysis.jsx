export default function Analysis() {
  return (
    <div className="space-y-6">
      <section className="bg-[#131c2e] border border-white/8 rounded-3xl p-8 shadow-xl shadow-black/20">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-slate-400 uppercase tracking-[0.35em] text-xs mb-2">Analytics Dashboard</p>
            <h2 className="text-white text-3xl font-black">Analysis</h2>
          </div>
          <span className="inline-flex items-center rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 border border-cyan-500/20">
            Live
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 mb-6">
          <div className="bg-[#0a1220] border border-white/10 rounded-3xl p-6">
            <p className="text-slate-400 text-sm uppercase tracking-[0.24em] mb-3">Total Plays</p>
            <p className="text-3xl font-black text-white">1.2K</p>
          </div>
          <div className="bg-[#0a1220] border border-white/10 rounded-3xl p-6">
            <p className="text-slate-400 text-sm uppercase tracking-[0.24em] mb-3">Win Rate</p>
            <p className="text-3xl font-black text-white">63%</p>
          </div>
          <div className="bg-[#0a1220] border border-white/10 rounded-3xl p-6">
            <p className="text-slate-400 text-sm uppercase tracking-[0.24em] mb-3">Avg. Session</p>
            <p className="text-3xl font-black text-white">4m 18s</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-[#0a1220] border border-white/10 rounded-3xl p-6">
            <p className="text-slate-400 text-sm mb-4">Top performance metrics for the most recent game sessions.</p>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li className="flex justify-between">
                <span>Peak users</span>
                <span className="font-semibold">420</span>
              </li>
              <li className="flex justify-between">
                <span>Completion rate</span>
                <span className="font-semibold">78%</span>
              </li>
              <li className="flex justify-between">
                <span>Retention</span>
                <span className="font-semibold">89%</span>
              </li>
            </ul>
          </div>
          <div className="bg-[#0a1220] border border-white/10 rounded-3xl p-6">
            <p className="text-slate-400 text-sm mb-4">Insights</p>
            <div className="space-y-4 text-slate-300 text-sm">
              <p>AI matches drove a 12% increase in user engagement over the last week.</p>
              <p>Most active time is between 18:00 and 21:00 UTC.</p>
              <p>New tokens converted 24% faster than average this month.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
