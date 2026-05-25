import { motion } from 'framer-motion'
import atomxLogo from '../assets/AtomX_Logo.svg'
import { dateRanges } from '../services/api'

export default function DashboardNav({ config, onConfigChange, onGetData, loading, adminList }) {
  return (
    <div
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'rgba(255,255,255,0.9)',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 10px 30px rgba(15,23,42,0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mr-0 sm:mr-4">
          <img
            src={atomxLogo}
            alt="AtomX"
            className="h-10 w-auto flex-shrink-0"
          />
        </div>

        {/* Admin select */}
        <select
          value={config.admin}
          onChange={(e) => onConfigChange({ ...config, admin: e.target.value })}
          className="select-custom order-3 sm:order-none w-full sm:w-auto sm:flex-1 sm:min-w-[180px] sm:max-w-[280px] px-3 py-2 text-sm"
        >
          <option value="all">All</option>
          {adminList.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        {/* Date range select */}
        <select
          value={config.dateRange}
          onChange={(e) => onConfigChange({ ...config, dateRange: e.target.value })}
          className="select-custom order-4 sm:order-none w-full sm:w-auto sm:flex-1 sm:min-w-[140px] sm:max-w-[200px] px-3 py-2 text-sm"
        >
          {dateRanges.map((d) => (
            <option key={d.id} value={d.id}>{d.label}</option>
          ))}
        </select>

        {/* Get Data */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onGetData}
          disabled={loading}
          className="btn-primary order-5 sm:order-none w-full sm:w-auto justify-center px-5 py-2 text-sm flex items-center gap-2 flex-shrink-0"
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Loading…
            </>
          ) : (
            'Get Data'
          )}
        </motion.button>

      </div>
    </div>
  )
}
