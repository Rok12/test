"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Table, Archive, Monitor, Tv } from "lucide-react"

interface FurnitureLibraryItemProps {
  type: string
  name: string
  dimensions: string
  onSelect: () => void
}

const iconMap = {
  closet: BookOpen,
  table: Table,
  cabinet: Archive,
  desk: Monitor,
  sideboard: Tv,
}

export function FurnitureLibraryItem({ type, name, dimensions, onSelect }: FurnitureLibraryItemProps) {
  const Icon = iconMap[type as keyof typeof iconMap] || BookOpen

  return (
    <Card className="cursor-pointer hover:border-primary transition-colors" onClick={onSelect}>
      <CardContent className="p-3">
        <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
          <Icon className="w-10 h-10 text-gray-700" />
        </div>
        <p className="text-sm font-medium text-center">{name}</p>
        <p className="text-xs text-center text-gray-500">{dimensions} cm</p>
      </CardContent>
    </Card>
  )
}
