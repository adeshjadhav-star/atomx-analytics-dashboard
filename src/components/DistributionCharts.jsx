import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts'

function fmt(v) {
  if (v >= 10000000) return '₹' + (v / 10000000).toFixed(2) + ' Cr'
  if (v >= 100000) return '₹' + (v / 100000).toFixed(2) + ' L'
  return '₹' + v.toLocaleString('en-IN')
}

function formatValue(value, isCount) {
  return isCount ? value.toLocaleString('en-IN') : fmt(value)
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]
  const isCount = d.payload.isCount
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '8px 12px',
      boxShadow: '0 14px 34px rgba(15,23,42,0.10)',
    }}>
      <p style={{ color: '#6B7280', fontSize: 11 }}>{d.name}</p>
      <p style={{ color: '#1F2A44', fontSize: 13, fontWeight: 700 }}>
        {isCount ? 'Count' : 'Amount'}: {formatValue(d.value, isCount)}
      </p>
      <p style={{ color: '#6B7280', fontSize: 11 }}>
        Percentage: {((d.percent ?? 0) * 100).toFixed(1)}%
      </p>
    </div>
  )
}

function CenterLabel({ viewBox, title, value }) {
  const { cx, cy } = viewBox ?? {}
  if (!cx || !cy) return null
  return (
    <g>
      <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="middle"
        style={{ fill: '#1F2A44', fontSize: 12, fontWeight: 700, letterSpacing: 0 }}>
        {title}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle"
        style={{ fill: '#1F2A44', fontSize: 11, fontWeight: 600, letterSpacing: 0 }}>
        Total: {value}
      </text>
    </g>
  )
}

function renderSliceLabel({ cx, cy, midAngle, outerRadius, name, percent }) {
  if (!percent || percent < 0.04) return null

  const radius = outerRadius + 18
  const RADIAN = Math.PI / 180
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{
        fill: '#1F2A44',
        fontSize: 11,
        fontWeight: 700,
        paintOrder: 'stroke',
        stroke: '#FFFFFF',
        strokeWidth: 3,
        letterSpacing: 0,
      }}
    >
      {name}
    </text>
  )
}

function DonutCard({ title, data, centerTitle, centerValue }) {
  return (
    <div className="card p-4 sm:p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-center" style={{ color: '#1F2A44' }}>
        {title}
      </h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="75%"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              label={renderSliceLabel}
              labelLine={false}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
              {centerValue && (
                <Label
                  content={<CenterLabel title={centerTitle} value={centerValue} />}
                  position="center"
                />
              )}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-4 gap-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs truncate" style={{ color: '#6B7280' }}>{d.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PieCard({ title, data }) {
  return (
    <div className="card p-4 sm:p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-center" style={{ color: '#1F2A44' }}>
        {title}
      </h3>
      <div style={{ width: '100%', height: 240 }}>
        <ResponsiveContainer width="100%" height="100%" debounce={1}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius="78%"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              label={renderSliceLabel}
              labelLine={false}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-1 min-[420px]:grid-cols-2 gap-x-4 gap-y-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-start gap-1.5 min-w-0">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0 mt-0.5" style={{ background: d.color }} />
            <div className="min-w-0">
              <p className="text-xs truncate" style={{ color: '#6B7280' }}>{d.name}</p>
              <p className="text-xs font-semibold text-num" style={{ color: '#1F2A44' }}>
                {fmt(d.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DistributionCharts({ data }) {
  const txnTotal = data.transactionsDistribution.reduce((s, d) => s + d.value, 0)
  const amtTotal = data.topupAmountDistribution.reduce((s, d) => s + d.value, 0)
  const hasTopupAmountDistribution = data.topupAmountDistribution.length > 0
  const hasTransactionsDistribution = data.transactionsDistribution.length > 0
  const hasTopupPaymentDistribution = data.topupPaymentDistribution.length > 0

  if (!hasTopupAmountDistribution && !hasTransactionsDistribution && !hasTopupPaymentDistribution) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {hasTopupAmountDistribution && (
        <DonutCard
          title="Topup Amount Distribution"
          data={data.topupAmountDistribution}
          centerTitle="TOTAL AMOUNT"
          centerValue={fmt(amtTotal)}
        />
      )}
      {hasTransactionsDistribution && (
        <DonutCard
          title="Transactions Distribution"
          data={data.transactionsDistribution.map((d) => ({ ...d, isCount: true }))}
          centerTitle="TRANSACTIONS"
          centerValue={txnTotal.toLocaleString()}
        />
      )}
      {hasTopupPaymentDistribution && (
        <PieCard
          title="Topup Distribution"
          data={data.topupPaymentDistribution}
        />
      )}
    </div>
  )
}
