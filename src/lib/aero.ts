export type PaintColor = 'white' | 'black' | 'red' | 'blue' | 'silver'

export interface SimState {
  speed: number
  windAngle: number
  particleDensity: number
  showStreamlines: boolean
  showPressure: boolean
  showWake: boolean
  paint: PaintColor
  cameraMode: 'orbit' | 'side' | 'front' | 'chase'
  isRunning: boolean
}

export interface AeroMetrics {
  cd: number
  cl: number
  dragForce: number
  downforce: number
  frontalArea: number
  powerAtSpeed: number
  rangeImpact: number
  wakeLength: number
  stagnationPressure: number
}

export const PAINT_HEX: Record<PaintColor, string> = {
  white: '#F2F2F0',
  black: '#1A1A1A',
  red: '#B91C1C',
  blue: '#1E3A5F',
  silver: '#A8ADB4',
}

/** Model 3 Highland reference Cd ≈ 0.219 */
export const HIGHLAND_BASE_CD = 0.219
export const HIGHLAND_FRONTAL_AREA = 2.22 // m²
export const AIR_DENSITY = 1.225 // kg/m³ at sea level

export function computeMetrics(speedMph: number, windAngle: number): AeroMetrics {
  const speedMs = speedMph * 0.44704
  // Yaw increases effective drag (simplified quadratic penalty)
  const yawFactor = 1 + Math.pow(Math.abs(windAngle) / 90, 1.6) * 0.55
  const cd = HIGHLAND_BASE_CD * yawFactor
  // Slight lift at speed, reduced by Highland underbody
  const cl = 0.08 + (speedMph / 150) * 0.04 - Math.abs(windAngle) * 0.0003
  const q = 0.5 * AIR_DENSITY * speedMs * speedMs
  const dragForce = q * cd * HIGHLAND_FRONTAL_AREA
  const downforce = -q * cl * HIGHLAND_FRONTAL_AREA
  const powerAtSpeed = (dragForce * speedMs) / 1000 // kW
  // Range impact vs Cd 0.23 baseline at same speed
  const baselineCd = 0.23
  const rangeImpact = ((baselineCd - cd) / baselineCd) * 100
  const wakeLength = 1.8 + (speedMph / 100) * 2.2 * yawFactor
  const stagnationPressure = q / 1000 // kPa

  return {
    cd,
    cl,
    dragForce,
    downforce,
    frontalArea: HIGHLAND_FRONTAL_AREA,
    powerAtSpeed,
    rangeImpact,
    wakeLength,
    stagnationPressure,
  }
}

export const DEFAULT_STATE: SimState = {
  speed: 70,
  windAngle: 0,
  particleDensity: 0.7,
  showStreamlines: true,
  showPressure: true,
  showWake: true,
  paint: 'white',
  cameraMode: 'orbit',
  isRunning: true,
}
