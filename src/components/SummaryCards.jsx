import { motion } from 'framer-motion'

function fmt(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr'
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L'
  if (n >= 1000) return '₹' + n.toLocaleString('en-IN')
  return n.toLocaleString('en-IN')
}

const cardDefs = [
  {
    key: 'events',
    label: 'EVENTS',
    format: (v) => v.toLocaleString(),
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="15" rx="2.5" stroke="white" strokeWidth="1.7" />
        <path d="M7 2v4M15 2v4M2 9h18" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M6 14h4M6 17h7" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
    bg: 'linear-gradient(135deg, #172033, #334155)',
    shadow: 'rgba(15,23,42,0.18)',
  },
  {
    key: 'topups',
    label: 'TOPUPS',
    format: fmt,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3L19 8V14L11 19L3 14V8L11 3Z" stroke="white" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M11 3V19M3 8L11 13L19 8M11 13V19" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
    bg: 'linear-gradient(135deg, #1E3A5F, #2563EB)',
    shadow: 'rgba(37,99,235,0.18)',
  },
  {
    key: 'sales',
    label: 'SALES',
    format: fmt,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 16l5-6 4 3.5 5-8 3 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 19h16" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    bg: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
    shadow: 'rgba(124,58,237,0.18)',
  },
  {
    key: 'pos',
    label: 'POS',
    format: fmt,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="5" width="18" height="12" rx="2.5" stroke="white" strokeWidth="1.7" />
        <path d="M6 9h10M6 13h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <circle cx="16" cy="13" r="1.5" fill="white" opacity="0.7" />
      </svg>
    ),
    bg: 'linear-gradient(135deg, #0F766E, #14B8A6)',
    shadow: 'rgba(20,184,166,0.18)',
  },
  {
    key: 'days',
    label: 'DAYS',
    format: (v) => v.toLocaleString(),
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8.5" stroke="white" strokeWidth="1.7" />
        <path d="M11 6V11L14.5 13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    bg: 'linear-gradient(135deg, #374151, #64748B)',
    shadow: 'rgba(71,85,105,0.18)',
  },
]

export default function SummaryCards({ data }) {
  return (
    <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
      {cardDefs.map((def, i) => (
        <motion.div
          key={def.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.4 }}
          className="card-hover p-4 sm:p-5 flex items-center gap-3 sm:gap-4 min-w-0"
        >
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: def.bg,
              boxShadow: `0 10px 24px ${def.shadow}`,
            }}
          >
            {def.icon}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#6B7280' }}>
              {def.label}
            </p>
            <p className="text-base sm:text-lg font-black tracking-tight text-num truncate" style={{ color: '#1F2A44' }}>
              {data ? def.format(data[def.key]) : '—'}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
