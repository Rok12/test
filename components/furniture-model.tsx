"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, RoundedBox } from "@react-three/drei"
import * as THREE from "three"
import React from "react"

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
  thumbnailUrl?: string | null
  patternDimensions?: {
    length?: number
    width?: number
    thickness?: number
    textureRepeatX?: number
    textureRepeatY?: number
  }
  patternFinishType?: string // Changed from patternCategory to patternFinishType
}

export function FurnitureModel({
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
    { id: 3, doorDirection: "left" },
  ],
  hasMountingStrip = false,
  columnCount = 0,
  compartmentDoors = [],
  backPanelConfig,
  thumbnailUrl = null,
  patternDimensions = {
    length: 100,
    width: 100,
    thickness: 18,
    textureRepeatX: 1,
    textureRepeatY: 1,
  },
  patternFinishType = "solid", // Changed from patternCategory to patternFinishType
}: FurnitureModelProps) {
  // Convert dimensions from cm to Three.js units (meters)
  const width = dimensions.width / 100
  const height = dimensions.height / 100
  const depth = dimensions.depth / 100

  // Door thickness (2cm)
  const doorThickness = 0.02

  // Door opening angle (110 degrees in radians)
  const doorOpenAngle = (Math.PI * 110) / 180

  // Door inset when opened (2cm)
  const doorInset = 0.02

  // Door outset when closed (1cm)
  const doorOutset = 0.01

  // Create a stable texture loader reference
  const textureLoader = useMemo(() => new THREE.TextureLoader(), [])

  // Use a ref to track the current texture
  const textureRef = useRef<THREE.Texture | null>(null)

  // State to track loading status
  const [isTextureLoading, setIsTextureLoading] = useState(false)
  const [textureError, setTextureError] = useState<Error | null>(null)

  // Load texture when thumbnailUrl changes
  useEffect(() => {
    // Clean up previous texture if it exists
    if (textureRef.current) {
      textureRef.current.dispose()
      textureRef.current = null
    }

    if (!thumbnailUrl) {
      return
    }

    setIsTextureLoading(true)
    setTextureError(null)

    // Set a flag to track if the component is still mounted
    let isMounted = true

    textureLoader.load(
      thumbnailUrl,
      (loadedTexture) => {
        if (!isMounted) {
          loadedTexture.dispose()
          return
        }

        // Configure the texture
        loadedTexture.wrapS = THREE.RepeatWrapping
        loadedTexture.wrapT = THREE.RepeatWrapping
        loadedTexture.magFilter = THREE.LinearFilter
        loadedTexture.minFilter = THREE.LinearMipmapLinearFilter

        // Set repeat values
        const repeatX = patternDimensions.textureRepeatX || 1
        const repeatY = patternDimensions.textureRepeatY || 1
        loadedTexture.repeat.set(repeatX, repeatY)

        // Enable anisotropy for sharper textures at angles
        loadedTexture.anisotropy = 16

        // Store the texture in the ref
        textureRef.current = loadedTexture
        setIsTextureLoading(false)
      },
      undefined,
      (error) => {
        if (isMounted) {
          console.error(`Failed to load thumbnail: ${thumbnailUrl}:`, error)
          setTextureError(error)
          setIsTextureLoading(false)
        }
      },
    )

    // Cleanup function
    return () => {
      isMounted = false
      if (textureRef.current) {
        textureRef.current.dispose()
        textureRef.current = null
      }
    }
  }, [thumbnailUrl, patternDimensions.textureRepeatX, patternDimensions.textureRepeatY, textureLoader])

  // Add more logging to debug the finishType
  // In the FurnitureModel component, update the getMaterialPropertiesForCategory function:

  // Get material properties based on pattern category and finish
  const getMaterialPropertiesForFinishType = (finishType: string) => {
    // Default properties
    let roughness = 0.5
    let metalness = 0.0
    let clearcoat = 0.0
    let clearcoatRoughness = 0.0
    let normalScale = 1.0
    let envMapIntensity = 1.0

    console.log(`Applying finish type: ${finishType}`)

    // Determine properties based on finishType
    switch (finishType) {
      case "glossy":
        roughness = 0.1
        metalness = 0.2
        clearcoat = 0.8
        clearcoatRoughness = 0.1
        envMapIntensity = 1.5
        break

      case "matte":
        roughness = 0.9
        metalness = 0.0
        clearcoat = 0.0
        break

      case "oiled":
        roughness = 0.5
        clearcoat = 0.2
        break

      case "brushed":
        roughness = 0.3
        metalness = 0.6
        normalScale = 0.7
        break

      case "polished":
        roughness = 0.1
        clearcoat = 0.9
        clearcoatRoughness = 0.05
        envMapIntensity = 2.0
        break

      case "natural":
        roughness = 0.7
        metalness = 0.0
        break

      case "wood":
        roughness = 0.7
        metalness = 0.0
        normalScale = 0.5
        break

      case "marble":
        roughness = 0.2
        metalness = 0.1
        clearcoat = 0.8
        clearcoatRoughness = 0.1
        envMapIntensity = 1.5
        break

      case "metal":
        roughness = 0.2
        metalness = 0.8
        envMapIntensity = 2.0
        break

      case "fabric":
        roughness = 0.9
        metalness = 0.0
        break

      case "concrete":
        roughness = 0.8
        metalness = 0.1
        break

      case "laminate":
        roughness = 0.4
        metalness = 0.0
        clearcoat = 0.3
        break

      case "veneer":
        roughness = 0.6
        metalness = 0.0
        clearcoat = 0.3
        break

      case "solid":
      default:
        roughness = 0.5
        metalness = 0.0
        break
    }

    return {
      roughness,
      metalness,
      clearcoat,
      clearcoatRoughness,
      normalScale,
      envMapIntensity,
    }
  }

  // Replace the old getMaterialPropertiesForCategory function with this new one
  // and update all references to it in the component

  // Create material properties based on finish and category
  const materialProps = useMemo(() => {
    // Use pattern finishType directly
    const properties = getMaterialPropertiesForFinishType(patternFinishType)

    console.log(`Applying material: finishType=${patternFinishType}`)
    console.log(
      `Material properties: roughness=${properties.roughness}, metalness=${properties.metalness}, clearcoat=${properties.clearcoat}`,
    )

    const baseProps = {
      color: materialColor,
      roughness: properties.roughness,
      metalness: properties.metalness,
    }

    // Add clearcoat if needed
    if (properties.clearcoat > 0) {
      Object.assign(baseProps, {
        clearcoat: properties.clearcoat,
        clearcoatRoughness: properties.clearcoatRoughness,
      })
    }

    // Add environment map intensity if needed
    if (properties.envMapIntensity !== 1.0) {
      Object.assign(baseProps, {
        envMapIntensity: properties.envMapIntensity,
      })
    }

    if (textureRef.current) {
      return {
        ...baseProps,
        map: textureRef.current,
      }
    }

    return baseProps
  }, [materialColor, patternFinishType, textureRef.current])

  // Create a single consistent material for the entire furniture piece
  const furnitureMaterial = useMemo(() => {
    // Use pattern finishType directly
    const properties = getMaterialPropertiesForFinishType(patternFinishType)

    // For materials that need clearcoat, use MeshPhysicalMaterial
    if (properties.clearcoat > 0) {
      return new THREE.MeshPhysicalMaterial({
        map: textureRef.current || null,
        color: materialColor,
        roughness: properties.roughness,
        metalness: properties.metalness,
        clearcoat: properties.clearcoat,
        clearcoatRoughness: properties.clearcoatRoughness,
        envMapIntensity: properties.envMapIntensity,
      })
    }

    // For other materials, use MeshStandardMaterial
    return new THREE.MeshStandardMaterial({
      map: textureRef.current || null,
      color: materialColor,
      roughness: properties.roughness,
      metalness: properties.metalness,
      envMapIntensity: properties.envMapIntensity || 1.0,
    })
  }, [materialColor, patternFinishType, textureRef.current])

  // Create a group ref for the entire furniture piece
  const groupRef = useRef<THREE.Group>(null)

  // Create refs for the door animations
  const doorRefs = useRef<(THREE.Group | null)[]>([])

  // Create refs for door positions (for inset animation)
  const doorPositionRefs = useRef<THREE.Vector3[]>([])

  // Initialize door refs array for compartment doors
  const compartmentDoorRefs = useRef<(THREE.Group | null)[][]>([])

  // Initialize door refs array
  useEffect(() => {
    // Initialize doorRefs with the correct length
    if (doorRefs.current.length !== segments) {
      doorRefs.current = Array(segments).fill(null)
    }

    // Initialize doorPositionRefs with the correct length
    if (doorPositionRefs.current.length !== segments) {
      doorPositionRefs.current = Array(segments)
        .fill(null)
        .map((_, i) => doorPositionRefs.current[i] || new THREE.Vector3(0, 0, 0))
    }
  }, [segments])

  // Initialize compartment door refs
  useEffect(() => {
    // Initialize compartmentDoorRefs with the correct structure
    if (compartmentDoorRefs.current.length !== compartmentDoors.length) {
      compartmentDoorRefs.current = Array(compartmentDoors.length)
        .fill(null)
        .map(() => [null, null])
    }
  }, [compartmentDoors.length])

  // Rotate the furniture slightly on load and animate doors
  useFrame((state, delta) => {
    if (groupRef.current && groupRef.current.rotation.y === 0) {
      groupRef.current.rotation.y = Math.PI / 6
    }

    // Animate doors opening/closing
    if (hasDoors) {
      // Animate main doors if no columns
      if (columnCount === 0) {
        if (segments === 2) {
          // Two doors - left door opens left, right door opens right
          if (doorRefs.current[0]) {
            // Left door rotation
            const targetRotation = doorsOpen ? -doorOpenAngle : 0
            doorRefs.current[0].rotation.y = THREE.MathUtils.lerp(
              doorRefs.current[0].rotation.y,
              targetRotation,
              delta * 3,
            )

            // Left door position (inset when opened)
            const targetX = doorsOpen ? doorInset : 0
            doorRefs.current[0].position.x = THREE.MathUtils.lerp(doorRefs.current[0].position.x, targetX, delta * 3)
          }

          if (doorRefs.current[1]) {
            // Right door rotation
            const targetRotation = doorsOpen ? doorOpenAngle : 0
            doorRefs.current[1].rotation.y = THREE.MathUtils.lerp(
              doorRefs.current[1].rotation.y,
              targetRotation,
              delta * 3,
            )

            // Right door position (inset when opened)
            const targetX = doorsOpen ? -doorInset : 0
            doorRefs.current[1].position.x = THREE.MathUtils.lerp(doorRefs.current[1].position.x, targetX, delta * 3)
          }
        } else {
          // Single door
          if (doorRefs.current[0]) {
            const config = segmentConfig[0] || { doorDirection: "left" }
            const direction = config.doorDirection === "left" ? -1 : 1

            // Single door rotation
            const targetRotation = doorsOpen ? doorOpenAngle * direction : 0
            doorRefs.current[0].rotation.y = THREE.MathUtils.lerp(
              doorRefs.current[0].rotation.y,
              targetRotation,
              delta * 3,
            )

            // Single door position (inset when opened)
            const targetX = doorsOpen ? doorInset * -direction : 0
            doorRefs.current[0].position.x = THREE.MathUtils.lerp(doorRefs.current[0].position.x, targetX, delta * 3)
          }
        }
      } else {
        // Animate compartment doors
        compartmentDoors.forEach((door, compartmentIndex) => {
          if (door.type === "none") return

          // Simplified door animation
          if (compartmentDoorRefs.current[compartmentIndex]?.[0]) {
            const isLeft =
              door.type === "single-left" ||
              (door.type === "double" && compartmentDoorRefs.current[compartmentIndex]?.[0])
            const isRight =
              door.type === "single-right" ||
              (door.type === "double" && compartmentDoorRefs.current[compartmentIndex]?.[1])

            if (isLeft) {
              const targetRotation = doorsOpen ? -doorOpenAngle : 0
              compartmentDoorRefs.current[compartmentIndex][0]!.rotation.y = THREE.MathUtils.lerp(
                compartmentDoorRefs.current[compartmentIndex][0]!.rotation.y,
                targetRotation,
                delta * 3,
              )
            }

            if (isRight && compartmentDoorRefs.current[compartmentIndex]?.[1]) {
              const targetRotation = doorsOpen ? doorOpenAngle : 0
              compartmentDoorRefs.current[compartmentIndex][1]!.rotation.y = THREE.MathUtils.lerp(
                compartmentDoorRefs.current[compartmentIndex][1]!.rotation.y,
                targetRotation,
                delta * 3,
              )
            }
          }
        })
      }
    }
  })

  // Calculate thickness of materials based on pattern dimensions
  const panelThickness = patternDimensions.thickness
    ? patternDimensions.thickness / 1000
    : type === "table"
      ? 0.02
      : 0.018

  // Define edge radius for all panels (1mm)
  const edgeRadius = 0.001

  // Render different furniture types
  const renderFurniture = () => {
    switch (type) {
      case "table":
        return renderTable()
      case "closet":
        return renderBookshelf() // Keep the same rendering function for now
      case "cabinet":
        return renderCabinet()
      case "desk":
        return renderDesk()
      case "sideboard":
        return renderSideboard()
      default:
        return renderBookshelf()
    }
  }

  // Render a basic table
  const renderTable = () => {
    const legThickness = 0.05
    const legHeight = height - panelThickness
    const topThickness = panelThickness

    return (
      <>
        {/* Table top with rounded edges */}
        <RoundedBox
          args={[width, topThickness, depth]}
          radius={edgeRadius}
          position={[0, height - topThickness / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Table legs */}
        {[
          [-width / 2 + legThickness / 2, legHeight / 2, -depth / 2 + legThickness / 2],
          [width / 2 - legThickness / 2, legHeight / 2, -depth / 2 + legThickness / 2],
          [-width / 2 + legThickness / 2, legHeight / 2, depth / 2 - legThickness / 2],
          [width / 2 - legThickness / 2, legHeight / 2, depth / 2 - legThickness / 2],
        ].map((position, index) => (
          <Box key={index} args={[legThickness, legHeight, legThickness]} position={position}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        ))}
      </>
    )
  }

  // Render a basic bookshelf
  const renderBookshelf = () => {
    // Calculate shelf positions
    const shelfPositions = []
    if (shelfCount > 0) {
      const shelfSpacing = (height - 2 * panelThickness) / (shelfCount + 1)
      for (let i = 1; i <= shelfCount; i++) {
        shelfPositions.push(i * shelfSpacing)
      }
    }

    // Calculate column divider positions
    const columnDividerPositions = []
    if (columnCount > 0) {
      const dividerSpacing = width / (columnCount + 1)
      for (let i = 1; i <= columnCount; i++) {
        columnDividerPositions.push(-width / 2 + i * dividerSpacing)
      }
    }

    // Calculate compartment widths and positions
    const compartmentWidths = []
    const compartmentPositions = []

    if (columnCount > 0) {
      const compartmentCount = columnCount + 1

      // First compartment (from left edge to first divider)
      if (columnDividerPositions.length > 0) {
        const firstWidth = columnDividerPositions[0] - (-width / 2 + panelThickness)
        compartmentWidths.push(firstWidth)
        compartmentPositions.push(-width / 2 + panelThickness + firstWidth / 2)
      }

      // Middle compartments (between dividers)
      for (let i = 0; i < columnDividerPositions.length - 1; i++) {
        const compartmentWidth = columnDividerPositions[i + 1] - columnDividerPositions[i]
        compartmentWidths.push(compartmentWidth)
        compartmentPositions.push(columnDividerPositions[i] + compartmentWidth / 2)
      }

      // Last compartment (from last divider to right edge)
      if (columnDividerPositions.length > 0) {
        const lastWidth = width / 2 - panelThickness - columnDividerPositions[columnDividerPositions.length - 1]
        compartmentWidths.push(lastWidth)
        compartmentPositions.push(columnDividerPositions[columnDividerPositions.length - 1] + lastWidth / 2)
      }
    } else {
      // If no columns, just one compartment
      compartmentWidths.push(width - 2 * panelThickness)
      compartmentPositions.push(0)
    }

    // Calculate panel dimensions
    const sideThickness = panelThickness

    // Adjust internal width to account for side panel thickness
    const internalWidth = width - 2 * sideThickness
    const backPanelHeight = height // Full height to overlap top and bottom panels
    const internalDepth = depth - sideThickness // Back panel thickness

    // Calculate back panel dimensions and position
    const backPanelThickness = backPanelConfig?.inset ? 0.008 : sideThickness // 8mm or default
    const backPanelInset = backPanelConfig?.inset && !backPanelConfig?.noOffset ? 0.016 : 0 // 16mm or 0
    const backPanelSideInset = backPanelConfig?.inset ? 0.006 : 0 // 6mm from sides when inset
    const backPanelSideExtension = backPanelConfig?.inset ? 0.006 : 0 // 6mm extension into side panels

    // For inset back panel, use the full internal width plus the extension into side panels
    const adjustedInternalWidth = internalWidth + backPanelSideExtension * 2

    // Calculate shelf depth based on back panel configuration
    const shelfDepth = backPanelConfig?.inset ? internalDepth - backPanelInset : internalDepth

    // Calculate the depth of top and bottom panels
    // For standard back panels: they extend from front to the inside edge of the back panel
    // For inset back panels: they extend from front to the inside edge of the inset back panel
    const topBottomPanelDepth = backPanelConfig?.inset
      ? depth - backPanelInset - backPanelThickness // For inset: extend to inside edge of inset back panel
      : depth - backPanelThickness // For standard: extend to inside edge of back panel

    const topBottomPanelWidth = internalWidth

    // Calculate position for top and bottom panels
    // The front edge of the furniture is at z = depth/2
    // We want the front edge of the panels to align with the front edge of the furniture
    const panelZPosition = depth / 2 - topBottomPanelDepth / 2

    return (
      <>
        {/* Left side panel - with notch for back panel */}
        <RoundedBox
          args={[sideThickness, height, depth]}
          radius={edgeRadius}
          position={[-width / 2 + sideThickness / 2, height / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Right side panel - with notch for back panel */}
        <RoundedBox
          args={[sideThickness, height, depth]}
          radius={edgeRadius}
          position={[width / 2 - sideThickness / 2, height / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Left side panel notch fill */}
        <RoundedBox
          args={[backPanelSideExtension, height, depth - backPanelInset]}
          radius={edgeRadius}
          position={[-width / 2 + sideThickness - backPanelSideExtension / 2, height / 2, backPanelInset / 2]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Right side panel notch fill */}
        <RoundedBox
          args={[backPanelSideExtension, height, depth - backPanelInset]}
          radius={edgeRadius}
          position={[width / 2 - sideThickness + backPanelSideExtension / 2, height / 2, backPanelInset / 2]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Top panel - inset between side panels with dynamic depth, aligned to front */}
        <RoundedBox
          args={[topBottomPanelWidth, sideThickness, topBottomPanelDepth]}
          radius={edgeRadius}
          position={[0, height - sideThickness / 2, panelZPosition]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Bottom panel - inset between side panels with dynamic depth, aligned to front */}
        <RoundedBox
          args={[topBottomPanelWidth, sideThickness, topBottomPanelDepth]}
          radius={edgeRadius}
          position={[0, sideThickness / 2, panelZPosition]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Back panel - wider to extend into side panels */}
        <Box
          args={[adjustedInternalWidth, backPanelHeight, backPanelThickness]}
          position={[0, height / 2, -depth / 2 + backPanelThickness / 2 + backPanelInset]}
        >
          <meshStandardMaterial {...materialProps} />
        </Box>

        {/* Shelves - inset between side panels */}
        {shelfPositions.map((pos, index) => (
          <RoundedBox
            key={index}
            args={[internalWidth, sideThickness, shelfDepth]}
            radius={edgeRadius}
            position={[0, pos, backPanelInset / 2]}
            smoothness={4}
          >
            <meshStandardMaterial {...materialProps} />
          </RoundedBox>
        ))}

        {/* Column Dividers - inset between top and bottom */}
        {columnCount > 0 &&
          columnDividerPositions.map((xPos, index) => (
            <RoundedBox
              key={`divider-${index}`}
              args={[sideThickness, backPanelHeight - 2 * sideThickness, shelfDepth]}
              radius={edgeRadius}
              position={[xPos, height / 2, backPanelInset / 2]}
              smoothness={4}
            >
              <meshStandardMaterial {...materialProps} />
            </RoundedBox>
          ))}

        {/* Mounting holes and dowels for adjustable shelves */}
        {hasMountingStrip && (
          <>
            {/* Simplified mounting strip rendering */}
            {(() => {
              const stripWidth = 0.01
              const stripHeight = height - 0.1 // 5cm from top and bottom

              return (
                <>
                  {/* Left side mounting strip */}
                  <Box
                    args={[stripWidth, stripHeight, depth - 0.05]}
                    position={[-width / 2 + panelThickness + stripWidth / 2, height / 2, 0]}
                  >
                    <meshStandardMaterial color="#444444" />
                  </Box>

                  {/* Right side mounting strip */}
                  <Box
                    args={[stripWidth, stripHeight, depth - 0.05]}
                    position={[width / 2 - panelThickness - stripWidth / 2, height / 2, 0]}
                  >
                    <meshStandardMaterial color="#444444" />
                  </Box>
                </>
              )
            })()}
          </>
        )}

        {/* Doors */}
        {hasDoors && (
          <>
            {columnCount === 0 ? (
              // Original door logic for no columns
              segments === 2 ? (
                // Two doors - each mounted on the side panels
                <>
                  {/* Left door - hinged on the left side */}
                  <group position={[-width / 2, height / 2, depth / 2 + doorOutset]}>
                    <group ref={(el) => (doorRefs.current[0] = el)} position={[0, 0, 0]}>
                      <RoundedBox
                        args={[width / 2, height, doorThickness]}
                        radius={edgeRadius}
                        position={[width / 4, 0, 0]}
                        smoothness={4}
                      >
                        <meshStandardMaterial {...materialProps} />
                      </RoundedBox>
                      {/* Door handle */}
                      <Box args={[0.01, 0.05, 0.02]} position={[width / 2 - 0.01, 0, doorThickness / 2]}>
                        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
                      </Box>
                    </group>
                  </group>

                  {/* Right door - hinged on the right side */}
                  <group position={[width / 2, height / 2, depth / 2 + doorOutset]}>
                    <group ref={(el) => (doorRefs.current[1] = el)} position={[0, 0, 0]}>
                      <RoundedBox
                        args={[width / 2, height, doorThickness]}
                        radius={edgeRadius}
                        position={[-width / 4, 0, 0]}
                        smoothness={4}
                      >
                        <meshStandardMaterial {...materialProps} />
                      </RoundedBox>
                      {/* Door handle */}
                      <Box args={[0.01, 0.05, 0.02]} position={[-width / 2 + 0.01, 0, doorThickness / 2]}>
                        <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
                      </Box>
                    </group>
                  </group>
                </>
              ) : (
                // Single full-height door
                <group
                  position={[
                    segmentConfig[0].doorDirection === "left" ? -width / 2 : width / 2,
                    height / 2,
                    depth / 2 + doorOutset,
                  ]}
                >
                  <group ref={(el) => (doorRefs.current[0] = el)} position={[0, 0, 0]}>
                    <RoundedBox
                      args={[width, height, doorThickness]}
                      radius={edgeRadius}
                      position={[segmentConfig[0].doorDirection === "left" ? width / 2 : -width / 2, 0, 0]}
                      smoothness={4}
                    >
                      <meshStandardMaterial {...materialProps} />
                    </RoundedBox>
                    {/* Door handle */}
                    <Box
                      args={[0.01, 0.05, 0.02]}
                      position={[
                        segmentConfig[0].doorDirection === "left" ? width - 0.02 : -width + 0.02,
                        0,
                        doorThickness / 2,
                      ]}
                    >
                      <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
                    </Box>
                  </group>
                </group>
              )
            ) : (
              // Compartment doors for when we have columns
              <>
                {compartmentDoors.map((door, compartmentIndex) => {
                  if (door.type === "none") return null

                  const compartmentWidth = compartmentWidths[compartmentIndex]
                  const compartmentPosition = compartmentPositions[compartmentIndex]

                  if (door.type === "single-left") {
                    // Single door with left hinge
                    return (
                      <group
                        key={`door-${compartmentIndex}-left`}
                        position={[compartmentPosition - compartmentWidth / 2, height / 2, depth / 2 + doorOutset]}
                      >
                        <group
                          ref={(el) => {
                            if (compartmentDoorRefs.current[compartmentIndex]) {
                              compartmentDoorRefs.current[compartmentIndex][0] = el
                            }
                          }}
                          position={[0, 0, 0]}
                        >
                          <RoundedBox
                            args={[compartmentWidth, height - 2 * panelThickness, doorThickness]}
                            radius={edgeRadius}
                            position={[compartmentWidth / 2, 0, 0]}
                            smoothness={4}
                          >
                            <meshStandardMaterial {...materialProps} />
                          </RoundedBox>
                          {/* Door handle */}
                          <Box args={[0.01, 0.05, 0.02]} position={[compartmentWidth - 0.01, 0, doorThickness / 2]}>
                            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
                          </Box>
                        </group>
                      </group>
                    )
                  } else if (door.type === "single-right") {
                    // Single door with right hinge
                    return (
                      <group
                        key={`door-${compartmentIndex}-right`}
                        position={[compartmentPosition + compartmentWidth / 2, height / 2, depth / 2 + doorOutset]}
                      >
                        <group
                          ref={(el) => {
                            if (compartmentDoorRefs.current[compartmentIndex]) {
                              compartmentDoorRefs.current[compartmentIndex][0] = el
                            }
                          }}
                          position={[0, 0, 0]}
                        >
                          <RoundedBox
                            args={[compartmentWidth, height - 2 * panelThickness, doorThickness]}
                            radius={edgeRadius}
                            position={[-compartmentWidth / 2, 0, 0]}
                            smoothness={4}
                          >
                            <meshStandardMaterial {...materialProps} />
                          </RoundedBox>
                          {/* Door handle */}
                          <Box args={[0.01, 0.05, 0.02]} position={[-compartmentWidth + 0.01, 0, doorThickness / 2]}>
                            <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
                          </Box>
                        </group>
                      </group>
                    )
                  } else if (door.type === "double") {
                    // Double doors
                    return (
                      <React.Fragment key={`door-${compartmentIndex}-double`}>
                        {/* Left door */}
                        <group
                          position={[compartmentPosition - compartmentWidth / 2, height / 2, depth / 2 + doorOutset]}
                        >
                          <group
                            ref={(el) => {
                              if (compartmentDoorRefs.current[compartmentIndex]) {
                                compartmentDoorRefs.current[compartmentIndex][0] = el
                              }
                            }}
                            position={[0, 0, 0]}
                          >
                            <RoundedBox
                              args={[compartmentWidth / 2, height - 2 * panelThickness, doorThickness]}
                              radius={edgeRadius}
                              position={[compartmentWidth / 4, 0, 0]}
                              smoothness={4}
                            >
                              <meshStandardMaterial {...materialProps} />
                            </RoundedBox>
                            {/* Door handle */}
                            <Box
                              args={[0.01, 0.05, 0.02]}
                              position={[compartmentWidth / 2 - 0.01, 0, doorThickness / 2]}
                            >
                              <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
                            </Box>
                          </group>
                        </group>

                        {/* Right door */}
                        <group
                          position={[compartmentPosition + compartmentWidth / 2, height / 2, depth / 2 + doorOutset]}
                        >
                          <group
                            ref={(el) => {
                              if (compartmentDoorRefs.current[compartmentIndex]) {
                                compartmentDoorRefs.current[compartmentIndex][1] = el
                              }
                            }}
                            position={[0, 0, 0]}
                          >
                            <RoundedBox
                              args={[compartmentWidth / 2, height - 2 * panelThickness, doorThickness]}
                              radius={edgeRadius}
                              position={[-compartmentWidth / 4, 0, 0]}
                              smoothness={4}
                            >
                              <meshStandardMaterial {...materialProps} />
                            </RoundedBox>
                            {/* Door handle */}
                            <Box
                              args={[0.01, 0.05, 0.02]}
                              position={[-compartmentWidth / 2 + 0.01, 0, doorThickness / 2]}
                            >
                              <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.2} />
                            </Box>
                          </group>
                        </group>
                      </React.Fragment>
                    )
                  }

                  return null
                })}
              </>
            )}
          </>
        )}
      </>
    )
  }

  // Render a basic cabinet
  const renderCabinet = () => {
    return (
      <>
        {/* Basic cabinet structure */}
        <RoundedBox
          args={[width, height, panelThickness]}
          radius={edgeRadius}
          position={[0, height / 2, -depth / 2 + panelThickness / 2]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Left side panel */}
        <RoundedBox
          args={[panelThickness, height, depth]}
          radius={edgeRadius}
          position={[-width / 2 + panelThickness / 2, height / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Right side panel */}
        <RoundedBox
          args={[panelThickness, height, depth]}
          radius={edgeRadius}
          position={[width / 2 - panelThickness / 2, height / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Top panel */}
        <RoundedBox
          args={[width, panelThickness, depth]}
          radius={edgeRadius}
          position={[0, height - panelThickness / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Bottom panel */}
        <RoundedBox
          args={[width, panelThickness, depth]}
          radius={edgeRadius}
          position={[0, panelThickness / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Shelves */}
        {Array.from({ length: shelfCount }).map((_, index) => {
          const shelfHeight = (height - 2 * panelThickness) / (shelfCount + 1)
          return (
            <RoundedBox
              key={index}
              args={[width - 2 * panelThickness, panelThickness, depth - panelThickness]}
              radius={edgeRadius}
              position={[0, (index + 1) * shelfHeight, 0]}
              smoothness={4}
            >
              <meshStandardMaterial {...materialProps} />
            </RoundedBox>
          )
        })}

        {/* Doors */}
        {hasDoors && (
          <group position={[0, height / 2, depth / 2 - panelThickness / 2]}>
            <group ref={(el) => (doorRefs.current[0] = el)} position={[-width / 2 + panelThickness, 0, 0]}>
              <RoundedBox
                args={[width - 2 * panelThickness, height - 2 * panelThickness, panelThickness]}
                radius={edgeRadius}
                position={[width / 2 - panelThickness, 0, 0]}
                smoothness={4}
              >
                <meshStandardMaterial {...materialProps} />
              </RoundedBox>
            </group>
          </group>
        )}
      </>
    )
  }

  // Render a basic desk
  const renderDesk = () => {
    const legThickness = 0.05
    const legHeight = height - panelThickness
    const topThickness = panelThickness

    return (
      <>
        {/* Desk top with rounded edges */}
        <RoundedBox
          args={[width, topThickness, depth]}
          radius={edgeRadius}
          position={[0, height - topThickness / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Desk legs */}
        {[
          [-width / 2 + legThickness / 2, legHeight / 2, -depth / 2 + legThickness / 2],
          [width / 2 - legThickness / 2, legHeight / 2, -depth / 2 + legThickness / 2],
          [-width / 2 + legThickness / 2, legHeight / 2, depth / 2 - legThickness / 2],
          [width / 2 - legThickness / 2, legHeight / 2, depth / 2 - legThickness / 2],
        ].map((position, index) => (
          <Box key={index} args={[legThickness, legHeight, legThickness]} position={position}>
            <meshStandardMaterial {...materialProps} />
          </Box>
        ))}
      </>
    )
  }

  // Render a basic sideboard
  const renderSideboard = () => {
    return (
      <>
        {/* Basic structure with rounded edges */}
        <RoundedBox
          args={[width, height, panelThickness]}
          radius={edgeRadius}
          position={[0, height / 2, -depth / 2 + panelThickness / 2]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Left side panel */}
        <RoundedBox
          args={[panelThickness, height, depth]}
          radius={edgeRadius}
          position={[-width / 2 + panelThickness / 2, height / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Right side panel */}
        <RoundedBox
          args={[panelThickness, height, depth]}
          radius={edgeRadius}
          position={[width / 2 - panelThickness / 2, height / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Top panel */}
        <RoundedBox
          args={[width, panelThickness, depth]}
          radius={edgeRadius}
          position={[0, height - panelThickness / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>

        {/* Bottom panel */}
        <RoundedBox
          args={[width, panelThickness, depth]}
          radius={edgeRadius}
          position={[0, panelThickness / 2, 0]}
          smoothness={4}
        >
          <meshStandardMaterial {...materialProps} />
        </RoundedBox>
      </>
    )
  }

  // Create a unique key for the group to ensure proper remounting when props change
  const modelKey = `${type}-${dimensions.width}-${dimensions.height}-${dimensions.depth}-${thumbnailUrl || "no-thumbnail"}-${patternFinishType}`

  return (
    <group ref={groupRef} position={position} key={modelKey}>
      <group position={[0, 0, 0]}>{renderFurniture()}</group>

      {/* Floor grid for reference */}
      <gridHelper args={[10, 10, 0x888888, 0x444444]} position={[0, -0.01, 0]} />

      {/* XYZ Axes */}
      <axesHelper args={[1]} position={[0, 0.01, 0]} />
    </group>
  )
}
