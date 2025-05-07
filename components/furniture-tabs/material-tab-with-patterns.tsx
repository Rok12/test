"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { ColorSquares } from "@/components/color-squares"
import type { Pattern } from "@/types/pattern-types"
import { getPatternById } from "@/utils/pattern-service"

interface MaterialTabWithPatternsProps {
  selectedPattern: string | null
  setSelectedPattern: (patternId: string | null) => void
  finish: string
  setFinish: (finish: string) => void
  selectedColor?: string
  setSelectedColor?: (colorId: string) => void
  onPatternSelect?: (pattern: Pattern) => void
}

export const MaterialTabWithPatterns = ({
  selectedPattern,
  setSelectedPattern,
  finish,
  setFinish,
  selectedColor = "natural-oak",
  setSelectedColor,
  onPatternSelect,
}: MaterialTabWithPatternsProps) => {
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null)

  // Load the current pattern details when selectedPattern changes
  useEffect(() => {
    if (!selectedPattern) {
      setCurrentPattern(null)
      return
    }

    const loadPatternDetails = async () => {
      try {
        const pattern = await getPatternById(selectedPattern)
        if (pattern) {
          setCurrentPattern(pattern)
          console.log("Current pattern loaded:", pattern.name)
        }
      } catch (error) {
        console.error("Error loading pattern details:", error)
      }
    }

    loadPatternDetails()
  }, [selectedPattern])

  const handlePatternSelect = async (pattern: Pattern) => {
    console.log("Material selected from Supabase:", pattern.name)
    console.log("Pattern ID:", pattern.id)
    console.log("Pattern finishType:", pattern.finishType)
    console.log("Thumbnail URL:", pattern.thumbnail_url)
    console.log("Pattern dimensions:", {
      length: pattern.length || 100,
      width: pattern.width || 100,
      thickness: pattern.thickness || 18,
      textureRepeatX: pattern.texture_repeat_x || 1,
      textureRepeatY: pattern.texture_repeat_y || 1,
    })

    // Set the current pattern
    setCurrentPattern(pattern)

    // Set the selected pattern ID
    setSelectedPattern(pattern.id)

    // If onPatternSelect is provided, call it with the full pattern object
    if (onPatternSelect) {
      onPatternSelect(pattern)
    }

    // If setSelectedColor is provided, map pattern name to color ID
    if (setSelectedColor) {
      const colorId =
        pattern.name === "White Marble"
          ? "white-marble"
          : pattern.name === "Walnut Classic"
            ? "walnut-classic"
            : pattern.name === "Oak Natural"
              ? "oak-natural"
              : "concrete-grey"
      setSelectedColor(colorId)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block text-lg font-medium">Material Selection</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Select a material from our database to apply to your furniture
        </p>

        <ColorSquares onSelectPattern={handlePatternSelect} selectedPatternId={selectedPattern} />

        {currentPattern && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium text-sm">Selected Material: {currentPattern.name}</h4>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>
                Finish Type: <span className="font-semibold">{currentPattern.finishType || "Standard"}</span>
              </div>
              <div>Thickness: {currentPattern.thickness || 18}mm</div>
              <div>Price Factor: {currentPattern.price_factor || 1.0}x</div>
              {currentPattern.is_premium && (
                <div className="col-span-2 text-amber-600 font-medium">Premium Material</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
