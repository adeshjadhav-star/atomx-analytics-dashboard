import { motion } from 'framer-motion'

const chartData = [18, 42, 28, 58, 44, 72, 54, 82, 64, 88, 70, 92, 96]

function buildPath(data, w, h, pad = 10) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - pad - ((v - min) / range) * (h - pad * 2),
  }))
  let line = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cpx = (prev.x + curr.x) / 2
    line += ` C ${cpx} ${prev.y} ${cpx} ${curr.y} ${curr.x} ${curr.y}`
  }
  const area =
    line +
    ` L ${pts[pts.length - 1].x} ${h} L 0 ${h} Z`
  return { line, area, pts }
}

const miniStats = [
  { label: 'Requests', value: '94.7K', change: '+23%', up: true, color: 'blue' },
  { label: 'Users', value: '18.4K', change: '+8%', up: true, color: 'purple' },
  { label: 'Latency', value: '4.2ms', change: '-12%', up: false, color: 'cyan' },
]

const heroStats = [
  { value: '2.4M+', label: 'Events / sec' },
  { value: '<1ms', label: 'P99 Latency' },
  { value: '99.99%', label: 'Uptime SLA' },
]

export default function HeroSection() {
  const { line, area } = buildPath(chartData, 300, 90)

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* ── Left column ── */}
          <div>
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-blue-500/20 mb-8"
            >
              <span
                className="w-2 h-2 bg-green-400 rounded-full"
                style={{ animation: 'pulse-glow 2.5s ease-in-out infinite' }}
              />
              <span className="text-xs font-semibold text-blue-300 tracking-wide">
                LIVE API &nbsp;·&nbsp; 99.9% Uptime
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl lg:text-[4.25rem] font-black leading-[1.05] tracking-tight text-white mb-6"
            >
              Realtime&nbsp;
              <span className="text-gradient">Data Intelligence</span>
              <br />
              Platform
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.55 }}
              className="text-slate-400 text-lg leading-relaxed mb-10 max-w-[480px]"
            >
              Process millions of events per second with sub-millisecond latency.
              Enterprise-grade analytics powered by the DATA&nbsp;X API infrastructure.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.5 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 0 35px rgba(99,102,241,0.35)',
                }}
              >
                Start for Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.2)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-3.5 rounded-2xl glass border border-white/[0.1] text-white text-sm font-semibold transition-all flex items-center gap-2"
              >
                View API Docs
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </motion.div>

            {/* Hero stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex items-center gap-8"
            >
              {heroStats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-black text-white tracking-tight">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right column — floating analytics card ── */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="animate-float"
          >
            <div
              className="glass-strong rounded-3xl p-7 glow-border"
              style={{
                boxShadow:
                  '0 0 40px rgba(59,130,246,0.12), 0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-widest mb-1">
                    Live Analytics
                  </p>
                  <h3 className="text-white text-xl font-bold">Dashboard Overview</h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">Live</span>
                </div>
              </div>

              {/* SVG Chart */}
              <div className="relative mb-1 -mx-1">
                <svg
                  viewBox="0 0 300 90"
                  className="w-full h-[90px]"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="heroLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="heroAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>
                  <path d={area} fill="url(#heroAreaGrad)" />
                  <motion.path
                    d={line}
                    fill="none"
                    stroke="url(#heroLineGrad)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 1.8, ease: 'easeInOut' }}
                  />
                </svg>
              </div>

              {/* Mini stat tiles */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {miniStats.map((item) => (
                  <div
                    key={item.label}
                    className="glass rounded-xl p-3.5 border border-white/[0.05]"
                  >
                    <p className="text-slate-500 text-[11px] font-medium mb-1">{item.label}</p>
                    <p className="text-white text-base font-bold leading-none">{item.value}</p>
                    <p
                      className={`text-[11px] font-semibold mt-1.5 ${
                        item.label === 'Latency' ? 'text-green-400' : 'text-green-400'
                      }`}
                    >
                      {item.change}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
                  <span className="font-medium">System Load</span>
                  <span className="font-semibold text-blue-400">68%</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full progress-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '68%' }}
                    transition={{ delay: 1.2, duration: 1.4, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* API endpoint tag */}
              <div className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/15">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M3 4L1 6l2 2M9 4l2 2-2 2M7 2l-2 8"
                    stroke="#60a5fa"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[11px] font-mono text-blue-400 truncate">
                  https://dataxapi.atomx.in/v1/data
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
