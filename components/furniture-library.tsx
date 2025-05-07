"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Search, BookOpen, Table, Archive, Monitor, Tv } from "lucide-react"

interface FurnitureLibraryProps {
  onSelectItem: (type: string) => void
}

export function FurnitureLibrary({ onSelectItem }: FurnitureLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Furniture categories
  const categories = [
    { id: "all", name: "All" },
    { id: "bookshelf", name: "Bookshelves", icon: BookOpen },
    { id: "table", name: "Tables", icon: Table },
    { id: "cabinet", name: "Cabinets", icon: Archive },
    { id: "desk", name: "Desks", icon: Monitor },
    { id: "sideboard", name: "Sideboards", icon: Tv },
  ]

  // Furniture items
  const furnitureItems = [
    { id: "bookshelf-standard", type: "bookshelf", name: "Standard Bookshelf", icon: BookOpen },
    { id: "bookshelf-tall", type: "bookshelf", name: "Tall Bookshelf", icon: BookOpen },
    { id: "table-dining", type: "table", name: "Dining Table", icon: Table },
    { id: "table-coffee", type: "table", name: "Coffee Table", icon: Table },
    { id: "cabinet-storage", type: "cabinet", name: "Storage Cabinet", icon: Archive },
    { id: "cabinet-display", type: "cabinet", name: "Display Cabinet", icon: Archive },
    { id: "desk-office", type: "desk", name: "Office Desk", icon: Monitor },
    { id: "desk-writing", type: "desk", name: "Writing Desk", icon: Monitor },
    { id: "sideboard-media", type: "sideboard", name: "Media Sideboard", icon: Tv },
    { id: "sideboard-buffet", type: "sideboard", name: "Buffet Sideboard", icon: Tv },
  ]

  // Filter items based on search query
  const filteredItems = searchQuery
    ? furnitureItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : furnitureItems

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Furniture Library</h2>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search furniture..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {categories.slice(1).map((category) => (
              <div key={category.id}>
                <h3 className="font-medium text-sm mb-2">{category.name}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredItems
                    .filter((item) => category.id === "all" || item.type === category.id)
                    .map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.id}
                          className="border rounded p-2 cursor-pointer hover:bg-gray-50"
                          onClick={() => onSelectItem(item.type)}
                        >
                          <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-1">
                            {Icon && <Icon className="h-8 w-8 text-gray-500" />}
                          </div>
                          <p className="text-xs text-center truncate">{item.name}</p>
                        </div>
                      )
                    })
                    .slice(0, 4)}
                </div>
                <Separator className="my-3" />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="text-center py-8 text-gray-500">
            <p>No recent items</p>
          </div>
        </TabsContent>

        <TabsContent value="saved">
          <div className="text-center py-8 text-gray-500">
            <p>No saved items</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
