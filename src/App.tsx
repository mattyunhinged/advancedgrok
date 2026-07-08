import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hero } from './components/Hero'
import { WindTunnel } from './components/WindTunnel'
import { ControlPanel } from './components/ControlPanel'
import { MetricsPanel } from './components/MetricsPanel'
import { DEFAULT_STATE, computeMetrics, type SimState } from './lib/aero'
import './App.css'

type View = 'hero' | 'sim'

export default function App() {
  const [view, setView] = useState<View>('hero')
  const [state, setState] = useState<SimState>(DEFAULT_STATE)

  const metrics = useMemo(
    () => computeMetrics(state.speed, state.windAngle),
    [state.speed, state.windAngle],
  )

  const patch = (partial: Partial<SimState>) => {
    setState((s) => ({ ...s, ...partial }))
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {view === 'hero' ? (
          <motion.div
            key="hero"
            className="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onEnter={() => setView('sim')} />
          </motion.div>
        ) : (
          <motion.div
            key="sim"
            className="view sim-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
          >
            <header className="sim-topbar">
              <button
                type="button"
                className="back-btn"
                onClick={() => setView('hero')}
              >
                ← Highland Aero
              </button>
              <div className="sim-title">
                <span className="sim-model">Tesla Model 3 Highland</span>
                <span className="sim-status">
                  <i className={`status-dot ${state.isRunning ? 'on' : ''}`} />
                  {state.isRunning ? 'Simulating' : 'Paused'} · {state.speed} mph
                </span>
              </div>
              <div className="sim-badge">Cd {metrics.cd.toFixed(3)}</div>
            </header>

            <div className="sim-layout">
              <ControlPanel state={state} metrics={metrics} onChange={patch} />
              <main className="viewport">
                <WindTunnel state={state} />
                <div className="viewport-hint">Drag to orbit · Scroll to zoom</div>
              </main>
              <MetricsPanel metrics={metrics} speed={state.speed} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
