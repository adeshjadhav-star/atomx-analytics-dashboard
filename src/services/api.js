const API_URL = 'https://dataxapi.atomx.in/v1/data'

const COLORS = ['#2563EB', '#14B8A6', '#7C3AED', '#64748B', '#22C55E', '#06B6D4', '#F26A21']

const DATE_RANGE_MAP = {
  fy2324: ['2023-04-01', '2024-03-31'],
  fy2223: ['2022-04-01', '2023-03-31'],
  fy2122: ['2021-04-01', '2022-03-31'],
  fy2021: ['2020-04-01', '2021-03-31'],
  fy1920: ['2019-04-01', '2020-03-31'],
  fy1819: ['2018-04-01', '2019-03-31'],
  all: ['2017-01-01', new Date().toISOString().slice(0, 10)],
}

export const dateRanges = [
  { id: 'fy2324', label: 'FY-(2023-24)' },
  { id: 'fy2223', label: 'FY-(2022-23)' },
  { id: 'fy2122', label: 'FY-(2021-22)' },
  { id: 'fy2021', label: 'FY-(2020-21)' },
  { id: 'fy1920', label: 'FY-(2019-20)' },
  { id: 'fy1819', label: 'FY-(2018-19)' },
  { id: 'all', label: 'All Time' },
]

function asNumber(value) {
  const number = Number(value ?? 0)
  return Number.isFinite(number) ? number : 0
}

function pick(source, keys, fallback = undefined) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key]
  }
  return fallback
}

function normalizeEvent(item) {
  const id = pick(item, ['id', 'eventId', 'event_id', 'event', 'eventID'], '')
  const startDate = pick(item, ['startDate', 'start_date', 'fromDate', 'from_date', 'start'], '')
  const endDate = pick(item, ['endDate', 'end_date', 'toDate', 'to_date', 'end'], '')
  const dates = pick(item, ['dates', 'dateRange', 'date_range'], startDate && endDate ? `${startDate} to ${endDate}` : '')

  return {
    id,
    name: pick(item, ['name', 'eventName', 'event_name', 'event'], `Event ${id}`),
    venue: pick(item, ['venue', 'venueName', 'venue_name'], ''),
    city: pick(item, ['city', 'location', 'location_city'], ''),
    dates,
    activations: asNumber(pick(item, ['activations', 'activationCount', 'activation_count'])),
    txnCount: asNumber(pick(item, ['txnCount', 'txn_count', 'transactionCount', 'transaction_count', 'transactions'])),
    topup: asNumber(pick(item, ['topup', 'topups', 'topupAmount', 'topup_amount', 'totalTopup'])),
    topupCount: asNumber(pick(item, ['topupCount', 'topup_count', 'topups_count'])),
    sales: asNumber(pick(item, ['sales', 'salesAmount', 'sales_amount', 'totalSales'])),
    salesCount: asNumber(pick(item, ['salesCount', 'sales_count'])),
    pos: asNumber(pick(item, ['pos', 'posAmount', 'pos_amount'])),
    returns: asNumber(pick(item, ['returns', 'returnAmount', 'return_amount'])),
    returnsCount: asNumber(pick(item, ['returnsCount', 'returns_count', 'returnCount', 'return_count'])),
    breakage: asNumber(pick(item, ['breakage', 'breakageAmount', 'breakage_amount'])),
    breakageCount: asNumber(pick(item, ['breakageCount', 'breakage_count'])),
    devices: asNumber(pick(item, ['devices', 'deviceCount', 'device_count'])),
    days: asNumber(pick(item, ['days', 'eventDays', 'event_days', 'dates'])),
    client: pick(item, ['client', 'clientName', 'client_name', 'admin'], ''),
  }
}

function sum(events, key) {
  return events.reduce((total, event) => total + asNumber(event[key]), 0)
}

function mapByEvent(events, key, valueKey) {
  return events.map((event) => ({
    event: String(event.id),
    [valueKey]: asNumber(event[key]),
  }))
}

function mergeSeries(items, valueKey) {
  const byEvent = new Map()

  for (const item of items) {
    const event = String(item.event ?? '')
    if (!event) continue
    byEvent.set(event, (byEvent.get(event) ?? 0) + asNumber(item[valueKey]))
  }

  return Array.from(byEvent, ([event, value]) => ({
    event,
    [valueKey]: value,
  }))
}

function mergeDistributions(items) {
  const byName = new Map()

  for (const item of items) {
    const name = String(item.name ?? '')
    if (!name) continue

    const existing = byName.get(name)
    byName.set(name, {
      name,
      value: (existing?.value ?? 0) + asNumber(item.value),
      color: existing?.color ?? item.color ?? COLORS[byName.size % COLORS.length],
    })
  }

  return Array.from(byName.values())
}

function mergeDashboardData(results) {
  const dataSets = results.map((result) => result.data)
  const events = dataSets.flatMap((data) => data.events ?? [])

  return {
    summary: {
      events: dataSets.reduce((total, data) => total + asNumber(data.summary?.events), 0),
      topups: dataSets.reduce((total, data) => total + asNumber(data.summary?.topups), 0),
      sales: dataSets.reduce((total, data) => total + asNumber(data.summary?.sales), 0),
      pos: dataSets.reduce((total, data) => total + asNumber(data.summary?.pos), 0),
      days: dataSets.reduce((total, data) => total + asNumber(data.summary?.days), 0),
    },
    topupByEvent: mergeSeries(dataSets.flatMap((data) => data.topupByEvent ?? []), 'amount'),
    txnCountByEvent: mergeSeries(dataSets.flatMap((data) => data.txnCountByEvent ?? []), 'count'),
    devicesByEvent: mergeSeries(dataSets.flatMap((data) => data.devicesByEvent ?? []), 'count'),
    activationsByEvent: mergeSeries(dataSets.flatMap((data) => data.activationsByEvent ?? []), 'count'),
    topupAmountDistribution: mergeDistributions(dataSets.flatMap((data) => data.topupAmountDistribution ?? [])),
    transactionsDistribution: mergeDistributions(dataSets.flatMap((data) => data.transactionsDistribution ?? [])),
    topupPaymentDistribution: mergeDistributions(dataSets.flatMap((data) => data.topupPaymentDistribution ?? [])),
    events,
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = []

  for (let index = 0; index < items.length; index += limit) {
    const batch = items.slice(index, index + limit)
    results.push(...await Promise.all(batch.map(mapper)))
  }

  return results
}

function normalizeDistribution(items, fallbackNames = []) {
  if (!Array.isArray(items)) return []

  return items.map((item, index) => ({
    name: String(pick(item, ['name', 'label', 'type', 'mode', 'invoice'], fallbackNames[index] ?? `Item ${index + 1}`)),
    value: asNumber(pick(item, ['value', 'amount', 'count', 'total'])),
    color: pick(item, ['color'], COLORS[index % COLORS.length]),
  }))
}

function normalizeDistributionByNames(items, allowedNames, fallbackNames = allowedNames) {
  const allowed = new Map(allowedNames.map((name) => [name.toLowerCase(), name]))

  return normalizeDistribution(items, fallbackNames)
    .map((item) => {
      const rawName = item.name.toLowerCase()
      const name =
        rawName === 'topup' || rawName === 'topups'
          ? allowed.get('topups') ?? allowed.get('topup')
          : rawName === 'sale' || rawName === 'sales'
            ? allowed.get('sales')
            : rawName === 'return' || rawName === 'returns'
              ? allowed.get('returns')
              : rawName === 'breakage' || rawName === 'breakages'
                ? allowed.get('breakage')
                : item.name
      const displayName = allowed.get(name.toLowerCase())
      return displayName ? { ...item, name: displayName } : item
    })
    .filter((item) => allowed.has(item.name.toLowerCase()))
}

function nonZeroDistribution(items) {
  return items.filter((item) => asNumber(item.value) > 0)
}

function remainingValue(total, used) {
  return Math.max(asNumber(total) - asNumber(used), 0)
}

function breakageAmount(events) {
  const explicit = sum(events, 'breakage')
  if (explicit > 0) return explicit

  return remainingValue(sum(events, 'topup'), sum(events, 'sales') + sum(events, 'returns'))
}

function breakageCount(events) {
  const explicit = sum(events, 'breakageCount')
  if (explicit > 0) return explicit

  return remainingValue(
    sum(events, 'txnCount'),
    sum(events, 'salesCount') + sum(events, 'topupCount') + sum(events, 'returnsCount')
  )
}

function withBreakageSlice(items, value) {
  if (items.some((item) => item.name.toLowerCase() === 'breakage')) return items
  if (value <= 0) return items

  return [
    ...items,
    { name: 'Breakage', value, color: '#7C3AED' },
  ]
}

function deriveTopupAmountDistribution(events) {
  if (!events.length) return []

  return nonZeroDistribution([
    { name: 'Topup', value: sum(events, 'topup'), color: '#2563EB' },
    { name: 'Sales', value: sum(events, 'sales'), color: '#14B8A6' },
    { name: 'Returns', value: sum(events, 'returns'), color: '#64748B' },
    { name: 'Breakage', value: breakageAmount(events), color: '#7C3AED' },
  ])
}

function deriveTransactionsDistribution(events) {
  if (!events.length) return []

  return nonZeroDistribution([
    { name: 'Sales', value: sum(events, 'salesCount'), color: '#2563EB' },
    { name: 'Topups', value: sum(events, 'topupCount'), color: '#14B8A6' },
    { name: 'Returns', value: sum(events, 'returnsCount'), color: '#64748B' },
    { name: 'Breakage', value: breakageCount(events), color: '#7C3AED' },
  ])
}

function unwrapPayload(json) {
  return json?.data ?? json?.result ?? json?.payload ?? json
}

function normalizeDashboardData(json) {
  const payload = unwrapPayload(json)
  const source = typeof json === 'object' && json !== null ? json : payload
  const rawEvents = pick(payload, ['events', 'eventData', 'event_data', 'rows', 'records'], Array.isArray(payload) ? payload : [])
  const events = Array.isArray(rawEvents) ? rawEvents.map(normalizeEvent) : []
  const summarySource = payload?.summary ?? source?.summary ?? {}

  if (!events.length && payload?.summary && payload?.topupByEvent) {
    return payload
  }

  const topupAmountDistribution = normalizeDistributionByNames(
    pick(source, ['topupAmountDistribution', 'topup_amount_distribution']),
    ['Topup', 'Sales', 'Returns', 'Breakage']
  )
  const transactionsDistribution = normalizeDistributionByNames(
    pick(source, ['transactionsDistribution', 'transactions_distribution']),
    ['Sales', 'Topups', 'Returns', 'Breakage']
  )

  return {
    summary: {
      events: asNumber(pick(source, ['eventsCount', 'eventCount', 'totalEvents'], events.length)),
      topups: asNumber(pick(summarySource, ['topups', 'topup'], sum(events, 'topup'))),
      sales: asNumber(pick(summarySource, ['sales'], sum(events, 'sales'))),
      pos: asNumber(pick(summarySource, ['pos'], sum(events, 'pos'))),
      days: asNumber(pick(summarySource, ['days', 'dates'], sum(events, 'days'))),
    },
    topupByEvent: pick(source, ['topupByEvent', 'topup_by_event'], mapByEvent(events, 'topup', 'amount')),
    txnCountByEvent: pick(source, ['txnCountByEvent', 'txn_count_by_event'], mapByEvent(events, 'txnCount', 'count')),
    devicesByEvent: pick(source, ['devicesByEvent', 'devices_by_event'], mapByEvent(events, 'devices', 'count')),
    activationsByEvent: pick(source, ['activationsByEvent', 'activations_by_event'], mapByEvent(events, 'activations', 'count')),
    topupAmountDistribution: topupAmountDistribution.length
      ? withBreakageSlice(topupAmountDistribution, breakageAmount(events))
      : deriveTopupAmountDistribution(events),
    transactionsDistribution: transactionsDistribution.length
      ? withBreakageSlice(transactionsDistribution, breakageCount(events))
      : deriveTransactionsDistribution(events),
    topupPaymentDistribution: normalizeDistribution(
      pick(source, ['topupPaymentDistribution', 'topup_payment_distribution', 'paymentDistribution', 'payment_distribution', 'dataTopup']),
      ['CASH', 'CARD', 'COUPON', 'COMP']
    ),
    events,
  }
}

export async function fetchDashboardData(adminId, dateRangeId) {
  const [startDate, endDate] = DATE_RANGE_MAP[dateRangeId] ?? DATE_RANGE_MAP.fy2324

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: JSON.stringify({
      route: 'get_data',
      admin: adminId && adminId !== 'all' ? adminId : 'all',
      start: `${startDate} 12:00:00`,
      end: `${endDate} 12:00:01`,
    }),
  })
  if (!res.ok) {
    let message = `API request failed with HTTP ${res.status}`

    try {
      const body = await res.json()
      message = body?.message ? `${message}: ${body.message}` : message
    } catch {
      const body = await res.text().catch(() => '')
      message = body ? `${message}: ${body}` : message
    }

    throw new Error(message)
  }

  const data = normalizeDashboardData(await res.json())
  return { data, live: true }
}

export async function fetchDashboardDataForSelection(adminId, dateRangeId, admins = []) {
  if (adminId !== 'all') {
    return fetchDashboardData(adminId, dateRangeId)
  }

  const adminIds = admins
    .map((admin) => admin.id)
    .filter((id) => id && id !== 'all')

  if (!adminIds.length) {
    return fetchDashboardData(adminId, dateRangeId)
  }

  const results = await mapWithConcurrency(
    adminIds,
    4,
    (id) => fetchDashboardData(id, dateRangeId)
  )

  return {
    data: mergeDashboardData(results),
    live: true,
  }
}

export async function fetchAdminList() {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: JSON.stringify({ route: 'get_admins' }),
  })

  if (!res.ok) throw new Error(`Admin API request failed with HTTP ${res.status}`)

  const json = await res.json()
  const payload = unwrapPayload(json)

  if (!Array.isArray(payload)) {
    throw new Error('Admin API response did not include an admin list')
  }

  return {
    admins: payload.map((admin) => ({
      id: admin.id ?? admin.value,
      name: admin.name ?? admin.label,
    })),
    live: true,
  }
}
