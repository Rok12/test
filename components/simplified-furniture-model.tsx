"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Box } from "@react-three/drei"
import type * as THREE from "three"

// Simplified props interface
interface FurnitureModelProps {
  type: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  material: string
  finish: string
  hasDoors: boolean
  shelfCount: number
  materialColor: string
  position?: [number, number, number]
  doorsOpen?: boolean
  segments?: number
  segmentConfig?: Array<{
    id: number
    doorDirection: string
  }>
  hasMountingStrip?: boolean
  columnCount?: number
  compartmentDoors?: Array<{
    type: string
  }>
  backPanelConfig?: {
    inset: boolean
    thickness: number
    noOffset?: boolean
  }
}

export function SimplifiedFurnitureModel({
  type,
  dimensions,
  material,
  finish,
  hasDoors,
  shelfCount,
  materialColor,
  position = [0, 0, 0],
  doorsOpen = false,
  segments = 2,
  segmentConfig = [
    { id: 1, doorDirection: "left" },
    { id: 2, doorDirection: "right" },
  ],
  hasMountingStrip = false,
  columnCount = 0,
  compartmentDoors = [],
  backPanelConfig = { inset: false, thickness: 0.018, noOffset: false },
}: FurnitureModelProps) {
  // Convert dimensions from cm to Three.js units (meters)
  const width = dimensions.width / 100
  const height = dimensions.height / 100
  const depth = dimensions.depth / 100

  // Material properties based on finish
  const materialProps = useMemo(() => {
    switch (finish) {
      case "glossy":
        return { roughness: 0.1, metalness: 0.2 }
      case "matte":
        return { roughness: 0.8, metalness: 0.1 }
      default: // natural or oiled
        return { roughness: 0.5, metalness: 0 }
    }
  }, [finish])

  // Create a group ref for the entire furniture piece
  const groupRef = useRef<THREE.Group>(null)

  // Calculate thickness of materials
  const thickness = 0.018 // 18mm standard panel thickness

  // Render a basic bookshelf
  const renderBasicBookshelf = () => {
    return (
      <>
        {/* Left side panel */}
        <Box args={[thickness, height, depth]} position={[-width / 2 + thickness / 2, height / 2, 0]}>
          <meshStandardMaterial color={materialColor} {...materialProps} />
        </Box>

        {/* Right side panel */}
        <Box args={[thickness, height, depth]} position={[width / 2 - thickness / 2, height / 2, 0]}>
          <meshStandardMaterial color={materialColor} {...materialProps} />
        </Box>

        {/* Top panel */}
        <Box args={[width, thickness, depth]} position={[0, height - thickness / 2, 0]}>
          <meshStandardMaterial color={materialColor} {...materialProps} />
        </Box>

        {/* Bottom panel */}
        <Box args={[width, thickness, depth]} position={[0, thickness / 2, 0]}>
          <meshStandardMaterial color={materialColor} {...materialProps} />
        </Box>

        {/* Back panel */}
        <Box
          args={[width - 2 * thickness, height - 2 * thickness, backPanelConfig.thickness]}
          position={[
            0,
            height / 2,
            -depth / 2 +
              backPanelConfig.thickness / 2 +
              (backPanelConfig.inset && !backPanelConfig.noOffset ? 0.016 : 0),
          ]}
        >
          <meshStandardMaterial color={materialColor} {...materialProps} />
        </Box>

        {/* Shelves */}
        {Array.from({ length: shelfCount }).map((_, index) => {
          const shelfHeight = (height - 2 * thickness) / (shelfCount + 1)
          return (
            <Box
              key={index}
              args={[width - 2 * thickness, thickness, depth - thickness]}
              position={[0, (index + 1) * shelfHeight, 0]}
            >
              <meshStandardMaterial color={materialColor} {...materialProps} />
            </Box>
          )
        })}
      </>
    )
  }

  // Render a basic table
  const renderBasicTable = () => {
    const legThickness = 0.05
    const legHeight = height - thickness
    const topThickness = thickness

    return (
      <>
        {/* Table top */}
        <Box args={[width, topThickness, depth]} position={[0, height - topThickness / 2, 0]}>
          <meshStandardMaterial color={materialColor} {...materialProps} />
        </Box>

        {/* Table legs */}
        {[
          [-width / 2 + legThickness / 2, legHeight / 2, -depth / 2 + legThickness / 2],
          [width / 2 - legThickness / 2, legHeight / 2, -depth / 2 + legThickness / 2],
          [-width / 2 + legThickness / 2, legHeight / 2, depth / 2 - legThickness / 2],
          [width / 2 - legThickness / 2, legHeight / 2, depth / 2 - legThickness / 2],
        ].map((position, index) => (
          <Box key={index} args={[legThickness, legHeight, legThickness]} position={position}>
            <meshStandardMaterial color={materialColor} {...materialProps} />
          </Box>
        ))}
      </>
    )
  }

  // Render furniture based on type
  const renderFurniture = () => {
    switch (type) {
      case "table":
        return renderBasicTable()
      default:
        return renderBasicBookshelf()
    }
  }

  // Rotate the furniture slightly on load
  useFrame((state, delta) => {
    if (groupRef.current && groupRef.current.rotation.y === 0) {
      groupRef.current.rotation.y = Math.PI / 6
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <group position={[0, 0, 0]}>{renderFurniture()}</group>

      {/* Floor grid for reference */}
      <gridHelper args={[10, 10, 0x888888, 0x444444]} position={[0, -0.01, 0]} />
    </group>
  )
}
