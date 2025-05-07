import { supabase } from "./supabase-client"
import type { Pattern, PatternCategory } from "@/types/pattern-types"

// Fallback patterns to use when database connection fails
const FALLBACK_PATTERNS: Pattern[] = [
  {
    id: "oak-natural",
    name: "Oak Natural",
    category: "wood",
    finishType: "natural",
    color_hex: "#D4B48C",
    is_premium: false,
    price_factor: 1.0,
    thumbnail_url: null,
  },
  {
    id: "walnut-classic",
    name: "Walnut Classic",
    category: "wood",
    finishType: "oiled",
    color_hex: "#5C4033",
    is_premium: false,
    price_factor: 1.2,
    thumbnail_url: null,
  },
  {
    id: "white-marble",
    name: "White Marble",
    category: "marble",
    finishType: "glossy",
    color_hex: "#F5F5F5",
    is_premium: true,
    price_factor: 1.5,
    thumbnail_url: null,
  },
  {
    id: "concrete-grey",
    name: "Concrete Grey",
    category: "concrete",
    finishType: "matte",
    color_hex: "#B0B0B0",
    is_premium: false,
    price_factor: 1.1,
    thumbnail_url: null,
  },
]

// Fetch all patterns from Supabase with fallback
export async function getAllPatterns(): Promise<Pattern[]> {
  try {
    console.log("Fetching patterns from Supabase database...")

    // Check if Supabase URL and key are available
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase credentials not available, using fallback patterns")
      return FALLBACK_PATTERNS
    }

    // Add a timeout to the fetch request
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        console.warn("Supabase request timed out, using fallback patterns")
        resolve(null)
      }, 5000) // 5 second timeout
    })

    // Race between the actual request and the timeout
    const result = await Promise.race([supabase.from("patterns").select("*").order("name"), timeoutPromise])

    // If timeout won the race
    if (!result) {
      return FALLBACK_PATTERNS
    }

    // If it's a Supabase response
    const { data, error } = result as any

    if (error) {
      console.error("Supabase error fetching patterns:", error)
      return FALLBACK_PATTERNS
    }

    // Log the patterns for debugging
    console.log(`Successfully fetched ${data?.length || 0} patterns from Supabase database`)

    if (data && data.length > 0) {
      // Log a sample pattern to verify structure
      console.log("Sample pattern from database:", {
        id: data[0].id,
        name: data[0].name,
        category: data[0].category,
        color_hex: data[0].color_hex,
        thumbnail_url: data[0].thumbnail_url,
      })
      return data
    } else {
      console.warn("No patterns found in database, using fallback patterns")
      return FALLBACK_PATTERNS
    }
  } catch (error) {
    console.error("Error in getAllPatterns:", error)
    console.warn("Using fallback patterns due to error")
    return FALLBACK_PATTERNS
  }
}

// Fetch patterns grouped by category
export async function getPatternsByCategory(): Promise<PatternCategory[]> {
  try {
    const patterns = await getAllPatterns()

    // Group patterns by finishType instead of category
    const categoriesMap = new Map<string, Pattern[]>()

    patterns.forEach((pattern) => {
      if (!pattern.finishType) {
        pattern.finishType = "solid" // Default finishType if missing
      }

      if (!categoriesMap.has(pattern.finishType)) {
        categoriesMap.set(pattern.finishType, [])
      }
      categoriesMap.get(pattern.finishType)?.push(pattern)
    })

    // Convert map to array of categories
    const categories: PatternCategory[] = []

    categoriesMap.forEach((patterns, finishTypeId) => {
      categories.push({
        id: finishTypeId,
        name: getCategoryName(finishTypeId),
        description: getCategoryDescription(finishTypeId),
        patterns,
      })
    })

    return categories
  } catch (error) {
    console.error("Error in getPatternsByCategory:", error)

    // Create fallback categories from fallback patterns
    const woodPatterns = FALLBACK_PATTERNS.filter((p) => p.category === "wood")
    const otherPatterns = FALLBACK_PATTERNS.filter((p) => p.category !== "wood")

    return [
      {
        id: "wood",
        name: "Wood Patterns",
        description: "Natural wood patterns with various grains and tones",
        patterns: woodPatterns,
      },
      {
        id: "other",
        name: "Other Materials",
        description: "Various other material options",
        patterns: otherPatterns,
      },
    ]
  }
}

// Get a specific pattern by ID
export async function getPatternById(id: string): Promise<Pattern | null> {
  try {
    console.log(`Fetching pattern with ID: ${id} from Supabase database`)

    // Check if it's one of our fallback patterns first
    const fallbackPattern = FALLBACK_PATTERNS.find((p) => p.id === id)
    if (fallbackPattern) {
      return fallbackPattern
    }

    // If Supabase isn't available, return null
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase credentials not available, pattern not found")
      return null
    }

    const { data, error } = await supabase.from("patterns").select("*").eq("id", id).single()

    if (error) {
      console.error("Supabase error fetching pattern by ID:", error)
      return null
    }

    if (data) {
      console.log("Successfully fetched pattern from database:", data.name)

      // If finishType is missing, set a default
      if (!data.finishType) {
        console.warn(`Pattern ${data.name} has no finishType, defaulting to 'solid'`)
        data.finishType = "solid"
      }

      return data
    } else {
      console.log("No pattern found in database with ID:", id)
    }

    return data
  } catch (error) {
    console.error("Error in getPatternById:", error)
    return null
  }
}

// Add a new pattern (admin function)
export async function addPattern(pattern: Omit<Pattern, "id" | "created_at">): Promise<Pattern | null> {
  try {
    const { data, error } = await supabase.from("patterns").insert([pattern]).select()

    if (error) {
      console.error("Error adding pattern:", error)
      throw error
    }

    return data?.[0] || null
  } catch (error) {
    console.error("Error in addPattern:", error)
    return null
  }
}

// Helper functions for category names and descriptions
function getCategoryName(categoryId: string): string {
  const categoryNames: Record<string, string> = {
    solid: "Solid Colors",
    wood: "Wood Patterns",
    marble: "Marble Patterns",
    fabric: "Fabric Textures",
    metal: "Metal Finishes",
    laminate: "Laminates",
    veneer: "Veneers",
    concrete: "Concrete",
    natural: "Natural Wood",
    oiled: "Oiled Wood",
    glossy: "Glossy Finish",
    matte: "Matte Finish",
  }

  return categoryNames[categoryId] || categoryId
}

function getCategoryDescription(categoryId: string): string {
  const categoryDescriptions: Record<string, string> = {
    solid: "Simple, elegant solid colors for a clean look",
    wood: "Natural wood patterns with various grains and tones",
    marble: "Luxurious marble patterns for a sophisticated appearance",
    fabric: "Textured fabric finishes for a warm, comfortable feel",
    metal: "Modern metal finishes for an industrial or contemporary style",
    laminate: "Durable laminate surfaces with a variety of patterns",
    veneer: "Real wood veneers for an authentic wood appearance",
    concrete: "Contemporary concrete finishes for an industrial look",
    natural: "Natural wood with minimal treatment",
    oiled: "Wood treated with oil for a rich, warm finish",
    glossy: "High-shine reflective finish",
    matte: "Non-reflective finish with a subtle texture",
  }

  return categoryDescriptions[categoryId] || ""
}

// Add a function to check if a thumbnail URL is accessible
async function checkThumbnailUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" })
    console.log(`Thumbnail URL check: ${url} - Status: ${response.status}`)
    return response.ok
  } catch (error) {
    console.error("Error checking thumbnail URL:", error)
    return false
  }
}

// Add a function to log all patterns with their thumbnail URLs
export async function logAllPatterns(): Promise<void> {
  try {
    const patterns = await getAllPatterns()
    console.log("All patterns:")
    patterns.forEach((pattern) => {
      console.log(`- ${pattern.name} (ID: ${pattern.id})`)
      console.log(`  Thumbnail URL: ${pattern.thumbnail_url || "none"}`)
      console.log(`  Color Hex: ${pattern.color_hex}`)
    })
  } catch (error) {
    console.error("Error logging patterns:", error)
  }
}

// Add a function to validate pattern URLs
export async function validatePatternUrls(pattern: Pattern): Promise<{ thumbnailValid: boolean }> {
  const result = {
    thumbnailValid: false,
  }

  // Validate thumbnail URL
  if (pattern.thumbnail_url) {
    try {
      const thumbnailResponse = await fetch(pattern.thumbnail_url, { method: "HEAD" })
      result.thumbnailValid = thumbnailResponse.ok
      console.log(`Thumbnail URL validation for ${pattern.name}: ${result.thumbnailValid ? "Valid" : "Invalid"}`)
    } catch (error) {
      console.error(`Error validating thumbnail URL for ${pattern.name}:`, error)
    }
  }

  return result
}

// Get all unique finishes (categories) from patterns
export async function getAllFinishes(): Promise<string[]> {
  try {
    const patterns = await getAllPatterns()

    // Extract unique finishTypes
    const finishTypes = new Set<string>()
    patterns.forEach((pattern) => {
      if (pattern.finishType) {
        finishTypes.add(pattern.finishType)
      }
    })

    return Array.from(finishTypes)
  } catch (error) {
    console.error("Error getting finishes:", error)
    return []
  }
}

// Add a function to get patterns by finish (category)
export async function getPatternsByFinish(finish: string): Promise<Pattern[]> {
  try {
    const patterns = await getAllPatterns()
    return patterns.filter((p) => p.finishType === finish)
  } catch (error) {
    console.error("Error in getPatternsByFinish:", error)
    return []
  }
}
