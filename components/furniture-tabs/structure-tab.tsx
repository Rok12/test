"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { calculateMaxColumns } from "@/utils/furniture-utils"

interface StructureTabProps {
  furnitureType: string
  shelfCount: number
  setShelfCount: (count: number) => void
  columnCount: number
  setColumnCount: (count: number) => void
  hasMountingStrip: boolean
  setHasMountingStrip: (has: boolean) => void
  dimensions: { width: number; height: number; depth: number }
}

export const StructureTab = ({
  furnitureType,
  shelfCount,
  setShelfCount,
  columnCount,
  setColumnCount,
  hasMountingStrip,
  setHasMountingStrip,
  dimensions,
}: StructureTabProps) => {
  const maxColumns = calculateMaxColumns(dimensions.width)

  if (furnitureType === "table") {
    return <div className="text-center text-gray-500 py-4">No additional structure options available for tables.</div>
  }

  return (
    <div className="space-y-4">
      {furnitureType === "bookshelf" && (
        <>
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="shelf-count">Shelves</Label>
              <span className="text-sm text-gray-500">{shelfCount}</span>
            </div>
            <Slider
              id="shelf-count"
              value={[shelfCount]}
              min={0}
              max={10}
              step={1}
              onValueChange={(value) => setShelfCount(value[0])}
            />
          </div>

          {/* Column Dividers - simplified to just the slider */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <Label htmlFor="column-count">Columns</Label>
              <span className="text-sm text-gray-500">{columnCount}</span>
            </div>
            <Slider
              id="column-count"
              value={[columnCount]}
              min={0}
              max={maxColumns}
              step={1}
              onValueChange={(value) => setColumnCount(value[0])}
              className="flex-1"
            />
          </div>

          {/* Shelf Mounting Holes Strip */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col">
              <Label htmlFor="has-mounting-strip" className="mb-1">
                Shelf Mounting Strip
              </Label>
              <span className="text-xs text-gray-500">Add a strip with mounting holes for adjustable shelves</span>
            </div>
            <Switch id="has-mounting-strip" checked={hasMountingStrip} onCheckedChange={setHasMountingStrip} />
          </div>
        </>
      )}
    </div>
  )
}
