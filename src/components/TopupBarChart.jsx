import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

function fmtY(v) {
  if (v >= 1000000) return (v / 100000).toFixed(0) + 'L'
  if (v >= 100000) return (v / 100000).toFixed(1) + 'L'
  if (v >= 1000) return (v / 1000).toFixed(0) + 'K'
  return v
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: 8,
        padding: '8px 12px',
        boxShadow: '0 14px 34px rgba(15,23,42,0.10)',
      }}
    >
      <p style={{ color: '#6B7280', fontSize: 11, marginBottom: 2 }}>Event {label}</p>
      <p style={{ color: '#1F2A44', fontSize: 13, fontWeight: 700 }}>
        ₹{Number(payload[0].value).toLocaleString('en-IN')}
      </p>
    </div>
  )
}

export default function TopupBarChart({ data, title, subtitle }) {
  const total = data?.reduce((s, d) => s + d.amount, 0) ?? 0

  return (
    <div
      className="card p-4 sm:p-6"
      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
    >
      <div className="mb-5">
        <h3 className="font-bold text-base" style={{ color: '#1F2A44' }}>{title}</h3>
        <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
          Total Transactions : ₹{total.toLocaleString('en-IN')}
        </p>
        {subtitle && <p className="text-xs" style={{ color: '#6B7280' }}>{subtitle}</p>}
      </div>

      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ width: Math.max(320, (data?.length ?? 0) * 38), minWidth: '100%' }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                vertical={false}
                stroke="rgba(148,163,184,0.24)"
              />
              <XAxis
                dataKey="event"
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmtY}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={42}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242,106,33,0.06)' }} />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {data?.map((_, i) => (
                  <Cell key={i} fill="#F26A21" fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-2 justify-center">
        <span className="w-3 h-3 rounded-sm" style={{ background: '#F26A21' }} />
        <span className="text-xs" style={{ color: '#6B7280' }}>Events</span>
      </div>
    </div>
  )
}
