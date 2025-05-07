import type { Dimensions } from "@/types/furniture-types"

// Standard material thicknesses in mm
const STANDARD_THICKNESSES = {
  PARTICLE_BOARD: 16,
  BACK_PANEL: 3,
}

// Standard material sheet sizes in mm
const STANDARD_SHEET_SIZES = {
  PARTICLE_BOARD: { width: 2750, height: 1830 },
  BACK_PANEL: { width: 2745, height: 1700 },
}

// Edge banding width in mm
const EDGE_BANDING_WIDTH = 1

interface MaterialSheet {
  type: string
  thickness: number
  width: number
  height: number
  code: string
  count: number
  area: number
}

interface Part {
  id: number
  material: string
  width: number
  height: number
  thickness: number
  edgeBanding: string[] // Array of edges that need banding: "top", "bottom", "left", "right"
  count: number
  description: string
  holes?: {
    type: string
    x: number
    y: number
  }[]
}

interface Hardware {
  type: string
  count: number
}

export interface CutList {
  materials: MaterialSheet[]
  parts: Part[]
  hardware: Hardware[]
  totalArea: number
  totalEdgeBanding: number
}

export function generateCutList(
  furnitureType: string,
  dimensions: Dimensions,
  hasDoors: boolean,
  shelfCount: number,
  columnCount: number,
  materialCode = "U780_9",
  doorMaterialCode = "H1334_9",
  backPanelCode = "W1000_9",
): CutList {
  const width = dimensions.width
  const height = dimensions.height
  const depth = dimensions.depth

  const panelThickness = STANDARD_THICKNESSES.PARTICLE_BOARD
  const backPanelThickness = STANDARD_THICKNESSES.BACK_PANEL

  const parts: Part[] = []
  const materials: MaterialSheet[] = []
  const hardware: Hardware[] = []

  let partId = 1
  let totalArea = 0
  let totalEdgeBanding = 0
  let euroScrewCount = 0
  let hingeCount = 0

  // Calculate internal dimensions
  const internalWidth = width - 2 * panelThickness
  const internalHeight = height - 2 * panelThickness
  const internalDepth = depth - panelThickness

  // Add side panels
  for (let i = 0; i < 2; i++) {
    parts.push({
      id: partId++,
      material: materialCode,
      width: depth,
      height: height,
      thickness: panelThickness,
      edgeBanding: ["top", "bottom", "front", "back"],
      count: 1,
      description: `Side panel ${i === 0 ? "left" : "right"}`,
      holes: [
        { type: "euro", x: 32, y: 32 },
        { type: "euro", x: 32, y: height - 32 },
        { type: "euro", x: depth - 32, y: 32 },
        { type: "euro", x: depth - 32, y: height - 32 },
      ],
    })

    totalArea += (depth * height * panelThickness) / 1000000 // Convert to m²
    totalEdgeBanding += (2 * depth + 2 * height) / 1000 // Convert to m
    euroScrewCount += 4
  }

  // Add top and bottom panels
  for (let i = 0; i < 2; i++) {
    parts.push({
      id: partId++,
      material: materialCode,
      width: internalWidth,
      height: depth,
      thickness: panelThickness,
      edgeBanding: ["front", "back"],
      count: 1,
      description: `${i === 0 ? "Top" : "Bottom"} panel`,
      holes: [
        { type: "edge", x: 70, y: 32 },
        { type: "edge", x: internalWidth - 70, y: 32 },
      ],
    })

    totalArea += (internalWidth * depth * panelThickness) / 1000000
    totalEdgeBanding += (2 * depth) / 1000
    euroScrewCount += 2
  }

  // Add shelves
  if (shelfCount > 0) {
    const shelfWidth = internalWidth / (columnCount + 1)

    for (let i = 0; i < shelfCount; i++) {
      for (let j = 0; j <= columnCount; j++) {
        parts.push({
          id: partId++,
          material: materialCode,
          width: shelfWidth,
          height: depth - 10, // Slightly less deep than the cabinet
          thickness: panelThickness,
          edgeBanding: ["front"],
          count: 1,
          description: `Shelf ${i + 1}, compartment ${j + 1}`,
          holes: [
            { type: "edge", x: 70, y: 32 },
            { type: "edge", x: shelfWidth - 70, y: 32 },
          ],
        })

        totalArea += (shelfWidth * (depth - 10) * panelThickness) / 1000000
        totalEdgeBanding += depth / 1000
        euroScrewCount += 2
      }
    }
  }

  // Add vertical dividers for columns
  if (columnCount > 0) {
    for (let i = 0; i < columnCount; i++) {
      parts.push({
        id: partId++,
        material: materialCode,
        width: depth - 10,
        height: internalHeight,
        thickness: panelThickness,
        edgeBanding: ["front", "top", "bottom"],
        count: 1,
        description: `Vertical divider ${i + 1}`,
        holes: [
          { type: "euro", x: 32, y: 32 },
          { type: "euro", x: 32, y: internalHeight - 32 },
        ],
      })

      totalArea += ((depth - 10) * internalHeight * panelThickness) / 1000000
      totalEdgeBanding += (depth + 2 * internalHeight) / 1000
      euroScrewCount += 2
    }
  }

  // Add back panel
  parts.push({
    id: partId++,
    material: backPanelCode,
    width: internalWidth + 10, // Slightly wider to fit in the groove
    height: internalHeight + 10,
    thickness: backPanelThickness,
    edgeBanding: [],
    count: 1,
    description: "Back panel",
    holes: [],
  })

  totalArea += ((internalWidth + 10) * (internalHeight + 10) * backPanelThickness) / 1000000

  // Add doors if needed
  if (hasDoors) {
    const doorCount = columnCount > 0 ? columnCount + 1 : 2
    const doorWidth = internalWidth / doorCount

    for (let i = 0; i < doorCount; i++) {
      parts.push({
        id: partId++,
        material: doorMaterialCode,
        width: doorWidth - 4, // 2mm gap on each side
        height: internalHeight - 4,
        thickness: panelThickness,
        edgeBanding: ["top", "bottom", "left", "right"],
        count: 1,
        description: `Door ${i + 1}`,
        holes: [
          { type: "hinge", x: 100, y: 21 },
          { type: "hinge", x: 100, y: internalHeight - 100 },
        ],
      })

      totalArea += ((doorWidth - 4) * (internalHeight - 4) * panelThickness) / 1000000
      totalEdgeBanding += (2 * (doorWidth - 4) + 2 * (internalHeight - 4)) / 1000
      hingeCount += 2
    }
  }

  // Calculate material sheets needed
  const particleBoardArea = totalArea - ((internalWidth + 10) * (internalHeight + 10) * backPanelThickness) / 1000000
  const backPanelArea = ((internalWidth + 10) * (internalHeight + 10) * backPanelThickness) / 1000000

  const particleBoardSheetArea =
    (STANDARD_SHEET_SIZES.PARTICLE_BOARD.width * STANDARD_SHEET_SIZES.PARTICLE_BOARD.height) / 1000000
  const backPanelSheetArea = (STANDARD_SHEET_SIZES.BACK_PANEL.width * STANDARD_SHEET_SIZES.BACK_PANEL.height) / 1000000

  const particleBoardSheetCount = Math.ceil(particleBoardArea / particleBoardSheetArea)
  const backPanelSheetCount = Math.ceil(backPanelArea / backPanelSheetArea)

  materials.push({
    type: "Laminated Particle Board (LDSB)",
    thickness: panelThickness,
    width: STANDARD_SHEET_SIZES.PARTICLE_BOARD.width,
    height: STANDARD_SHEET_SIZES.PARTICLE_BOARD.height,
    code: materialCode,
    count: particleBoardSheetCount,
    area: particleBoardArea,
  })

  if (hasDoors) {
    const doorCount = columnCount > 0 ? columnCount + 1 : 2
    materials.push({
      type: "Laminated Particle Board (LDSB)",
      thickness: panelThickness,
      width: STANDARD_SHEET_SIZES.PARTICLE_BOARD.width,
      height: STANDARD_SHEET_SIZES.PARTICLE_BOARD.height,
      code: doorMaterialCode,
      count: 1,
      area: (doorCount * (internalWidth / doorCount - 4) * (internalHeight - 4) * panelThickness) / 1000000,
    })
  }

  materials.push({
    type: "Particle Board (DVP)",
    thickness: backPanelThickness,
    width: STANDARD_SHEET_SIZES.BACK_PANEL.width,
    height: STANDARD_SHEET_SIZES.BACK_PANEL.height,
    code: backPanelCode,
    count: backPanelSheetCount,
    area: backPanelArea,
  })

  // Add hardware
  hardware.push({
    type: "Euro screws",
    count: euroScrewCount,
  })

  if (hasDoors) {
    hardware.push({
      type: "Door hinges",
      count: hingeCount,
    })
  }

  return {
    materials,
    parts,
    hardware,
    totalArea,
    totalEdgeBanding,
  }
}
