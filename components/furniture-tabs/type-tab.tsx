"use client"
import { FURNITURE_TYPES } from "@/constants/furniture-constants"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface TypeTabProps {
  furnitureType: string
  setFurnitureType: (type: string) => void
}

export const TypeTab = ({ furnitureType, setFurnitureType }: TypeTabProps) => {
  return (
    <div className="space-y-4">
      <Label>Select Furniture Type</Label>
      <Select value={furnitureType} onValueChange={setFurnitureType}>
        <SelectTrigger>
          <SelectValue placeholder="Select furniture type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(FURNITURE_TYPES).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {Object.entries(FURNITURE_TYPES).map(([key, value]) => {
          const IconComponent = value.icon
          return (
            <div
              key={key}
              className={cn(
                "border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors",
                furnitureType === key && "border-primary bg-primary/5",
              )}
              onClick={() => setFurnitureType(key)}
            >
              <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                <IconComponent className="w-12 h-12 text-gray-700" />
              </div>
              <p className="text-sm font-medium text-center">{value.name}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
