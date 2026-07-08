import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AirflowProps {
  speed: number
  windAngle: number
  density: number
  showStreamlines: boolean
  showWake: boolean
  isRunning: boolean
}

const MAX_PARTICLES = 2800
const STREAM_COUNT = 48
const STREAM_POINTS = 80

/**
 * Particle + streamline airflow field that wraps around a Model 3 silhouette.
 * Particles slow and deflect near the body, accelerate over the roof, and
 * form a coherent low-drag wake — visualizing Highland aero efficiency.
 */
export function AirflowField({
  speed,
  windAngle,
  density,
  showStreamlines,
  showWake,
  isRunning,
}: AirflowProps) {
  const count = Math.floor(MAX_PARTICLES * Math.max(0.15, density))
  const pointsRef = useRef<THREE.Points>(null)
  const wakeRef = useRef<THREE.Points>(null)
  const streamGroupRef = useRef<THREE.Group>(null)

  const { positions, velocities, phases } = useMemo(() => {
    const positions = new Float32Array(MAX_PARTICLES * 3)
    const velocities = new Float32Array(MAX_PARTICLES * 3)
    const phases = new Float32Array(MAX_PARTICLES)
    for (let i = 0; i < MAX_PARTICLES; i++) {
      resetParticle(positions, velocities, phases, i, true)
    }
    return { positions, velocities, phases }
  }, [])

  const wakeData = useMemo(() => {
    const n = 600
    const pos = new Float32Array(n * 3)
    const life = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = -3 - Math.random() * 4
      pos[i * 3 + 1] = 0.3 + Math.random() * 0.8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.6
      life[i] = Math.random()
    }
    return { pos, life, n }
  }, [])

  const streamLines = useMemo(() => {
    const lines: { positions: Float32Array; line: THREE.Line }[] = []
    for (let s = 0; s < STREAM_COUNT; s++) {
      const arr = new Float32Array(STREAM_POINTS * 3)
      const y = 0.15 + (s % 8) * 0.18
      const z = ((Math.floor(s / 8) / 5) - 0.5) * 2.4
      for (let i = 0; i < STREAM_POINTS; i++) {
        arr[i * 3] = 6 - i * 0.14
        arr[i * 3 + 1] = y
        arr[i * 3 + 2] = z
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
      const mat = new THREE.LineBasicMaterial({
        color: s % 3 === 0 ? '#3DDCFF' : '#9AEFFF',
        transparent: true,
        opacity: 0.25 + (s % 8) * 0.04,
        depthWrite: false,
      })
      const line = new THREE.Line(geo, mat)
      lines.push({ positions: arr, line })
    }
    return lines
  }, [])

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [positions])

  const wakeGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(wakeData.pos, 3))
    return geo
  }, [wakeData])

  useFrame((_, dt) => {
    if (!isRunning) return
    const clamped = Math.min(dt, 0.05)
    const flowSpeed = (speed / 55) * 4.5
    const yaw = (windAngle * Math.PI) / 180
    const dirX = -Math.cos(yaw)
    const dirZ = Math.sin(yaw)

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      let x = positions[ix]
      let y = positions[ix + 1]
      let z = positions[ix + 2]

      const local = deflectAroundBody(x, y, z, flowSpeed)

      x += (dirX * local.vx + local.dx) * clamped
      y += local.vy * clamped
      z += (dirZ * local.vx + local.dz) * clamped

      positions[ix] = x
      positions[ix + 1] = y
      positions[ix + 2] = z

      if (x < -8 || y < -0.5 || y > 4 || Math.abs(z) > 5) {
        resetParticle(positions, velocities, phases, i, false)
      }
    }
    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.opacity = 0.55 + density * 0.35
    }

    if (showWake && wakeRef.current) {
      const pos = wakeData.pos
      const life = wakeData.life
      for (let i = 0; i < wakeData.n; i++) {
        const ix = i * 3
        life[i] += clamped * (0.15 + speed / 400)
        const swirl = life[i] * 6
        pos[ix] -= flowSpeed * 0.35 * clamped
        pos[ix + 1] += Math.sin(swirl + i) * 0.15 * clamped
        pos[ix + 2] += Math.cos(swirl * 0.8 + i * 0.3) * 0.2 * clamped
        pos[ix + 2] *= 1 - clamped * 0.08

        if (life[i] > 1 || pos[ix] < -9) {
          life[i] = 0
          pos[ix] = -2.6 - Math.random() * 0.4
          pos[ix + 1] = 0.25 + Math.random() * 0.7
          pos[ix + 2] = (Math.random() - 0.5) * 1.2
        }
      }
      wakeRef.current.geometry.attributes.position.needsUpdate = true
      const mat = wakeRef.current.material as THREE.PointsMaterial
      mat.opacity = 0.45
    }

    if (showStreamlines) {
      for (let s = 0; s < STREAM_COUNT; s++) {
        const { positions: arr, line } = streamLines[s]
        const baseY = 0.15 + (s % 8) * 0.18
        const baseZ = ((Math.floor(s / 8) / 5) - 0.5) * 2.4
        let x = 6
        let y = baseY
        let z = baseZ + Math.sin(yaw) * 0.5
        for (let i = 0; i < STREAM_POINTS; i++) {
          const local = deflectAroundBody(x, y, z, 1)
          arr[i * 3] = x
          arr[i * 3 + 1] = y
          arr[i * 3 + 2] = z
          x += dirX * 0.14 + local.dx * 0.04
          y += local.vy * 0.04
          z += dirZ * 0.14 + local.dz * 0.04
        }
        line.geometry.attributes.position.needsUpdate = true
        line.visible = true
      }
    } else {
      for (const { line } of streamLines) {
        line.visible = false
      }
    }

    if (streamGroupRef.current) {
      streamGroupRef.current.visible = showStreamlines
    }
  })

  return (
    <group>
      <points ref={pointsRef} geometry={particleGeo}>
        <pointsMaterial
          color="#7EE8FF"
          size={0.045}
          transparent
          opacity={0.7}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {showWake && (
        <points ref={wakeRef} geometry={wakeGeo}>
          <pointsMaterial
            color="#4AA8FF"
            size={0.07}
            transparent
            opacity={0.45}
            depthWrite={false}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}

      <group ref={streamGroupRef} visible={showStreamlines}>
        {streamLines.map(({ line }, s) => (
          <primitive key={s} object={line} />
        ))}
      </group>
    </group>
  )
}

function resetParticle(
  positions: Float32Array,
  _velocities: Float32Array,
  phases: Float32Array,
  i: number,
  initial: boolean,
) {
  const ix = i * 3
  positions[ix] = initial ? 4 + Math.random() * 5 : 5 + Math.random() * 3
  positions[ix + 1] = 0.05 + Math.random() * 2.2
  positions[ix + 2] = (Math.random() - 0.5) * 4.5
  phases[i] = Math.random() * Math.PI * 2
}

/**
 * Potential-flow-inspired deflection around a sedan bounding volume.
 * Accelerates over the roof, parts around the nose, and leaves a tight wake.
 */
function deflectAroundBody(x: number, y: number, z: number, flowSpeed: number) {
  const cx = 0
  const cy = 0.55
  const cz = 0
  const rx = 2.6
  const ry = 0.7
  const rz = 1.0

  const dx = (x - cx) / rx
  const dy = (y - cy) / ry
  const dz = (z - cz) / rz
  const d2 = dx * dx + dy * dy + dz * dz

  let vx = flowSpeed
  let vy = 0
  let pushX = 0
  let pushY = 0
  let pushZ = 0

  if (d2 < 2.8) {
    const d = Math.sqrt(Math.max(d2, 0.05))
    const influence = Math.max(0, 1.4 - d) / 1.4
    pushX = (dx / d) * influence * flowSpeed * 1.8
    pushY = (dy / d) * influence * flowSpeed * 1.4
    pushZ = (dz / d) * influence * flowSpeed * 1.6

    if (y > 0.7 && x > -2.2 && x < 2.2 && Math.abs(z) < 1.2) {
      vx *= 1 + influence * 0.55
      pushY += influence * 0.3 * flowSpeed
    }

    if (y < 0.35 && x > -2.4 && x < 2.4 && Math.abs(z) < 0.9) {
      vx *= 1 + influence * 0.35
      pushY -= influence * 0.15
    }

    if (x > 2.0 && Math.abs(z) < 1.0 && y < 1.0) {
      vx *= 1 - influence * 0.65
    }

    if (x < -1.5 && x > -3.2 && y > 0.2 && y < 1.1) {
      pushY -= influence * 0.25 * flowSpeed
      pushZ *= 0.7
    }
  }

  if (y < 0.15) {
    pushY += (0.15 - y) * 2
  }

  return {
    vx,
    vy: vy + pushY,
    dx: pushX,
    dz: pushZ,
  }
}
