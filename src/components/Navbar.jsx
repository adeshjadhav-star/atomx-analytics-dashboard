import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import atomxLogo from '../assets/AtomX_Logo.svg'

const navLinks = ['Dashboard', 'Analytics', 'API', 'Docs', 'Pricing']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
          : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={atomxLogo}
              alt="AtomX"
              className="h-12 w-auto select-none"
            />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* CTA group */}
          <div className="hidden md:flex items-center gap-3">
            <button className="text-slate-400 hover:text-white text-sm font-medium transition-colors duration-200">
              Sign In
            </button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                boxShadow: '0 0 20px rgba(99,102,241,0.35)',
              }}
            >
              <span
                className="w-2 h-2 bg-green-400 rounded-full"
                style={{ animation: 'pulse-glow 2.5s ease-in-out infinite' }}
              />
              Connect API
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg glass text-slate-400 hover:text-white"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              {mobileOpen ? (
                <>
                  <path d="M5 5L15 15M15 5L5 15" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-white/[0.06]"
          >
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all"
                >
                  {link}
                </a>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                <button className="text-left px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white">
                  Sign In
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  Connect API
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
