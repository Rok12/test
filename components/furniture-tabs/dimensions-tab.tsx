"use client"

import type { Dimensions } from "@/types/furniture-types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"

interface DimensionsTabProps {
  dimensions: Dimensions
  setDimensions: (dimensions: Dimensions) => void
}

export const DimensionsTab = ({ dimensions, setDimensions }: DimensionsTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="width">Width (cm)</Label>
          <span className="text-sm text-gray-500">{dimensions.width} cm</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="width"
            type="number"
            min={30}
            max={300}
            value={dimensions.width}
            onChange={(e) => setDimensions({ ...dimensions, width: Number.parseInt(e.target.value) || 30 })}
            className="w-20"
          />
          <Slider
            value={[dimensions.width]}
            min={30}
            max={300}
            step={1}
            onValueChange={(value) => setDimensions({ ...dimensions, width: value[0] })}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="height">Height (cm)</Label>
          <span className="text-sm text-gray-500">{dimensions.height} cm</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="height"
            type="number"
            min={30}
            max={300}
            value={dimensions.height}
            onChange={(e) => setDimensions({ ...dimensions, height: Number.parseInt(e.target.value) || 30 })}
            className="w-20"
          />
          <Slider
            value={[dimensions.height]}
            min={30}
            max={300}
            step={1}
            onValueChange={(value) => setDimensions({ ...dimensions, height: value[0] })}
            className="flex-1"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <Label htmlFor="depth">Depth (cm)</Label>
          <span className="text-sm text-gray-500">{dimensions.depth} cm</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="depth"
            type="number"
            min={20}
            max={150}
            value={dimensions.depth}
            onChange={(e) => setDimensions({ ...dimensions, depth: Number.parseInt(e.target.value) || 20 })}
            className="w-20"
          />
          <Slider
            value={[dimensions.depth]}
            min={20}
            max={150}
            step={1}
            onValueChange={(value) => setDimensions({ ...dimensions, depth: value[0] })}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
