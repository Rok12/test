import { MATERIAL_CATEGORIES, BASE_PRICES, FINISHES } from "@/constants/furniture-constants"
import type { Dimensions, CompartmentDoor } from "@/types/furniture-types"

// Get the selected material color
export const getSelectedMaterialColor = (materialCategory: string, materialOption: string): string => {
  const category = MATERIAL_CATEGORIES.find((cat) => cat.id === materialCategory)
  if (!category) return "#FFFFFF" // Default to white if category not found

  const option = category.options.find((opt) => opt.id === materialOption)
  return option ? option.color : "#FFFFFF" // Default to white if option not found
}

// Get the selected material price factor
export const getSelectedMaterialPrice = (materialCategory: string, materialOption: string): number => {
  const category = MATERIAL_CATEGORIES.find((cat) => cat.id === materialCategory)
  if (!category) return 1.0

  const option = category.options.find((opt) => opt.id === materialOption)
  return option ? option.price : 1.0
}

// Calculate price based on selections
export const calculatePrice = (
  furnitureType: string,
  dimensions: Dimensions,
  materialCategory: string,
  materialOption: string,
  finish: string,
  hasDoors: boolean,
  shelfCount: number,
  hasMountingStrip: boolean,
  columnCount: number,
  compartmentDoors: CompartmentDoor[],
  hasWhiteEdges: boolean,
): number => {
  const basePrice = BASE_PRICES[furnitureType] || 199
  const materialFactor = getSelectedMaterialPrice(materialCategory, materialOption)
  const finishFactor = materialCategory === "solid-wood" ? FINISHES.find((f) => f.id === finish)?.factor || 1 : 1

  // Calculate volume in cubic meters
  const volume = (dimensions.width * dimensions.height * dimensions.depth) / 1000000

  // Door cost - count doors in all compartments
  let doorsCost = 0
  if (hasDoors) {
    compartmentDoors.forEach((door) => {
      if (door.type === "double") {
        doorsCost += 80 // Double doors cost more
      } else if (door.type !== "none") {
        doorsCost += 50 // Single door
      }
    })
  }

  // Shelf cost
  const shelvesCost = shelfCount * 15

  // Mounting strip cost
  const mountingStripCost = hasMountingStrip ? 25 : 0

  // Column dividers cost
  const columnDividersCost = columnCount > 0 ? columnCount * 20 : 0

  // Edge banding cost - more expensive if all edges are white
  const edgeBandingCost = hasWhiteEdges ? 40 : 20

  return (
    Math.round(
      (basePrice +
        volume * 1000 * materialFactor * finishFactor +
        doorsCost +
        shelvesCost +
        mountingStripCost +
        columnDividersCost +
        edgeBandingCost) *
        100,
    ) / 100
  )
}

// Calculate the maximum number of columns based on furniture width
export const calculateMaxColumns = (width: number): number => {
  return Math.max(Math.floor(width / 30) - 1, 0)
}
