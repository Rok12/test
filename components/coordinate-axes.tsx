"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

interface CoordinateAxesProps {
  size?: number
  visible?: boolean
}

export function CoordinateAxes({ size = 1, visible = true }: CoordinateAxesProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Rotate the axes to match the scene orientation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.copy(new THREE.Euler(0, 0, 0))
    }
  })

  if (!visible) return null

  return (
    <group ref={groupRef}>
      {/* X axis - Red */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0, size, 0, 0]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="red" linewidth={2} />
      </line>
      <mesh position={[size + 0.1, 0, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>

      {/* Y axis - Green */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0, 0, size, 0]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="green" linewidth={2} />
      </line>
      <mesh position={[0, size + 0.1, 0]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="green" />
      </mesh>

      {/* Z axis - Blue */}
      <line>
        <bufferGeometry attach="geometry">
          <float32BufferAttribute attach="attributes-position" args={[new Float32Array([0, 0, 0, 0, 0, size]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial attach="material" color="blue" linewidth={2} />
      </line>
      <mesh position={[0, 0, size + 0.1]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="blue" />
      </mesh>

      {/* Labels */}
      <group position={[size + 0.2, 0, 0]}>
        <mesh>
          <textGeometry args={["X", { size: 0.1, height: 0.02 }]} />
          <meshBasicMaterial color="red" />
        </mesh>
      </group>

      <group position={[0, size + 0.2, 0]}>
        <mesh>
          <textGeometry args={["Y", { size: 0.1, height: 0.02 }]} />
          <meshBasicMaterial color="green" />
        </mesh>
      </group>

      <group position={[0, 0, size + 0.2]}>
        <mesh>
          <textGeometry args={["Z", { size: 0.1, height: 0.02 }]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </group>
    </group>
  )
}
