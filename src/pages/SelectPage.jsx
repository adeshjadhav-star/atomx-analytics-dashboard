import { useState } from 'react'
import { motion } from 'framer-motion'
import atomxLogo from '../assets/AtomX_Logo.svg'
import { dateRanges } from '../services/api'

export default function SelectPage({ onContinue, adminList, adminsLoading, adminsError }) {
  const [admin, setAdmin] = useState('')
  const [dateRange, setDateRange] = useState('fy2324')
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (adminsError) { setError('Admin list failed to load from server.'); return }
    if (!admin) { setError('Please select an admin.'); return }
    if (!dateRange) { setError('Please select a date range.'); return }
    setError('')
    onContinue({ admin, dateRange })
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #F8FAFC 0%, #EEF2F7 58%, #FFFFFF 100%)' }}
    >
      {/* Top bar */}
      <div
        className="w-full px-4 sm:px-8 py-4 flex items-center justify-between gap-3"
        style={{ borderBottom: '1px solid #E5E7EB', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-2.5">
          <img
            src={atomxLogo}
            alt="AtomX"
            className="h-10 w-auto"
          />
        </div>
        <span className="text-xs text-right" style={{ color: '#6B7280' }}>Analytics Dashboard</span>
      </div>

      {/* Center card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div
            className="rounded-2xl p-5 sm:p-8"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              boxShadow: '0 24px 80px rgba(15,23,42,0.10)',
            }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <img
                src={atomxLogo}
                alt="AtomX"
                className="h-16 w-auto mx-auto mb-4"
              />
            </div>

            {/* Admin select */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: '#1F2A44' }}>
                Select Admin
                {adminsLoading && (
                  <svg className="animate-spin" width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="5.5" stroke="rgba(242,106,33,0.2)" strokeWidth="2" />
                    <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="#F26A21" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </label>
              <select
                value={admin}
                onChange={(e) => setAdmin(e.target.value)}
                disabled={adminsLoading || Boolean(adminsError)}
                className="select-custom w-full px-4 py-3 text-sm"
                style={{ opacity: adminsLoading || adminsError ? 0.5 : 1 }}
              >
                {adminsLoading && <option>Loading admins...</option>}
                {adminsError && <option>Failed to load admins</option>}
                {!adminsLoading && !adminsError && (
                  <>
                    <option value="">Select admin</option>
                    <option value="all">All</option>
                    {adminList.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </>
                )}
              </select>
              {adminsError && (
                <p className="text-red-500 text-xs mt-2">{adminsError}</p>
              )}
            </div>

            {/* Date range select */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1F2A44' }}>
                Select Date Range
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="select-custom w-full px-4 py-3 text-sm"
              >
                {dateRanges.map((d) => (
                  <option key={d.id} value={d.id}>{d.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-4 text-center">{error}</p>
            )}

            {/* Continue button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              disabled={adminsLoading || Boolean(adminsError)}
              className="btn-primary w-full py-3 text-sm"
              style={{ opacity: adminsLoading || adminsError ? 0.6 : 1 }}
            >
              Continue
            </motion.button>

            <p className="text-xs text-center mt-5" style={{ color: '#6B7280' }}>
              <span className="font-mono" style={{ color: '#6B7280' }}></span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
