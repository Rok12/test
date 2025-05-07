"use client"

import { useRef, useMemo } from "react"
import * as THREE from "three"

interface GridSystemProps {
  size?: number
  divisions?: number
  color?: string
  secondaryColor?: string
  visible?: boolean
}

export function GridSystem({
  size = 10,
  divisions = 10,
  color = "#888888",
  secondaryColor = "#444444",
  visible = true,
}: GridSystemProps) {
  const gridRef = useRef<THREE.GridHelper>(null)

  // Create grid helper
  const grid = useMemo(() => {
    return new THREE.GridHelper(size, divisions, color, secondaryColor)
  }, [size, divisions, color, secondaryColor])

  if (!visible) return null

  return <primitive object={grid} ref={gridRef} />
}
