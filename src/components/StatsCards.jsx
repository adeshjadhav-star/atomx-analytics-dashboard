import { motion } from 'framer-motion'
import { statsCards } from '../data/cards'

function buildSparkPath(data, w = 100, h = 36) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - 2 - ((v - min) / range) * (h - 4),
  }))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const cp = pts[i - 1].x + (pts[i].x - pts[i - 1].x) / 2
    d += ` C ${cp} ${pts[i - 1].y} ${cp} ${pts[i].y} ${pts[i].x} ${pts[i].y}`
  }
  return d
}

const colorMap = {
  blue: {
    icon: 'rgba(59,130,246,0.15)',
    iconStroke: '#60a5fa',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    gradFrom: '#3b82f6',
    gradTo: '#60a5fa',
    glow: 'card-glow-blue',
  },
  purple: {
    icon: 'rgba(168,85,247,0.15)',
    iconStroke: '#c084fc',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    gradFrom: '#8b5cf6',
    gradTo: '#c084fc',
    glow: 'card-glow-purple',
  },
  cyan: {
    icon: 'rgba(6,182,212,0.15)',
    iconStroke: '#22d3ee',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    gradFrom: '#06b6d4',
    gradTo: '#22d3ee',
    glow: 'card-glow-cyan',
  },
  green: {
    icon: 'rgba(34,197,94,0.15)',
    iconStroke: '#4ade80',
    badge: 'bg-green-500/10 text-green-400 border-green-500/20',
    gradFrom: '#22c55e',
    gradTo: '#4ade80',
    glow: 'card-glow-green',
  },
}

const CardIcons = {
  blue: (stroke) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 14l4-5 3 3 4-6 3 4" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17h14" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  purple: (stroke) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="7" r="3" stroke={stroke} strokeWidth="1.8" />
      <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  cyan: (stroke) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M5 5l3 3M12 5l3 3M5 15l3-3M12 15l3-3" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      <rect x="7.5" y="7.5" width="5" height="5" rx="1.5" stroke={stroke} strokeWidth="1.7" />
    </svg>
  ),
  green: (stroke) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10c0-3.3 2-6 4.5-7l1 3c-1.5.8-2.5 2.3-2.5 4s1 3.2 2.5 4l-1 3C5 15.9 3 13.3 3 10Z" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M17 10c0 3.3-2 6-4.5 7l-1-3c1.5-.8 2.5-2.3 2.5-4s-1-3.2-2.5-4l1-3C15 4.1 17 6.7 17 10Z" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="10" cy="10" r="2" stroke={stroke} strokeWidth="1.7" />
    </svg>
  ),
}

export default function StatsCards() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-slate-700" />
          <span className="text-slate-500 text-xs font-semibold uppercase tracking-widest">
            Platform Metrics
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {statsCards.map((card, i) => {
            const c = colorMap[card.colorClass]
            const sparkPath = buildSparkPath(card.sparkData)
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 ${c.glow} group`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: c.icon }}
                  >
                    {CardIcons[card.colorClass](c.iconStroke)}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${c.badge}`}
                  >
                    {card.growth}
                  </span>
                </div>

                {/* Title */}
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  {card.title}
                </p>

                {/* Big value */}
                <p className="text-white text-3xl font-black tracking-tight leading-none mb-1">
                  {card.value}
                </p>

                {/* Description */}
                <p className="text-slate-500 text-xs font-medium mb-5">{card.description}</p>

                {/* Sparkline */}
                <div className="relative">
                  <svg
                    viewBox="0 0 100 36"
                    className="w-full h-9 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id={`spark-${card.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor={c.gradFrom} />
                        <stop offset="100%" stopColor={c.gradTo} />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d={sparkPath}
                      fill="none"
                      stroke={`url(#spark-${card.id})`}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 1.4, ease: 'easeOut' }}
                    />
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
