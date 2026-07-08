import { motion } from 'framer-motion'

interface HeroProps {
  onEnter: () => void
}

export function Hero({ onEnter }: HeroProps) {
  return (
    <section className="hero-screen">
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-flow hero-flow-a" />
        <div className="hero-flow hero-flow-b" />
        <div className="hero-flow hero-flow-c" />
        <div className="hero-vignette" />
      </div>

      <nav className="hero-nav">
        <span className="brand-mark">Highland Aero</span>
        <span className="nav-meta">Model 3 · Wind Tunnel</span>
      </nav>

      <div className="hero-content">
        <motion.p
          className="hero-kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Interactive aerodynamic simulator
        </motion.p>

        <motion.h1
          className="hero-brand"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Highland Aero
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          Watch air peel cleanly across the Tesla Model 3 Highland — sealed face,
          flush glass, and a wake so tight it rewrote the sedan playbook.
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <button type="button" className="btn-primary" onClick={onEnter}>
            Enter wind tunnel
          </button>
          <span className="hero-cd">Cd 0.219</span>
        </motion.div>
      </div>

      <motion.div
        className="hero-silhouette"
        aria-hidden="true"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg viewBox="0 0 800 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Streamlines approaching */}
          <path className="sil-stream" d="M20 80 C120 78, 200 90, 280 110" />
          <path className="sil-stream" d="M20 120 C130 118, 210 125, 290 140" />
          <path className="sil-stream" d="M20 160 C140 158, 220 155, 300 150" />
          <path className="sil-stream" d="M20 200 C130 198, 210 185, 295 170" />
          {/* Car side profile — Model 3 Highland-ish */}
          <path
            className="sil-body"
            d="M300 175
               C320 175, 340 155, 360 145
               L420 125
               C450 110, 500 100, 560 105
               L620 115
               C650 120, 680 140, 700 155
               L720 165
               L725 175
               L720 185
               L300 185
               Z"
          />
          <path
            className="sil-glass"
            d="M400 145 L460 118 C500 108, 540 110, 580 120 L610 135 L400 145 Z"
          />
          <circle className="sil-wheel" cx="380" cy="185" r="22" />
          <circle className="sil-wheel" cx="640" cy="185" r="22" />
          {/* Wake streams — tight */}
          <path className="sil-wake" d="M725 150 C760 148, 790 152, 820 155" />
          <path className="sil-wake" d="M725 165 C765 164, 795 168, 825 172" />
          <path className="sil-wake" d="M725 180 C760 182, 790 188, 820 195" />
        </svg>
      </motion.div>
    </section>
  )
}
