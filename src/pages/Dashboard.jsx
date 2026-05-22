import BackgroundEffects from '../components/BackgroundEffects'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import StatsCards from '../components/StatsCards'
import AnalyticsPanel from '../components/AnalyticsPanel'
import ActivityTable from '../components/ActivityTable'

export default function Dashboard() {
  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <Navbar />
      <main>
        <HeroSection />
        <StatsCards />
        <AnalyticsPanel />
        <ActivityTable />
      </main>

      {/* Footer strip */}
      <footer className="border-t border-white/[0.05] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1L10 3.5V8.5L6 11L2 8.5V3.5L6 1Z"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-slate-500 text-xs font-medium">
              DATA X &copy; {new Date().getFullYear()} &nbsp;·&nbsp; Powered by Atomx
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span>
              API:{' '}
              <span className="font-mono text-slate-400">dataxapi.atomx.in/v1/data</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
