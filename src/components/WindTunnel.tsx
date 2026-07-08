import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import * as THREE from 'three'
import { Model3Highland } from './Model3Highland'
import { AirflowField } from './AirflowField'
import type { SimState } from '../lib/aero'

interface WindTunnelProps {
  state: SimState
}

function CameraRig({ mode }: { mode: SimState['cameraMode'] }) {
  const { camera } = useThree()
  const controls = useThree((s) => s.controls) as unknown as {
    target: THREE.Vector3
    update: () => void
  } | null

  useEffect(() => {
    const positions: Record<SimState['cameraMode'], [number, number, number]> = {
      orbit: [6.5, 2.2, 5.5],
      side: [0.5, 1.4, 7.5],
      front: [8, 1.6, 0.3],
      chase: [-7, 2.5, 3],
    }
    const p = positions[mode]
    camera.position.set(p[0], p[1], p[2])
    if (controls?.target) {
      controls.target.set(0, 0.5, 0)
      controls.update()
    }
  }, [mode, camera, controls])

  return null
}

function TunnelEnvironment({ speed }: { speed: number }) {
  const gridRef = useRef<THREE.GridHelper>(null)
  const roadRef = useRef<THREE.Mesh>(null)

  return (
    <>
      {/* Atmospheric gradient backdrop via fog + lights */}
      <color attach="background" args={['#070B10']} />
      <fog attach="fog" args={['#070B10', 12, 32]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 12, 4]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={30}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-6, 4, -4]} intensity={0.35} color="#8EC8FF" />
      <pointLight position={[3, 2, 0]} intensity={0.4} color="#3DDCFF" distance={10} />

      {/* Road / wind tunnel floor */}
      <mesh
        ref={roadRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 24]} />
        <meshStandardMaterial
          color="#12161C"
          metalness={0.4}
          roughness={0.65}
        />
      </mesh>

      {/* Center lane marker */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[40, 0.06]} />
        <meshBasicMaterial color="#2A3340" transparent opacity={0.6} />
      </mesh>

      <gridHelper
        ref={gridRef}
        args={[40, 40, '#1A2330', '#121820']}
        position={[0, 0.01, 0]}
      />

      {/* Wind tunnel walls — subtle translucent */}
      <mesh position={[0, 3, -6]}>
        <planeGeometry args={[30, 6]} />
        <meshBasicMaterial color="#0D1520" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 3, 6]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[30, 6]} />
        <meshBasicMaterial color="#0D1520" transparent opacity={0.25} side={THREE.DoubleSide} />
      </mesh>

      {/* Speed-reactive intake glow at front of tunnel */}
      <mesh position={[10, 1.5, 0]}>
        <planeGeometry args={[0.1, 4]} />
        <meshBasicMaterial
          color="#3DDCFF"
          transparent
          opacity={0.08 + (speed / 150) * 0.2}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.55}
        scale={16}
        blur={2.5}
        far={4}
      />

      <Environment preset="city" environmentIntensity={0.45} />
    </>
  )
}

export function WindTunnel({ state }: WindTunnelProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <PerspectiveCamera makeDefault fov={42} position={[6.5, 2.2, 5.5]} near={0.1} far={80} />
      <Suspense fallback={null}>
        <TunnelEnvironment speed={state.speed} />
        <Model3Highland
          paint={state.paint}
          showPressure={state.showPressure}
          speed={state.isRunning ? state.speed : 0}
        />
        <AirflowField
          speed={state.speed}
          windAngle={state.windAngle}
          density={state.particleDensity}
          showStreamlines={state.showStreamlines}
          showWake={state.showWake}
          isRunning={state.isRunning}
        />
        <CameraRig mode={state.cameraMode} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={4}
        maxDistance={16}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 0.5, 0]}
        enableDamping
        dampingFactor={0.08}
      />
    </Canvas>
  )
}
