import type { AeroMetrics } from '../lib/aero'

interface MetricsPanelProps {
  metrics: AeroMetrics
  speed: number
}

export function MetricsPanel({ metrics, speed }: MetricsPanelProps) {
  return (
    <aside className="panel metrics-panel">
      <header className="panel-header">
        <span className="panel-eyebrow">Telemetry</span>
        <h2>Aero Metrics</h2>
      </header>

      <div className="metric-hero">
        <span className="metric-hero-label">Drag coefficient</span>
        <div className="metric-hero-value">
          {metrics.cd.toFixed(3)}
          <span className="metric-unit">Cd</span>
        </div>
        <p className="metric-note">
          Highland sealed face &amp; underbody — among the lowest Cd of any production sedan.
        </p>
      </div>

      <ul className="metric-list">
        <MetricRow label="Lift coefficient" value={metrics.cl.toFixed(3)} unit="Cl" />
        <MetricRow label="Frontal area" value={metrics.frontalArea.toFixed(2)} unit="m²" />
        <MetricRow label="Drag force" value={metrics.dragForce.toFixed(1)} unit="N" />
        <MetricRow
          label="Aero power"
          value={metrics.powerAtSpeed.toFixed(2)}
          unit="kW"
        />
        <MetricRow
          label="Stagnation pressure"
          value={metrics.stagnationPressure.toFixed(2)}
          unit="kPa"
        />
        <MetricRow
          label="Wake length"
          value={metrics.wakeLength.toFixed(1)}
          unit="m"
        />
        <MetricRow
          label="Range vs Cd 0.23"
          value={`${metrics.rangeImpact >= 0 ? '+' : ''}${metrics.rangeImpact.toFixed(1)}`}
          unit="%"
          accent
        />
      </ul>

      <div className="cd-bar-wrap">
        <div className="cd-bar-labels">
          <span>0.15</span>
          <span>Cd @ {speed} mph</span>
          <span>0.35</span>
        </div>
        <div className="cd-bar">
          <div
            className="cd-bar-fill"
            style={{ width: `${Math.min(100, ((metrics.cd - 0.15) / 0.2) * 100)}%` }}
          />
          <div className="cd-marker highland" style={{ left: '34.5%' }} title="Highland 0.219" />
          <div className="cd-marker typical" style={{ left: '50%' }} title="Typical sedan ~0.25" />
        </div>
        <div className="cd-legend">
          <span>
            <i className="dot highland" /> Highland
          </span>
          <span>
            <i className="dot typical" /> Typical sedan
          </span>
        </div>
      </div>
    </aside>
  )
}

function MetricRow({
  label,
  value,
  unit,
  accent,
}: {
  label: string
  value: string
  unit: string
  accent?: boolean
}) {
  return (
    <li className={accent ? 'accent' : undefined}>
      <span>{label}</span>
      <strong>
        {value}
        <small>{unit}</small>
      </strong>
    </li>
  )
}
