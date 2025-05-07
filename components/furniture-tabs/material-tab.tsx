"use client"

import { MATERIAL_CATEGORIES, FINISHES } from "@/constants/furniture-constants"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

interface MaterialTabProps {
  materialCategory: string
  setMaterialCategory: (category: string) => void
  materialOption: string
  setMaterialOption: (option: string) => void
  finish: string
  setFinish: (finish: string) => void
}

export const MaterialTab = ({
  materialCategory,
  setMaterialCategory,
  materialOption,
  setMaterialOption,
  finish,
  setFinish,
}: MaterialTabProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-3 block">Material Type</Label>
        <Select
          value={materialCategory}
          onValueChange={(value) => {
            setMaterialCategory(value)
            // Set the first option of the new category as default
            const category = MATERIAL_CATEGORIES.find((cat) => cat.id === value)
            if (category && category.options.length > 0) {
              setMaterialOption(category.options[0].id)
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select material type" />
          </SelectTrigger>
          <SelectContent>
            {MATERIAL_CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4" />

      <div>
        <Label className="mb-3 block">Material Options</Label>

        {/* Show options for the selected category */}
        {MATERIAL_CATEGORIES.find((cat) => cat.id === materialCategory) && (
          <RadioGroup value={materialOption} onValueChange={setMaterialOption} className="grid grid-cols-2 gap-4">
            {MATERIAL_CATEGORIES.find((cat) => cat.id === materialCategory)?.options.map((option) => (
              <div key={option.id} className="flex items-start space-x-2">
                <RadioGroupItem value={option.id} id={`material-${option.id}`} className="mt-1" />
                <Label htmlFor={`material-${option.id}`} className="flex flex-col cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md border" style={{ backgroundColor: option.color }} />
                    <span>{option.name}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Only show finish options for solid wood */}
      {materialCategory === "solid-wood" && (
        <>
          <Separator className="my-4" />

          <div>
            <Label className="mb-3 block">Finish</Label>
            <RadioGroup value={finish} onValueChange={setFinish} className="grid grid-cols-2 gap-4">
              {FINISHES.map((fin) => (
                <div key={fin.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={fin.id} id={`finish-${fin.id}`} className="mt-1" />
                  <Label htmlFor={`finish-${fin.id}`} className="cursor-pointer">
                    <span>{fin.name}</span>
                    <span className="block text-xs text-gray-500">Price factor: {fin.factor.toFixed(2)}x</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  )
}
