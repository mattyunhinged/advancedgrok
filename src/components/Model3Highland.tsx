import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PAINT_HEX, type PaintColor } from '../lib/aero'

interface Model3Props {
  paint: PaintColor
  showPressure: boolean
  speed: number
}

/** Procedural Tesla Model 3 Highland — sealed face, flush glass, tapered rear */
export function Model3Highland({ paint, showPressure, speed }: Model3Props) {
  const group = useRef<THREE.Group>(null)
  const paintHex = PAINT_HEX[paint]

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    const amp = Math.min(speed / 200, 0.4) * 0.002
    group.current.position.y = 0.42 + Math.sin(t * 28) * amp
  })

  const bodyMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: paintHex,
        metalness: paint === 'white' || paint === 'silver' ? 0.55 : 0.78,
        roughness: paint === 'black' ? 0.28 : 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        envMapIntensity: 1.35,
      }),
    [paintHex, paint],
  )

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0B1520',
        metalness: 0.15,
        roughness: 0.04,
        transmission: 0.4,
        thickness: 0.5,
        transparent: true,
        opacity: 0.82,
        envMapIntensity: 1.6,
      }),
    [],
  )

  const darkMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1E2228',
        metalness: 0.85,
        roughness: 0.3,
      }),
    [],
  )

  const tireMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0D0D0D',
        metalness: 0.05,
        roughness: 0.92,
      }),
    [],
  )

  const pressureMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#FF4D4D',
        transparent: true,
        opacity: showPressure ? 0.32 : 0,
        depthWrite: false,
      }),
    [showPressure],
  )

  const lowPressureMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#3DDCFF',
        transparent: true,
        opacity: showPressure ? 0.26 : 0,
        depthWrite: false,
      }),
    [showPressure],
  )

  return (
    <group ref={group} position={[0, 0.42, 0]}>
      {/* Lower body / rocker */}
      <mesh castShadow receiveShadow material={bodyMat} position={[0.05, -0.02, 0]}>
        <boxGeometry args={[4.55, 0.42, 1.88]} />
      </mesh>

      {/* Main beltline body */}
      <mesh castShadow material={bodyMat} position={[0.05, 0.28, 0]}>
        <boxGeometry args={[4.6, 0.48, 1.86]} />
      </mesh>

      {/* Front fascia — Highland sealed nose */}
      <mesh castShadow material={bodyMat} position={[2.35, 0.12, 0]}>
        <boxGeometry args={[0.5, 0.58, 1.82]} />
      </mesh>
      <mesh castShadow material={bodyMat} position={[2.52, 0.18, 0]} scale={[0.42, 0.58, 0.95]}>
        <sphereGeometry args={[0.9, 28, 18, 0, Math.PI]} />
      </mesh>

      {/* Hood — long sloping Highland hood */}
      <mesh
        castShadow
        material={bodyMat}
        position={[1.4, 0.5, 0]}
        rotation={[0, 0, -0.07]}
      >
        <boxGeometry args={[1.7, 0.07, 1.72]} />
      </mesh>

      {/* A-pillar / windshield base */}
      <mesh
        castShadow
        material={bodyMat}
        position={[0.55, 0.62, 0]}
        rotation={[0, 0, -0.38]}
      >
        <boxGeometry args={[0.7, 0.12, 1.62]} />
      </mesh>

      {/* Cabin greenhouse */}
      <mesh castShadow material={bodyMat} position={[-0.25, 0.78, 0]}>
        <boxGeometry args={[2.15, 0.52, 1.62]} />
      </mesh>

      {/* Roof taper to rear (fastback-ish Highland profile) */}
      <mesh
        castShadow
        material={bodyMat}
        position={[-1.25, 0.82, 0]}
        rotation={[0, 0, 0.1]}
      >
        <boxGeometry args={[1.15, 0.38, 1.52]} />
      </mesh>

      {/* Trunk deck — short tapered rear */}
      <mesh castShadow material={bodyMat} position={[-2.2, 0.38, 0]}>
        <boxGeometry args={[0.85, 0.42, 1.78]} />
      </mesh>
      <mesh
        castShadow
        material={bodyMat}
        position={[-2.5, 0.52, 0]}
        rotation={[0, 0, 0.14]}
      >
        <boxGeometry args={[0.5, 0.1, 1.68]} />
      </mesh>

      {/* Rear bumper */}
      <mesh castShadow material={bodyMat} position={[-2.55, 0.05, 0]}>
        <boxGeometry args={[0.35, 0.45, 1.8]} />
      </mesh>

      {/* Diffuser */}
      <mesh material={darkMat} position={[-2.55, -0.15, 0]} rotation={[0.18, 0, 0]}>
        <boxGeometry args={[0.45, 0.06, 1.45]} />
      </mesh>

      {/* Windshield */}
      <mesh material={glassMat} position={[0.78, 0.82, 0]} rotation={[0, 0, -0.48]}>
        <boxGeometry args={[0.95, 0.025, 1.52]} />
      </mesh>

      {/* Side glass */}
      <mesh material={glassMat} position={[-0.25, 0.82, 0.81]}>
        <boxGeometry args={[1.9, 0.38, 0.02]} />
      </mesh>
      <mesh material={glassMat} position={[-0.25, 0.82, -0.81]}>
        <boxGeometry args={[1.9, 0.38, 0.02]} />
      </mesh>

      {/* Rear glass */}
      <mesh material={glassMat} position={[-1.5, 0.82, 0]} rotation={[0, 0, 0.38]}>
        <boxGeometry args={[0.9, 0.025, 1.42]} />
      </mesh>

      {/* Panoramic glass roof */}
      <mesh material={glassMat} position={[-0.3, 1.05, 0]}>
        <boxGeometry args={[2.0, 0.02, 1.32]} />
      </mesh>

      {/* Highland front light bar */}
      <mesh position={[2.68, 0.32, 0]}>
        <boxGeometry args={[0.035, 0.055, 1.58]} />
        <meshStandardMaterial color="#E8F4FF" emissive="#A8D4FF" emissiveIntensity={2} />
      </mesh>

      {/* Highland continuous rear light bar */}
      <mesh position={[-2.7, 0.48, 0]}>
        <boxGeometry args={[0.035, 0.048, 1.58]} />
        <meshStandardMaterial color="#FF1A1A" emissive="#FF0000" emissiveIntensity={2.4} />
      </mesh>

      {/* Front license / camera pod hint */}
      <mesh material={darkMat} position={[2.72, 0.08, 0]}>
        <boxGeometry args={[0.04, 0.08, 0.22]} />
      </mesh>

      {/* Side mirrors */}
      <Mirror position={[0.65, 0.72, 0.98]} darkMat={darkMat} glassMat={glassMat} />
      <Mirror position={[0.65, 0.72, -0.98]} darkMat={darkMat} glassMat={glassMat} flip />

      {/* Door character line */}
      <mesh material={darkMat} position={[0.1, 0.18, 0.94]}>
        <boxGeometry args={[3.2, 0.015, 0.01]} />
      </mesh>
      <mesh material={darkMat} position={[0.1, 0.18, -0.94]}>
        <boxGeometry args={[3.2, 0.015, 0.01]} />
      </mesh>

      {/* Wheels — 18" aero style */}
      <Wheel position={[1.48, -0.3, 0.8]} tireMat={tireMat} darkMat={darkMat} speed={speed} side={1} />
      <Wheel position={[1.48, -0.3, -0.8]} tireMat={tireMat} darkMat={darkMat} speed={speed} side={-1} />
      <Wheel position={[-1.42, -0.3, 0.8]} tireMat={tireMat} darkMat={darkMat} speed={speed} side={1} />
      <Wheel position={[-1.42, -0.3, -0.8]} tireMat={tireMat} darkMat={darkMat} speed={speed} side={-1} />

      {/* Pressure overlays */}
      <mesh material={pressureMat} position={[2.75, 0.22, 0]} scale={[0.28, 0.48, 0.88]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh material={lowPressureMat} position={[-0.35, 1.18, 0]} scale={[1.15, 0.22, 0.68]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
      <mesh material={lowPressureMat} position={[-3.15, 0.38, 0]} scale={[0.85, 0.42, 0.72]}>
        <sphereGeometry args={[1, 16, 12]} />
      </mesh>
    </group>
  )
}

function Mirror({
  position,
  darkMat,
  glassMat,
  flip,
}: {
  position: [number, number, number]
  darkMat: THREE.Material
  glassMat: THREE.Material
  flip?: boolean
}) {
  const z = flip ? -1 : 1
  return (
    <group position={position}>
      <mesh material={darkMat} position={[0, 0, 0.08 * z]}>
        <boxGeometry args={[0.16, 0.09, 0.055]} />
      </mesh>
      <mesh material={glassMat} position={[0.02, 0, 0.115 * z]}>
        <boxGeometry args={[0.12, 0.07, 0.01]} />
      </mesh>
      <mesh material={darkMat} position={[-0.07, -0.04, 0.02 * z]}>
        <boxGeometry args={[0.07, 0.035, 0.025]} />
      </mesh>
    </group>
  )
}

function Wheel({
  position,
  tireMat,
  darkMat,
  speed,
  side,
}: {
  position: [number, number, number]
  tireMat: THREE.Material
  darkMat: THREE.Material
  speed: number
  side: number
}) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.z -= (speed / 40) * dt * Math.PI
  })

  return (
    <group position={position}>
      <group ref={ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={tireMat} castShadow>
          <cylinderGeometry args={[0.35, 0.35, 0.24, 32]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={darkMat}>
          <cylinderGeometry args={[0.23, 0.23, 0.25, 24]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.21, 0.21, 0.26, 24]} />
          <meshStandardMaterial color="#3A3E44" metalness={0.75} roughness={0.28} />
        </mesh>
      </group>
      <mesh position={[0, -0.04, 0.09 * side]}>
        <boxGeometry args={[0.07, 0.11, 0.035]} />
        <meshStandardMaterial color="#C41E3A" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  )
}
