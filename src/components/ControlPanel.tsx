import type { AeroMetrics, PaintColor, SimState } from '../lib/aero'
import { PAINT_HEX } from '../lib/aero'

interface ControlPanelProps {
  state: SimState
  metrics: AeroMetrics
  onChange: (patch: Partial<SimState>) => void
}

export function ControlPanel({ state, metrics, onChange }: ControlPanelProps) {
  return (
    <aside className="panel control-panel">
      <header className="panel-header">
        <span className="panel-eyebrow">Wind Tunnel</span>
        <h2>Controls</h2>
      </header>

      <div className="control-group">
        <div className="control-row">
          <label htmlFor="speed">Airspeed</label>
          <span className="control-value">{state.speed} mph</span>
        </div>
        <input
          id="speed"
          type="range"
          min={0}
          max={150}
          step={1}
          value={state.speed}
          onChange={(e) => onChange({ speed: Number(e.target.value) })}
        />
      </div>

      <div className="control-group">
        <div className="control-row">
          <label htmlFor="yaw">Yaw angle</label>
          <span className="control-value">{state.windAngle}°</span>
        </div>
        <input
          id="yaw"
          type="range"
          min={-30}
          max={30}
          step={1}
          value={state.windAngle}
          onChange={(e) => onChange({ windAngle: Number(e.target.value) })}
        />
      </div>

      <div className="control-group">
        <div className="control-row">
          <label htmlFor="density">Particle density</label>
          <span className="control-value">{Math.round(state.particleDensity * 100)}%</span>
        </div>
        <input
          id="density"
          type="range"
          min={0.2}
          max={1}
          step={0.05}
          value={state.particleDensity}
          onChange={(e) => onChange({ particleDensity: Number(e.target.value) })}
        />
      </div>

      <div className="toggle-grid">
        <Toggle
          label="Streamlines"
          active={state.showStreamlines}
          onClick={() => onChange({ showStreamlines: !state.showStreamlines })}
        />
        <Toggle
          label="Pressure"
          active={state.showPressure}
          onClick={() => onChange({ showPressure: !state.showPressure })}
        />
        <Toggle
          label="Wake"
          active={state.showWake}
          onClick={() => onChange({ showWake: !state.showWake })}
        />
        <Toggle
          label={state.isRunning ? 'Running' : 'Paused'}
          active={state.isRunning}
          onClick={() => onChange({ isRunning: !state.isRunning })}
        />
      </div>

      <div className="control-group">
        <span className="control-label">Paint</span>
        <div className="paint-swatches" role="listbox" aria-label="Paint color">
          {(Object.keys(PAINT_HEX) as PaintColor[]).map((color) => (
            <button
              key={color}
              type="button"
              className={`swatch ${state.paint === color ? 'active' : ''}`}
              style={{ background: PAINT_HEX[color] }}
              aria-label={color}
              aria-selected={state.paint === color}
              onClick={() => onChange({ paint: color })}
            />
          ))}
        </div>
      </div>

      <div className="control-group">
        <span className="control-label">Camera</span>
        <div className="camera-btns">
          {(['orbit', 'side', 'front', 'chase'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`cam-btn ${state.cameraMode === mode ? 'active' : ''}`}
              onClick={() => onChange({ cameraMode: mode })}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="live-strip">
        <div>
          <span className="metric-label">Cd</span>
          <strong>{metrics.cd.toFixed(3)}</strong>
        </div>
        <div>
          <span className="metric-label">Drag</span>
          <strong>{metrics.dragForce.toFixed(0)} N</strong>
        </div>
        <div>
          <span className="metric-label">Power</span>
          <strong>{metrics.powerAtSpeed.toFixed(1)} kW</strong>
        </div>
      </div>
    </aside>
  )
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className={`toggle ${active ? 'active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className="toggle-dot" />
      {label}
    </button>
  )
}
