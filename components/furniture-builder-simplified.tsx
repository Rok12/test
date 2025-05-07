"use client"
import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import {
  RotateCcw,
  ShoppingCart,
  Heart,
  Save,
  Maximize,
  Minimize,
  DoorOpen,
  BookOpen,
  Table,
  Archive,
  Monitor,
  Tv,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SimplifiedFurnitureModel } from "@/components/simplified-furniture-model"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Furniture types with their default dimensions and icons
const FURNITURE_TYPES = {
  bookshelf: { name: "Bookshelf", width: 80, height: 180, depth: 30, icon: BookOpen },
  table: { name: "Table", width: 120, height: 75, depth: 80, icon: Table },
  cabinet: { name: "Cabinet", width: 100, height: 90, depth: 45, icon: Archive },
  desk: { name: "Desk", width: 140, height: 75, depth: 60, icon: Monitor },
  sideboard: { name: "Sideboard", width: 160, height: 80, depth: 40, icon: Tv },
}

// Materials with their properties (simplified)
const MATERIAL_CATEGORIES = [
  {
    id: "premium-decor",
    name: "Premium Decor",
    options: [
      { id: "white", name: "White", color: "#FFFFFF", price: 1.2 },
      { id: "grey", name: "Grey", color: "#CCCCCC", price: 1.2 },
      { id: "black", name: "Black", color: "#222222", price: 1.3 },
      { id: "beige", name: "Beige", color: "#E8D0A9", price: 1.2 },
    ],
  },
  {
    id: "solid-wood",
    name: "Solid Wood",
    options: [
      { id: "oak", name: "Oak", color: "#D4BE9C", price: 1.8 },
      { id: "walnut", name: "Walnut", color: "#5C4033", price: 2.0 },
    ],
  },
]

// Finishes with their properties
const FINISHES = [
  { id: "natural", name: "Natural", factor: 1.0 },
  { id: "matte", name: "Matte", factor: 1.1 },
  { id: "glossy", name: "Glossy", factor: 1.2 },
]

// Door toggle button component
const DoorToggleButton = ({ isOpen, onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" className="bg-white absolute top-16 right-4 z-10" onClick={onClick}>
            <DoorOpen className={cn("h-4 w-4", isOpen && "text-amber-500")} />
            <span className="sr-only">Toggle Doors</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isOpen ? "Close Doors" : "Open Doors"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default function FurnitureBuilderSimplified() {
  // State for sidebar width
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // State for furniture configuration
  const [furnitureType, setFurnitureType] = useState("bookshelf")
  const [dimensions, setDimensions] = useState({
    width: FURNITURE_TYPES.bookshelf.width,
    height: FURNITURE_TYPES.bookshelf.height,
    depth: FURNITURE_TYPES.bookshelf.depth,
  })

  // Material selection state
  const [materialCategory, setMaterialCategory] = useState(MATERIAL_CATEGORIES[0].id)
  const [materialOption, setMaterialOption] = useState(MATERIAL_CATEGORIES[0].options[0].id)

  const [finish, setFinish] = useState(FINISHES[0].id)
  const [hasDoors, setHasDoors] = useState(false)
  const [shelfCount, setShelfCount] = useState(4)

  // State for door animation
  const [doorsOpen, setDoorsOpen] = useState(false)

  // State for door configuration
  const [doorConfig, setDoorConfig] = useState("one")
  const [doorDirection, setDoorDirection] = useState("left")

  // New state for shelf mounting holes strip
  const [hasMountingStrip, setHasMountingStrip] = useState(false)

  // New state for column dividers
  const [columnCount, setColumnCount] = useState(0)

  // Add new state for back panel configuration
  const [backPanelConfig, setBackPanelConfig] = useState({
    inset: false,
    thickness: 0.018,
    noOffset: false,
  })

  // Get the selected material color
  const getSelectedMaterialColor = () => {
    const category = MATERIAL_CATEGORIES.find((cat) => cat.id === materialCategory)
    if (!category) return "#FFFFFF"

    const option = category.options.find((opt) => opt.id === materialOption)
    return option ? option.color : "#FFFFFF"
  }

  // Handle reset
  const handleReset = () => {
    setFurnitureType("bookshelf")
    setMaterialCategory(MATERIAL_CATEGORIES[0].id)
    setMaterialOption(MATERIAL_CATEGORIES[0].options[0].id)
    setFinish(FINISHES[0].id)
    setHasDoors(false)
    setShelfCount(4)
    setDoorsOpen(false)
    setDoorConfig("one")
    setDoorDirection("left")
    setHasMountingStrip(false)
    setColumnCount(0)
    setBackPanelConfig({
      inset: false,
      thickness: 0.018,
      noOffset: false,
    })
    const defaultDimensions = FURNITURE_TYPES.bookshelf
    setDimensions({
      width: defaultDimensions.width,
      height: defaultDimensions.height,
      depth: defaultDimensions.depth,
    })
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Toggle doors open/close
  const toggleDoors = () => {
    setDoorsOpen(!doorsOpen)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] relative">
      {/* Main content area with conditional width */}
      <div className={cn("flex-1 relative bg-gray-50", isFullscreen ? "w-full" : "w-[calc(100%-320px)]")}>
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Button variant="outline" size="icon" onClick={toggleFullscreen} className="bg-white">
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>

        {/* Door toggle button - only show if doors are enabled */}
        {hasDoors && <DoorToggleButton isOpen={doorsOpen} onClick={toggleDoors} />}

        <Canvas>
          <PerspectiveCamera makeDefault position={[3, 2, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />

          <SimplifiedFurnitureModel
            type={furnitureType}
            dimensions={dimensions}
            material={materialCategory + "-" + materialOption}
            finish={finish}
            hasDoors={hasDoors}
            shelfCount={shelfCount}
            materialColor={getSelectedMaterialColor()}
            doorsOpen={doorsOpen}
            hasMountingStrip={hasMountingStrip}
            columnCount={columnCount}
            backPanelConfig={backPanelConfig}
          />

          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          <Environment preset="apartment" />
        </Canvas>
      </div>

      {/* Sidebar - positioned relative to the 3D model */}
      {!isFullscreen && (
        <div
          className="absolute top-0 right-0 h-full w-[320px] bg-white border-l z-10 overflow-auto"
          style={{ width: `${sidebarWidth}px` }}
        >
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Design Your {FURNITURE_TYPES[furnitureType].name}</h1>

            <Tabs defaultValue="type" className="mb-6">
              <TabsList className="grid grid-cols-4 mb-2">
                <TabsTrigger value="type">Type</TabsTrigger>
                <TabsTrigger value="dimensions">Size</TabsTrigger>
                <TabsTrigger value="material">Material</TabsTrigger>
                <TabsTrigger value="back">Back</TabsTrigger>
              </TabsList>

              {/* Furniture Type Tab */}
              <TabsContent value="type" className="space-y-4">
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
              </TabsContent>

              {/* Dimensions Tab */}
              <TabsContent value="dimensions" className="space-y-6">
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
                        onChange={(e) =>
                          setDimensions({ ...dimensions, height: Number.parseInt(e.target.value) || 30 })
                        }
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
              </TabsContent>

              {/* Material Tab */}
              <TabsContent value="material" className="space-y-6">
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
                      <RadioGroup
                        value={materialOption}
                        onValueChange={setMaterialOption}
                        className="grid grid-cols-2 gap-4"
                      >
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
                </div>
              </TabsContent>

              {/* Back Panel Tab */}
              <TabsContent value="back" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <Label htmlFor="back-inset" className="mb-1">
                        Back Panel Construction
                      </Label>
                      <span className="text-xs text-gray-500">Choose between standard or inset back panel</span>
                    </div>
                    <Select
                      value={backPanelConfig.inset ? (backPanelConfig.noOffset ? "copy-inset" : "inset") : "standard"}
                      onValueChange={(value) =>
                        setBackPanelConfig({
                          inset: value === "inset" || value === "copy-inset",
                          thickness: value === "inset" || value === "copy-inset" ? 0.008 : 0.018,
                          noOffset: value === "copy-inset",
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (18mm)</SelectItem>
                        <SelectItem value="inset">Inset (8mm)</SelectItem>
                        <SelectItem value="copy-inset">Copy Inset (8mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {backPanelConfig.inset && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-4">
                      <h4 className="font-medium mb-2">Inset Configuration</h4>
                      <ul className="text-sm text-gray-600 space-y-2">
                        {!backPanelConfig.noOffset && <li>• 16mm inset from rear edge</li>}
                        <li>• 8mm panel thickness</li>
                        <li>• 6mm inset from side panels</li>
                        {backPanelConfig.noOffset && <li>• Flush with rear edge</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Price and Actions */}
            <div className="mt-8 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Estimated Price:</span>
                  <span className="text-2xl font-bold">$199</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Price includes materials, labor, and all selected components
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Button>
                <Button className="flex items-center gap-2 bg-black text-white hover:bg-black/90">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
