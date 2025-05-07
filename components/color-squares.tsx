"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { getAllPatterns } from "@/utils/pattern-service"
import type { Pattern } from "@/types/pattern-types"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ColorSquaresProps {
  onSelectPattern: (pattern: Pattern) => void
  selectedPatternId: string | null
}

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

export function ColorSquares({ onSelectPattern, selectedPatternId }: ColorSquaresProps) {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [thumbnailStatus, setThumbnailStatus] = useState<Record<string, boolean>>({})
  const [usingFallback, setUsingFallback] = useState(false)

  // Fetch patterns from Supabase
  useEffect(() => {
    async function fetchPatternsFromSupabase() {
      try {
        setIsLoading(true)
        setError(null)
        setUsingFallback(false)

        console.log("Fetching patterns from Supabase...")

        // Add a timeout to prevent hanging if Supabase is unreachable
        const timeoutPromise = new Promise<Pattern[]>((resolve) => {
          setTimeout(() => {
            console.warn("Pattern fetch timed out, using fallback patterns")
            setUsingFallback(true)
            resolve(FALLBACK_PATTERNS)
          }, 5000) // 5 second timeout
        })

        // Race between the actual request and the timeout
        const allPatterns = await Promise.race([getAllPatterns(), timeoutPromise])

        console.log(`Fetched ${allPatterns.length} patterns`)

        if (allPatterns.length === 0) {
          console.warn("No patterns found, using fallback patterns")
          setPatterns(FALLBACK_PATTERNS)
          setUsingFallback(true)
        } else {
          // Get exactly 4 patterns - prioritize these specific ones if available
          const preferredNames = ["White Marble", "Walnut Classic", "Oak Natural", "Concrete Grey"]
          const selectedPatterns: Pattern[] = []

          // First try to get the preferred patterns
          preferredNames.forEach((name) => {
            const pattern = allPatterns.find((p) => p.name === name)
            if (pattern) {
              console.log(`Found preferred pattern: ${name}`)
              selectedPatterns.push(pattern)
            }
          })

          // If we don't have 4, add others until we do
          if (selectedPatterns.length < 4) {
            allPatterns.forEach((pattern) => {
              if (selectedPatterns.length < 4 && !selectedPatterns.some((p) => p.id === pattern.id)) {
                console.log(`Adding additional pattern: ${pattern.name}`)
                selectedPatterns.push(pattern)
              }
            })
          }

          // If we still don't have 4, use fallback patterns to fill in
          if (selectedPatterns.length < 4) {
            console.warn(`Only found ${selectedPatterns.length} patterns, adding fallbacks`)
            FALLBACK_PATTERNS.forEach((pattern) => {
              if (selectedPatterns.length < 4 && !selectedPatterns.some((p) => p.id === pattern.id)) {
                selectedPatterns.push(pattern)
                setUsingFallback(true)
              }
            })
          }

          setPatterns(selectedPatterns)
        }

        // Initialize thumbnail status
        const initialStatus: Record<string, boolean> = {}
        patterns.forEach((pattern) => {
          initialStatus[pattern.id] = pattern.thumbnail_url ? true : false
        })
        setThumbnailStatus(initialStatus)
      } catch (err) {
        console.error("Error loading patterns from Supabase:", err)
        setError("Failed to load materials from database")
        setPatterns(FALLBACK_PATTERNS)
        setUsingFallback(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatternsFromSupabase()
  }, [])

  const handleThumbnailError = (patternId: string) => {
    console.log(`Thumbnail failed to load for pattern ID: ${patternId}`)
    setThumbnailStatus((prev) => ({
      ...prev,
      [patternId]: false,
    }))
  }

  const handleRetry = () => {
    setIsLoading(true)
    setError(null)
    window.location.reload()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Loading materials...</span>
      </div>
    )
  }

  if (error && !usingFallback) {
    return (
      <div className="p-4 text-center text-red-500">
        <AlertCircle className="h-5 w-5 mx-auto mb-2" />
        <p>{error}</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={handleRetry}>
          Retry
        </Button>
      </div>
    )
  }

  if (patterns.length === 0) {
    return <div className="p-4 text-center">No materials found</div>
  }

  return (
    <TooltipProvider>
      {usingFallback && (
        <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
          <p>Using offline materials. Some features may be limited.</p>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {patterns.map((pattern) => (
          <Tooltip key={pattern.id}>
            <TooltipTrigger asChild>
              <div
                className={`relative overflow-hidden rounded-md border-2 transition-all cursor-pointer
                  ${
                    pattern.id === selectedPatternId
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                onClick={() => onSelectPattern(pattern)}
              >
                <div className="aspect-square">
                  {pattern.thumbnail_url && thumbnailStatus[pattern.id] ? (
                    <img
                      src={pattern.thumbnail_url || "/placeholder.svg"}
                      alt={pattern.name}
                      className="w-full h-full object-cover"
                      onError={() => handleThumbnailError(pattern.id)}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ backgroundColor: pattern.color_hex }}
                    >
                      <span className="text-xs text-center p-1 text-white bg-black/30 rounded">{pattern.name}</span>
                    </div>
                  )}
                </div>
                <div className="w-full p-2 text-center bg-white border-t">{pattern.name}</div>
                {pattern.id === selectedPatternId && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full"></div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {pattern.name} - {pattern.finishType || pattern.category}
                {pattern.is_premium && " (Premium)"}
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
