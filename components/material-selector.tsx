"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { getAllPatterns } from "@/utils/pattern-service"
import type { Pattern } from "@/types/pattern-types"

interface MaterialSelectorProps {
  onSelectPattern: (pattern: Pattern) => void
  selectedPatternId: string | null
}

export function MaterialSelector({ onSelectPattern, selectedPatternId }: MaterialSelectorProps) {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPatterns() {
      try {
        setIsLoading(true)
        setError(null)

        const allPatterns = await getAllPatterns()

        // Filter to get just 4 patterns (preferably one from each main category)
        // This ensures we have a good variety of materials
        const mainPatterns: Pattern[] = []

        // Try to get one pattern from each of these categories if available
        const desiredCategories = ["wood", "marble", "solid", "metal"]

        // First, try to get one from each category
        desiredCategories.forEach((category) => {
          const patternFromCategory = allPatterns.find((p) => p.category === category)
          if (patternFromCategory && mainPatterns.length < 4) {
            mainPatterns.push(patternFromCategory)
          }
        })

        // If we don't have 4 yet, add more from any category
        if (mainPatterns.length < 4) {
          allPatterns.forEach((pattern) => {
            if (mainPatterns.length < 4 && !mainPatterns.includes(pattern)) {
              mainPatterns.push(pattern)
            }
          })
        }

        // If we still don't have enough, just use what we have
        setPatterns(mainPatterns.length > 0 ? mainPatterns : allPatterns.slice(0, 4))
      } catch (err) {
        console.error("Error loading patterns:", err)
        setError("Failed to load materials. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadPatterns()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm">Loading materials...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 text-center text-red-500 text-sm">
        <p>{error}</p>
      </div>
    )
  }

  if (patterns.length === 0) {
    return <div className="p-2 text-center text-muted-foreground text-sm">No materials found.</div>
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {patterns.map((pattern) => (
        <MaterialSquare
          key={pattern.id}
          pattern={pattern}
          isSelected={pattern.id === selectedPatternId}
          onSelect={() => onSelectPattern(pattern)}
        />
      ))}
    </div>
  )
}

interface MaterialSquareProps {
  pattern: Pattern
  isSelected: boolean
  onSelect: () => void
}

function MaterialSquare({ pattern, isSelected, onSelect }: MaterialSquareProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div
      className={`cursor-pointer transition-all overflow-hidden rounded-md border ${
        isSelected ? "ring-2 ring-primary border-primary" : "hover:border-gray-400"
      }`}
      onClick={onSelect}
    >
      <div className="aspect-square relative">
        {pattern.thumbnail_url && !imageError ? (
          <img
            src={pattern.thumbnail_url || "/placeholder.svg"}
            alt={pattern.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: pattern.color_hex }}
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white text-center text-sm">
          {pattern.name}
        </div>
      </div>
    </div>
  )
}
