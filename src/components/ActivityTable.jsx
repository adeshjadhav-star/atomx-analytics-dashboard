import { motion } from 'framer-motion'
import { activities } from '../data/activities'

const methodStyles = {
  GET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  POST: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
  PATCH: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
}

const statusConfig = {
  success: {
    dot: 'bg-green-400',
    label: 'Success',
    styles: 'bg-green-500/10 text-green-400 border-green-500/20',
  },
  pending: {
    dot: 'bg-amber-400',
    label: 'Pending',
    styles: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  error: {
    dot: 'bg-red-400',
    label: 'Error',
    styles: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
}

const cols = [
  { key: 'endpoint', label: 'Endpoint' },
  { key: 'method', label: 'Method' },
  { key: 'user', label: 'User / Origin' },
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'latency', label: 'Latency' },
  { key: 'requests', label: 'Requests' },
  { key: 'status', label: 'Status' },
]

export default function ActivityTable() {
  return (
    <section className="py-8 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h2 className="text-white text-xl font-bold">API Activity Log</h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Live request feed from{' '}
              <span className="text-blue-400 font-mono text-xs">dataxapi.atomx.in</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-white/[0.06] text-xs text-slate-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Live
            </div>
            <button className="px-4 py-2 rounded-xl glass border border-white/[0.06] text-slate-400 text-xs font-semibold hover:text-white hover:border-white/[0.12] transition-all">
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Table wrapper — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="glass-card rounded-3xl overflow-hidden"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse">
              <thead>
                <tr
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(59,130,246,0.04) 0%, rgba(168,85,247,0.04) 100%)',
                  }}
                >
                  {cols.map((col) => (
                    <th
                      key={col.key}
                      className="px-6 py-4 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest border-b border-white/[0.05] whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activities.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="group border-b border-white/[0.035] last:border-0 hover:bg-white/[0.025] transition-colors duration-150"
                  >
                    {/* Endpoint */}
                    <td className="px-6 py-4">
                      <code className="text-slate-200 text-xs font-mono font-medium group-hover:text-white transition-colors">
                        {row.endpoint}
                      </code>
                    </td>

                    {/* Method */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          methodStyles[row.method] || methodStyles.GET
                        }`}
                      >
                        {row.method}
                      </span>
                    </td>

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{
                            background: `hsl(${(row.user.charCodeAt(0) * 47) % 360}, 65%, 40%)`,
                          }}
                        >
                          {row.user[0].toUpperCase()}
                        </div>
                        <span className="text-slate-400 text-xs font-mono truncate max-w-[160px]">
                          {row.user}
                        </span>
                      </div>
                    </td>

                    {/* Timestamp */}
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-xs">{row.timestamp}</span>
                    </td>

                    {/* Latency */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold font-mono ${
                          parseInt(row.latency) < 20
                            ? 'text-green-400'
                            : parseInt(row.latency) < 80
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {row.latency}
                      </span>
                    </td>

                    {/* Requests */}
                    <td className="px-6 py-4">
                      <span className="text-slate-300 text-xs font-semibold font-mono">
                        {row.requests}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                          statusConfig[row.status].styles
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusConfig[row.status].dot} ${
                            row.status === 'pending' ? 'animate-pulse' : ''
                          }`}
                        />
                        {statusConfig[row.status].label}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-6 py-4 border-t border-white/[0.04] flex items-center justify-between">
            <p className="text-slate-600 text-xs">
              Showing <span className="text-slate-400 font-semibold">{activities.length}</span> recent
              events
            </p>
            <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
              View full log →
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
