export interface Pattern {
  id: string
  name: string
  finishType: string // Changed from category to finishType
  color_hex: string
  thumbnail_url?: string
  is_premium: boolean
  price_factor: number
  created_at?: string
  // Physical dimension properties
  length?: number // Length in cm
  width?: number // Width in cm
  thickness?: number // Thickness in mm
  texture_repeat_x?: number // How many times to repeat texture horizontally
  texture_repeat_y?: number // How many times to repeat texture vertically
}

export interface PatternCategory {
  id: string
  name: string
  description: string
  patterns: Pattern[]
}
