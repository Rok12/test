"use client"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DOOR_TYPES } from "@/constants/furniture-constants"
import type { CompartmentDoor } from "@/types/furniture-types"

interface DoorsTabProps {
  furnitureType: string
  hasDoors: boolean
  setHasDoors: (has: boolean) => void
  doorsOpen: boolean
  setDoorsOpen: (open: boolean) => void
  doorConfig: string
  setDoorConfig: (config: string) => void
  doorDirection: string
  setDoorDirection: (direction: string) => void
  columnCount: number
  compartmentDoors: CompartmentDoor[]
  updateCompartmentDoorType: (index: number, type: string) => void
}

export const DoorsTab = ({
  furnitureType,
  hasDoors,
  setHasDoors,
  doorsOpen,
  setDoorsOpen,
  doorConfig,
  setDoorConfig,
  doorDirection,
  setDoorDirection,
  columnCount,
  compartmentDoors,
  updateCompartmentDoorType,
}: DoorsTabProps) => {
  if (furnitureType === "table" || furnitureType === "desk") {
    return (
      <div className="text-center text-gray-500 py-4">
        {furnitureType === "table" ? "Tables" : "Desks"} do not support doors.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Label htmlFor="has-doors" className="mb-1">
            Add Doors
          </Label>
        </div>
        <Switch id="has-doors" checked={hasDoors} onCheckedChange={setHasDoors} />
      </div>

      {hasDoors && (
        <>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
            <Label htmlFor="toggle-doors">Open/Close All Doors</Label>
            <Switch id="toggle-doors" checked={doorsOpen} onCheckedChange={setDoorsOpen} />
          </div>

          {/* Compartment Door Configuration */}
          {columnCount > 0 && (
            <div className="mt-4">
              <Label className="mb-3 block">Compartment Doors</Label>
              <Accordion type="multiple" className="w-full">
                {compartmentDoors.map((door, index) => (
                  <AccordionItem key={index} value={`compartment-${index}`}>
                    <AccordionTrigger className="text-sm">Compartment {index + 1} Door</AccordionTrigger>
                    <AccordionContent>
                      <Select value={door.type} onValueChange={(value) => updateCompartmentDoorType(index, value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select door type" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOOR_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* If no columns, show the original door config */}
          {columnCount === 0 && (
            <>
              <div className="space-y-3"></div>

              <div className="space-y-3">
                <Label>Door Configuration</Label>

                <RadioGroup value={doorConfig} onValueChange={setDoorConfig} className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="one" id="door-one" className="mt-1" />
                    <Label htmlFor="door-one" className="cursor-pointer">
                      One door
                    </Label>
                  </div>

                  {doorConfig === "one" && (
                    <div className="ml-6 mt-2 flex items-center space-x-4">
                      <Button
                        variant={doorDirection === "left" ? "default" : "outline"}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setDoorDirection("left")}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Left
                      </Button>
                      <Button
                        variant={doorDirection === "right" ? "default" : "outline"}
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setDoorDirection("right")}
                      >
                        Right
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="two" id="door-two" className="mt-1" />
                    <Label htmlFor="door-two" className="cursor-pointer">
                      Two doors (split in center)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
