"use client"

import { useState } from "react"
import { BookOpen, Table, Archive, Monitor, Tv, Layers, ChevronRight, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Furniture types with their default dimensions and icons
const FURNITURE_TYPES = {
  bookshelf: { name: "Bookshelf", width: 80, height: 180, depth: 30, icon: BookOpen },
  table: { name: "Table", width: 120, height: 75, depth: 80, icon: Table },
  cabinet: { name: "Cabinet", width: 100, height: 90, depth: 45, icon: Archive },
  desk: { name: "Desk", width: 140, height: 75, depth: 60, icon: Monitor },
  sideboard: { name: "Sideboard", width: 160, height: 80, depth: 40, icon: Tv },
}

// Furniture categories
const FURNITURE_CATEGORIES = [
  { id: "room", name: "Room" },
  { id: "vertical", name: "Vertical" },
  { id: "horizontal", name: "Horizontal" },
  { id: "freeform", name: "Freeform" },
  { id: "kitchens", name: "Kitchens" },
  { id: "cabinets", name: "Cabinets" },
  { id: "dressers", name: "Dressers & Stands" },
  { id: "tables", name: "Tables" },
  { id: "wardrobes", name: "Wardrobes" },
  { id: "beds", name: "Beds" },
  { id: "equipment", name: "Home Equipment" },
  { id: "details", name: "Details" },
  { id: "other", name: "Other" },
]

interface LeftSidebarProps {
  onSelectFurnitureType: (type: string) => void
  selectedFurnitureType: string
  furnitureElements: any[]
  onElementSelect: (elementId: string) => void
  selectedElementId: string | null
}

export function LeftSidebar({
  onSelectFurnitureType,
  selectedFurnitureType,
  furnitureElements,
  onElementSelect,
  selectedElementId,
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter items based on search query
  const filteredTypes = searchQuery
    ? Object.entries(FURNITURE_TYPES).filter(([key, value]) =>
        value.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : Object.entries(FURNITURE_TYPES)

  return (
    <div className="w-[220px] h-full border-r bg-background flex flex-col">
      <Tabs defaultValue="library" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-2 mt-2">
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="elements">Elements</TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="flex-1 flex flex-col">
          <div className="relative px-2 py-2">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search furniture..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="overflow-auto flex-1">
            {FURNITURE_CATEGORIES.map((category) => (
              <div key={category.id} className="px-2">
                <Button variant="ghost" className="w-full justify-start text-sm h-8 px-2 font-normal">
                  {category.name}
                </Button>
              </div>
            ))}

            <Separator className="my-2" />

            <div className="grid grid-cols-2 gap-2 p-2">
              {filteredTypes.map(([key, value]) => {
                const IconComponent = value.icon
                return (
                  <div
                    key={key}
                    className={cn(
                      "border rounded-lg p-2 cursor-pointer hover:border-primary transition-colors",
                      selectedFurnitureType === key && "border-primary bg-primary/5",
                    )}
                    onClick={() => onSelectFurnitureType(key)}
                  >
                    <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-gray-700" />
                    </div>
                    <p className="text-xs font-medium text-center truncate">{value.name}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="p-2 border-t">
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="elements" className="flex-1 flex flex-col">
          <div className="overflow-auto flex-1 p-2">
            {furnitureElements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No elements added yet</p>
                <p className="text-xs mt-1">Add furniture from the Library tab</p>
              </div>
            ) : (
              <div className="space-y-1">
                {furnitureElements.map((element) => (
                  <Button
                    key={element.id}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-sm h-8 px-2 font-normal",
                      selectedElementId === element.id && "bg-primary/10 text-primary",
                    )}
                    onClick={() => onElementSelect(element.id)}
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    <span className="truncate">{element.name}</span>
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
