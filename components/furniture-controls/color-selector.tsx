"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { getAllPatterns } from "@/utils/pattern-service"
import { getPatternById } from "@/utils/pattern-service"

interface ColorOption {
  id: string
  name: string
  color: string
  patternId: string | null
}

interface ColorSelectorProps {
  selectedColor: string
  onColorChange: (colorId: string, patternId: string | null) => void
}

interface Pattern {
  id: string
  name: string
  texture_url: string
  thumbnail_url: string
}

// Update the ColorSelector component to better handle thumbnails

// Add proper loading and error handling for thumbnails
export function ColorSelector({ selectedColor, onColorChange }: ColorSelectorProps) {
  // Update the colorOptions array to only include the 4 specific materials
  const [colorOptions, setColorOptions] = useState<ColorOption[]>([
    { id: "white-marble", name: "White Marble", color: "#F5F5F5", patternId: null },
    { id: "walnut-classic", name: "Walnut Classic", color: "#5C4033", patternId: null },
    { id: "oak-natural", name: "Oak Natural", color: "#D4BE9C", patternId: null },
    { id: "concrete-grey", name: "Concrete Grey", color: "#808080", patternId: null },
  ])

  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  // Update the pattern matching logic to use the exact names
  useEffect(() => {
    const loadPatterns = async () => {
      try {
        // Initialize loading states
        const initialLoadingStates: Record<string, boolean> = {}
        colorOptions.forEach((option) => {
          initialLoadingStates[option.id] = true
        })
        setLoadingStates(initialLoadingStates)

        const allPatterns = await getAllPatterns()
        setPatterns(allPatterns)

        console.log("Loaded patterns for color selector:")

        // Create a mapping of pattern names to IDs
        const updatedOptions = colorOptions.map((option) => {
          let patternId = null
          let matchedPattern = null

          // Find matching pattern based on exact name
          if (option.id === "white-marble") {
            matchedPattern = allPatterns.find((p) => p.name === "White Marble")
          } else if (option.id === "walnut-classic") {
            matchedPattern = allPatterns.find((p) => p.name === "Walnut Classic")
          } else if (option.id === "oak-natural") {
            matchedPattern = allPatterns.find((p) => p.name === "Oak Natural")
          } else if (option.id === "concrete-grey") {
            matchedPattern = allPatterns.find((p) => p.name === "Concrete Grey")
          }

          patternId = matchedPattern?.id || null

          if (matchedPattern) {
            console.log(
              `- ${option.name}: patternId=${patternId}, texture=${matchedPattern.texture_url}, thumbnail=${matchedPattern.thumbnail_url}`,
            )

            // Validate URLs for this pattern
            validatePatternUrls(matchedPattern)
              .then(() => {
                setLoadingStates((prev) => ({
                  ...prev,
                  [option.id]: false,
                }))
              })
              .catch((error) => {
                console.error(`Error validating URLs for ${option.name}:`, error)
                setLoadingStates((prev) => ({
                  ...prev,
                  [option.id]: false,
                }))
              })
          } else {
            console.log(`- ${option.name}: No matching pattern found`)
            setLoadingStates((prev) => ({
              ...prev,
              [option.id]: false,
            }))
          }

          return { ...option, patternId }
        })

        setColorOptions(updatedOptions)
      } catch (error) {
        console.error("Error loading pattern IDs:", error)
        // Set all loading states to false on error
        const errorLoadingStates: Record<string, boolean> = {}
        colorOptions.forEach((option) => {
          errorLoadingStates[option.id] = false
        })
        setLoadingStates(errorLoadingStates)
      }
    }

    loadPatterns()
  }, [])

  const validatePatternUrls = async (pattern: Pattern) => {
    if (!pattern.texture_url || !pattern.thumbnail_url) {
      throw new Error("Texture or thumbnail URL is missing.")
    }

    try {
      // Check if the texture URL is valid
      const textureResponse = await fetch(pattern.texture_url, { method: "HEAD" })
      if (!textureResponse.ok) {
        throw new Error(`Texture URL failed to load: ${textureResponse.status} ${textureResponse.statusText}`)
      }

      // Check if the thumbnail URL is valid
      const thumbnailResponse = await fetch(pattern.thumbnail_url, { method: "HEAD" })
      if (!thumbnailResponse.ok) {
        throw new Error(`Thumbnail URL failed to load: ${thumbnailResponse.status} ${thumbnailResponse.statusText}`)
      }
    } catch (error) {
      console.error("URL validation error:", error)
      throw error // Re-throw the error to be caught by the caller
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {colorOptions.map((option) => {
        // Find the full pattern object for this option
        const pattern = patterns.find((p) => p.id === option.patternId)
        const isLoading = loadingStates[option.id] || false

        return (
          <button
            key={option.id}
            className={cn(
              "w-10 h-10 rounded-md border-2 transition-all relative",
              selectedColor === option.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-gray-200 hover:border-gray-300",
            )}
            style={{ backgroundColor: option.color }}
            onClick={async () => {
              // If patternId is available, load the full pattern data first
              if (option.patternId) {
                try {
                  const fullPattern = await getPatternById(option.patternId)
                  if (fullPattern) {
                    console.log(`Selected ${fullPattern.name}:`)
                    console.log(`- Texture URL: ${fullPattern.texture_url || "none"}`)
                    console.log(`- Thumbnail URL: ${fullPattern.thumbnail_url || "none"}`)

                    // Validate URLs before passing to parent
                    await validatePatternUrls(fullPattern)

                    // Pass both the color ID and the pattern ID to the parent component
                    onColorChange(option.id, option.patternId)
                  } else {
                    console.error(`Pattern not found for ID: ${option.patternId}`)
                    onColorChange(option.id, null)
                  }
                } catch (error) {
                  console.error("Error loading pattern details:", error)
                  onColorChange(option.id, null)
                }
              } else {
                onColorChange(option.id, null)
              }
            }}
            title={option.name}
            aria-label={`Select ${option.name} color`}
            disabled={isLoading}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-md">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
