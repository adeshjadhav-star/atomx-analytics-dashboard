import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

function fmtY(v) {
  if (v >= 1000) return (v / 1000).toFixed(0) + 'K'
  return v
}

function CustomTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      padding: '8px 12px',
      boxShadow: '0 14px 34px rgba(15,23,42,0.10)',
    }}>
      <p style={{ color: '#6B7280', fontSize: 11 }}>Event {label}</p>
      <p style={{ color: '#1F2A44', fontSize: 13, fontWeight: 700 }}>
        {Number(payload[0].value).toLocaleString()} {unit}
      </p>
    </div>
  )
}

function MiniBarChart({ data, dataKey, color, title, total, unit, legend }) {
  return (
    <div className="card p-4 sm:p-5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <h3 className="font-semibold text-sm mb-0.5" style={{ color: '#1F2A44' }}>{title}</h3>
      <p className="text-xs mb-4" style={{ color: '#6B7280' }}>
        Total {title} : {total.toLocaleString()}
      </p>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <div style={{ width: Math.max(300, data.length * 34), minWidth: '100%' }}>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }} barCategoryGap="35%">
              <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.24)" />
              <XAxis
                dataKey="event"
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmtY}
                tick={{ fill: '#6B7280', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                content={(props) => <CustomTooltip {...props} unit={unit} />}
                cursor={{ fill: 'rgba(15,23,42,0.035)' }}
              />
              <Bar dataKey={dataKey} radius={[3, 3, 0, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={color} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 justify-center">
        <span className="w-3 h-3 rounded-sm" style={{ background: color }} />
        <span className="text-xs" style={{ color: '#6B7280' }}>{legend}</span>
      </div>
    </div>
  )
}

export default function CountCharts({ data }) {
  const totalTxn = data.txnCountByEvent.reduce((s, d) => s + d.count, 0)
  const totalDev = data.devicesByEvent.reduce((s, d) => s + d.count, 0)
  const totalAct = data.activationsByEvent.reduce((s, d) => s + d.count, 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
      <MiniBarChart
        data={data.txnCountByEvent}
        dataKey="count"
        color="#2563EB"
        title="Transaction Count"
        total={totalTxn}
        unit="txns"
        legend="Transactions"
      />
      <MiniBarChart
        data={data.devicesByEvent}
        dataKey="count"
        color="#14B8A6"
        title="Devices Count"
        total={totalDev}
        unit="devices"
        legend="Devices"
      />
      <MiniBarChart
        data={data.activationsByEvent}
        dataKey="count"
        color="#7C3AED"
        title="Activation Count"
        total={totalAct}
        unit="activations"
        legend="Activations"
      />
    </div>
  )
}
