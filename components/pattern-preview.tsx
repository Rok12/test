"use client"

import { useState, useEffect } from "react"
import { getPatternById } from "@/utils/pattern-service"
import type { Pattern } from "@/types/pattern-types"

interface PatternPreviewProps {
  patternId: string
}

export function PatternPreview({ patternId }: PatternPreviewProps) {
  const [pattern, setPattern] = useState<Pattern | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPattern = async () => {
      try {
        setIsLoading(true)
        const data = await getPatternById(patternId)
        setPattern(data)
      } catch (error) {
        console.error("Error loading pattern:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPattern()
  }, [patternId])

  if (isLoading || !pattern) {
    return <div className="h-40 bg-gray-100 rounded-md animate-pulse" />
  }

  return (
    <div className="h-40 rounded-md overflow-hidden">
      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: pattern.color_hex }}>
        <span className="text-white text-opacity-70 font-medium">{pattern.name}</span>
      </div>
    </div>
  )
}
