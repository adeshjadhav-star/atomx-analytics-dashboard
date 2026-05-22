import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardNav from '../components/DashboardNav'
import SummaryCards from '../components/SummaryCards'
import TopupBarChart from '../components/TopupBarChart'
import DistributionCharts from '../components/DistributionCharts'
import CountCharts from '../components/CountCharts'
import EventsTable from '../components/EventsTable'
import { fetchDashboardData } from '../services/api'
import { dateRanges } from '../data/adminData'

function SectionTitle({ children }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-widest mb-4 flex items-center gap-3"
      style={{ color: '#6B7280' }}>
      <span className="h-px flex-1 max-w-[24px]" style={{ background: 'linear-gradient(90deg, #F26A21, rgba(23,32,51,0.12))' }} />
      {children}
    </h2>
  )
}

function LoadingOverlay() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div
        className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
        style={{ borderTopColor: '#F26A21', borderRightColor: 'rgba(242,106,33,0.25)' }}
      />
      <p className="text-sm" style={{ color: '#6B7280' }}>Loading dashboard data…</p>
    </div>
  )
}

export default function DashboardPage({ config: initialConfig, adminList }) {
  const [config, setConfig] = useState(initialConfig)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [apiLive, setApiLive] = useState(null)

  const loadData = useCallback(async (cfg) => {
    setLoading(true)
    setError(null)
    try {
      const { data: result, live } = await fetchDashboardData(cfg.admin, cfg.dateRange)
      setData(result)
      setApiLive(live)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    queueMicrotask(() => loadData(config))
  }, [config, loadData])

  const adminName = adminList.find((a) => a.id === config.admin)?.name ?? 'All'
  const dateLabel = dateRanges.find((d) => d.id === config.dateRange)?.label ?? ''
  const hasData = data
    ? data.events.length > 0 ||
      Object.values(data.summary).some((value) => Number(value) > 0) ||
      data.topupPaymentDistribution.some((item) => Number(item.value) > 0)
    : false

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F8FAFC 0%, #F3F6FA 42%, #FFFFFF 100%)' }}>
      <DashboardNav
        config={config}
        onConfigChange={setConfig}
        onGetData={() => loadData(config)}
        loading={loading}
        adminList={adminList}
        apiLive={apiLive}
      />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
        {/* Page context line */}
        <div className="flex items-start sm:items-center justify-between mb-5 sm:mb-6 gap-3">
          <div>
            <h1 className="font-bold text-base sm:text-lg" style={{ color: '#1F2A44' }}>
              Analytics Dashboard
            </h1>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6B7280' }}>
              Admin: <span style={{ color: '#1F2A44' }}>{adminName}</span>
              &nbsp;·&nbsp;
              Period: <span style={{ color: '#1F2A44' }}>{dateLabel}</span>
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingOverlay />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20">
              <p className="text-red-500 text-sm">{error}</p>
              <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                Client-side request to https://dataxapi.atomx.in/v1/data
              </p>
              <button onClick={() => loadData(config)} className="btn-primary mt-4 px-6 py-2 text-sm">
                Retry
              </button>
            </motion.div>
          ) : data && !hasData ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20">
              <p className="text-sm" style={{ color: '#1F2A44' }}>No data returned from server for this admin and date range.</p>
              <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                Try selecting All or a wider date range.
              </p>
            </motion.div>
          ) : data ? (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }} className="space-y-6 sm:space-y-8">

              {/* Summary cards */}
              <section>
                <SummaryCards data={data.summary} />
              </section>

              {/* Total Topups bar chart */}
              <section>
                <SectionTitle>Total Top-ups by Event</SectionTitle>
                <TopupBarChart
                  data={data.topupByEvent}
                  title="Total Top-ups"
                />
              </section>

              {/* Distribution charts */}
              <section>
                <SectionTitle>Distribution Analysis</SectionTitle>
                <DistributionCharts data={data} />
              </section>

              {/* Count charts */}
              <section>
                <SectionTitle>Activity Counts by Event</SectionTitle>
                <CountCharts data={data} />
              </section>

              {/* Events table */}
              <section>
                <SectionTitle>Events Detail</SectionTitle>
                <EventsTable events={data.events} />
              </section>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-8 py-5 text-center"
        style={{ borderTop: '1px solid #E5E7EB' }}>
        <p className="text-xs" style={{ color: '#6B7280' }}>
          AtomX Corporation Private Limited India. All rights reserved. &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  )
}
