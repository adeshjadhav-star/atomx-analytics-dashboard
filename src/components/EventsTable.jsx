import { useState, useMemo } from 'react'

function fmt(v) {
  if (!v) return '0'
  return v.toLocaleString('en-IN')
}

const columns = [
  { key: 'id', label: 'Event ID', sortable: true },
  { key: 'name', label: 'Event Name', sortable: true },
  { key: 'venue', label: 'Venue', sortable: false },
  { key: 'activations', label: 'Activations', sortable: true },
  { key: 'txnCount', label: 'Txn Count', sortable: true },
  { key: 'topup', label: 'Topup', sortable: true },
  { key: 'sales', label: 'Sales', sortable: true },
  { key: 'pos', label: 'POS', sortable: true },
  { key: 'returns', label: 'Returns', sortable: true },
  { key: 'devices', label: 'Devices', sortable: true },
  { key: 'days', label: 'Days', sortable: true },
  { key: 'client', label: 'Client', sortable: false },
]

const SortIcon = ({ dir }) => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="inline ml-1 opacity-60">
    <path d="M5 1L5 11M2 4L5 1L8 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
      strokeLinejoin="round" opacity={dir === 'asc' ? 1 : 0.3} />
    <path d="M5 11L5 1M2 8L5 11L8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
      strokeLinejoin="round" opacity={dir === 'desc' ? 1 : 0.3} />
  </svg>
)

export default function EventsTable({ events }) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState({ key: 'id', dir: 'asc' })

  const handleSort = (key) => {
    setSort((s) => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (events ?? []).filter(
      (e) =>
        !q ||
        e.name.toLowerCase().includes(q) ||
        String(e.id).includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.client.toLowerCase().includes(q)
    )
  }, [events, query])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sort.key], bv = b[sort.key]
      if (typeof av === 'number') return sort.dir === 'asc' ? av - bv : bv - av
      return sort.dir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
  }, [filtered, sort])

  return (
    <div className="card" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      {/* Table header */}
      <div className="px-4 sm:px-5 py-4 flex items-start sm:items-center justify-between gap-3 sm:gap-4 flex-col sm:flex-row"
        style={{ borderBottom: '1px solid #E5E7EB' }}>
        <h3 className="font-bold text-base" style={{ color: '#1F2A44' }}>Events</h3>
        <div className="relative w-full sm:w-auto">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <circle cx="6" cy="6" r="4.5" stroke="#6B7280" strokeWidth="1.4" />
            <path d="M9.5 9.5L13 13" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search events…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm rounded-lg w-full sm:w-[220px]"
            style={{
              background: '#FCFAF7',
              border: '1px solid #D7DCE5',
              color: '#1F2A44',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div className="md:hidden divide-y" style={{ borderColor: 'rgba(226,232,240,0.85)' }}>
        {sorted.map((ev) => (
          <article key={ev.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-mono font-semibold" style={{ color: '#F26A21' }}>{ev.id}</p>
                <h4 className="text-sm font-bold leading-snug mt-1" style={{ color: '#1F2A44' }}>{ev.name}</h4>
                <p className="text-xs mt-1" style={{ color: '#6B7280' }}>{ev.venue}</p>
                <p className="text-xs capitalize" style={{ color: '#6B7280' }}>{ev.city}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-num" style={{ color: '#1F2A44' }}>{fmt(ev.topup)}</p>
                <p className="text-[11px]" style={{ color: '#6B7280' }}>Topup</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[
                ['Sales', ev.sales],
                ['Txn', ev.txnCount],
                ['Activations', ev.activations],
                ['Devices', ev.devices],
                ['Returns', ev.returns],
                ['Days', ev.days],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg p-3" style={{ background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                  <p className="text-[11px] uppercase font-semibold" style={{ color: '#6B7280' }}>{label}</p>
                  <p className="text-sm font-bold text-num mt-0.5" style={{ color: '#1F2A44' }}>{fmt(value)}</p>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3" style={{ color: '#6B7280' }}>{ev.dates}</p>
          </article>
        ))}
        {sorted.length === 0 && (
          <div className="px-4 py-12 text-center text-sm" style={{ color: '#6B7280' }}>
            No events found matching "{query}"
          </div>
        )}
      </div>

      {/* Scrollable table */}
      <div className="hidden md:block" style={{ overflowX: 'auto' }}>
        <table className="w-full min-w-[1100px] border-collapse">
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap"
                  style={{
                    color: sort.key === col.key ? '#F26A21' : '#6B7280',
                    cursor: col.sortable ? 'pointer' : 'default',
                    borderBottom: '1px solid #E5E7EB',
                    userSelect: 'none',
                  }}
                >
                  {col.label}
                  {col.sortable && (
                    <SortIcon dir={sort.key === col.key ? sort.dir : null} />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((ev, i) => (
              <tr
                key={ev.id}
                style={{
                  borderBottom: i < sorted.length - 1 ? '1px solid rgba(226,232,240,0.9)' : 'none',
                  transition: 'background 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(15,23,42,0.025)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-4 py-3.5">
                  <span className="text-sm font-mono font-semibold" style={{ color: '#1F2A44' }}>{ev.id}</span>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-semibold leading-tight" style={{ color: '#1F2A44' }}>{ev.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{ev.dates}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm" style={{ color: '#1F2A44' }}>{ev.venue}</p>
                  <p className="text-xs capitalize" style={{ color: '#6B7280' }}>{ev.city}</p>
                </td>
                <td className="px-4 py-3.5 text-sm text-num" style={{ color: '#1F2A44' }}>{fmt(ev.activations)}</td>
                <td className="px-4 py-3.5 text-sm text-num" style={{ color: '#1F2A44' }}>{fmt(ev.txnCount)}</td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-semibold text-num" style={{ color: '#1F2A44' }}>{fmt(ev.topup)}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Count : {fmt(ev.topupCount)}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-semibold text-num" style={{ color: '#1F2A44' }}>{fmt(ev.sales)}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Count : {fmt(ev.salesCount)}</p>
                </td>
                <td className="px-4 py-3.5 text-sm text-num" style={{ color: '#1F2A44' }}>{fmt(ev.pos)}</td>
                <td className="px-4 py-3.5">
                  <p className="text-sm text-num" style={{ color: '#1F2A44' }}>{fmt(ev.returns)}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>Count : {fmt(ev.returnsCount)}</p>
                </td>
                <td className="px-4 py-3.5 text-sm text-num" style={{ color: '#1F2A44' }}>{fmt(ev.devices)}</td>
                <td className="px-4 py-3.5 text-sm text-num" style={{ color: '#1F2A44' }}>{fmt(ev.days)}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: '#6B7280' }}>{ev.client}</td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-sm" style={{ color: '#6B7280' }}>
                  No events found matching "{query}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 sm:px-5 py-3 text-xs" style={{ borderTop: '1px solid #E5E7EB', color: '#6B7280' }}>
        {sorted.length} of {events?.length ?? 0} events
      </div>
    </div>
  )
}
