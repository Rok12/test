// Types and interfaces for the furniture builder

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface FurnitureType {
  name: string
  width: number
  height: number
  depth: number
  icon: any // Using any for simplicity, but ideally would be a more specific type
}

export interface MaterialOption {
  id: string
  name: string
  color: string
  description: string
  price: number
}

export interface MaterialCategory {
  id: string
  name: string
  description: string
  info: string
  options: MaterialOption[]
}

export interface Finish {
  id: string
  name: string
  factor: number
}

export interface DoorType {
  id: string
  name: string
}

export interface SegmentConfig {
  id: number
  doorDirection: string
}

export interface CompartmentDoor {
  type: string
}

export interface FurnitureModelProps {
  type: string
  dimensions: Dimensions
  material: string
  finish: string
  hasDoors: boolean
  shelfCount: number
  materialColor: string
  position?: [number, number, number]
  doorsOpen?: boolean
  segments?: number
  segmentConfig?: SegmentConfig[]
  hasMountingStrip?: boolean
  columnCount?: number
  compartmentDoors?: CompartmentDoor[]
  hasWhiteEdges?: boolean
  hasDrawers?: boolean
}
