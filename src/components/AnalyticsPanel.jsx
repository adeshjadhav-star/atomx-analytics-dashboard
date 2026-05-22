import { motion } from 'framer-motion'

const performanceMetrics = [
  {
    label: 'CPU Utilization',
    value: 68,
    display: '68%',
    gradClass: 'progress-gradient',
    color: '#60a5fa',
  },
  {
    label: 'Memory Usage',
    value: 52,
    display: '52%',
    gradClass: 'progress-gradient-cyan',
    color: '#22d3ee',
  },
  {
    label: 'Network Throughput',
    value: 83,
    display: '83%',
    gradClass: 'progress-gradient-green',
    color: '#4ade80',
  },
]

const metricTiles = [
  {
    label: 'Traffic Load',
    value: '4.7 GB/s',
    subtext: 'Peak bandwidth',
    trend: '+18%',
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 14V4M5 8l4-4 4 4" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 14h12" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.18)',
  },
  {
    label: 'API Latency',
    value: '4.2 ms',
    subtext: 'P99 response time',
    trend: '-12%',
    trendUp: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="#a78bfa" strokeWidth="1.7" />
        <path d="M9 5.5V9l2.5 2" stroke="#a78bfa" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: 'rgba(167,139,250,0.08)',
    border: 'rgba(167,139,250,0.18)',
  },
  {
    label: 'Data Sync',
    value: '99.8%',
    subtext: 'Replica consistency',
    trend: '+0.2%',
    trendUp: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M14 4.5A6.5 6.5 0 0 0 4 9.5" stroke="#4ade80" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M4 13.5A6.5 6.5 0 0 0 14 8.5" stroke="#4ade80" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M14 2v3h-3M4 16v-3h3" stroke="#4ade80" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.18)',
  },
]

export default function AnalyticsPanel() {
  return (
    <section className="py-8 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-3xl overflow-hidden"
          style={{
            boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
          }}
        >
          {/* Top bar */}
          <div
            className="px-8 py-5 border-b border-white/[0.06] flex items-center justify-between"
            style={{
              background:
                'linear-gradient(90deg, rgba(59,130,246,0.04) 0%, rgba(168,85,247,0.04) 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.15)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 11l3-4 3 2.5 3-5L14 8"
                    stroke="#818cf8"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M2 14h12" stroke="#818cf8" strokeWidth="1.4" strokeLinecap="round" opacity="0.4" />
                </svg>
              </div>
              <div>
                <h2 className="text-white text-base font-bold">Realtime Performance</h2>
                <p className="text-slate-500 text-xs">System resource utilization · updated live</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span
                className="w-1.5 h-1.5 bg-green-400 rounded-full"
                style={{ animation: 'pulse-glow 2.5s ease-in-out infinite' }}
              />
              <span className="font-medium">All systems operational</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 grid lg:grid-cols-[1fr_auto] gap-10">
            {/* Left — progress bars */}
            <div className="space-y-6">
              {performanceMetrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-slate-300 text-sm font-medium">{metric.label}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: metric.color }}
                    >
                      {metric.display}
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${metric.gradClass} rounded-full relative`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.value}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 1.3, ease: 'easeOut' }}
                    >
                      <span className="shimmer-line absolute inset-0 rounded-full" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}

              {/* API endpoint info */}
              <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-2">
                  Data Source
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                  <code className="text-blue-400 text-xs font-mono">
                    https://dataxapi.atomx.in/v1/data
                  </code>
                </div>
                <p className="text-slate-600 text-[11px] mt-1.5">
                  Polling interval: <span className="text-slate-400">500ms</span> &nbsp;·&nbsp;
                  Protocol: <span className="text-slate-400">WebSocket / REST</span>
                </p>
              </div>
            </div>

            {/* Right — metric tiles */}
            <div className="flex lg:flex-col gap-4 lg:gap-4 flex-wrap">
              {metricTiles.map((tile, i) => (
                <motion.div
                  key={tile.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.04 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.45 }}
                  className="flex-1 lg:flex-none lg:w-52 p-5 rounded-2xl border transition-all duration-200 cursor-default"
                  style={{ background: tile.bg, borderColor: tile.border }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      {tile.icon}
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        tile.label === 'API Latency'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}
                    >
                      {tile.trend}
                    </span>
                  </div>
                  <p className="text-white text-xl font-black tracking-tight leading-none">
                    {tile.value}
                  </p>
                  <p className="text-slate-400 text-xs font-medium mt-1.5">{tile.label}</p>
                  <p className="text-slate-600 text-[11px] mt-0.5">{tile.subtext}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
