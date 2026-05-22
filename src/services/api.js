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

function normalizeDistribution(items, fallbackNames = []) {
  if (!Array.isArray(items)) return []

  return items.map((item, index) => ({
    name: String(pick(item, ['name', 'label', 'type', 'mode', 'invoice'], fallbackNames[index] ?? `Item ${index + 1}`)),
    value: asNumber(pick(item, ['value', 'amount', 'count', 'total'])),
    color: pick(item, ['color'], COLORS[index % COLORS.length]),
  }))
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
    topupAmountDistribution: normalizeDistribution(
      pick(source, ['topupAmountDistribution', 'topup_amount_distribution']),
      ['Topup', 'Sales', 'Returns', 'Breakage']
    ),
    transactionsDistribution: normalizeDistribution(
      pick(source, ['transactionsDistribution', 'transactions_distribution']),
      ['Sales', 'Topups', 'Returns', 'Breakage']
    ),
    topupPaymentDistribution: normalizeDistribution(
      pick(source, ['topupPaymentDistribution', 'topup_payment_distribution', 'paymentDistribution', 'payment_distribution', 'dataTopup']),
      ['CASH', 'CARD', 'COUPON', 'COMP']
    ),
    events,
  }
}

function withFallbackDistributions(data) {
  return {
    ...data,
    topupAmountDistribution: data.topupAmountDistribution.length
      ? data.topupAmountDistribution
      : [
          { name: 'Topup', value: data.summary.topups, color: '#2563EB' },
          { name: 'Sales', value: data.summary.sales, color: '#14B8A6' },
          { name: 'Returns', value: sum(data.events, 'returns'), color: '#64748B' },
        ],
    transactionsDistribution: data.transactionsDistribution.length
      ? data.transactionsDistribution
      : [
          { name: 'Transactions', value: sum(data.events, 'txnCount'), color: '#2563EB' },
          { name: 'Topups', value: sum(data.events, 'topupCount'), color: '#14B8A6' },
          { name: 'Sales', value: sum(data.events, 'salesCount'), color: '#7C3AED' },
        ],
    topupPaymentDistribution: data.topupPaymentDistribution.length
      ? data.topupPaymentDistribution
      : [{ name: 'Topup', value: data.summary.topups, color: '#2563EB' }],
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

  const data = withFallbackDistributions(normalizeDashboardData(await res.json()))
  return { data, live: true }
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
