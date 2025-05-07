"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Grid, TransformControls } from "@react-three/drei"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { SimplifiedFurnitureModel as FurnitureModel } from "@/components/simplified-furniture-model"
import { cn } from "@/lib/utils"
import {
  RotateCcw,
  Save,
  Maximize,
  Minimize,
  Move,
  Trash2,
  Copy,
  DoorOpen,
  Camera,
  Eye,
  EyeOff,
  Magnet,
  ShoppingCart,
  FileText,
  ArrowRight,
  RotateCwIcon as RotateClockwise,
  Undo,
  Redo,
  BookOpen,
  Table,
  Archive,
  Monitor,
  Tv,
} from "lucide-react"
import type { Pattern } from "@/types/pattern-types"
import type { Object3D } from "three"
import { SaveConfigurationModal } from "@/components/save-configuration-modal"
import { getConfigurationById } from "@/utils/supabase-client"
import { useIsMobile } from "@/hooks/use-mobile"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { ColorSquares } from "@/components/color-squares"
import { Slider } from "@/components/ui/slider"

// Define the mode types for the editor
type EditorMode = "select" | "move" | "rotate" | "scale" | "draw" | "camera"
type ViewMode = "3d" | "top" | "front" | "side"
type TabType = "size" | "structure" | "materials" | "doors" | "drawers" | "base" | "back"

// Define furniture item interface
interface FurnitureItem {
  id: string
  type: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: [number, number, number]
  dimensions: {
    width: number
    height: number
    depth: number
  }
  material: string
  finish: string
  patternId: string | null
  color: string
}

// Furniture types with their default dimensions and icons
const FURNITURE_TYPES = {
  closet: { name: "Closet", width: 80, height: 180, depth: 30, icon: BookOpen },
  table: { name: "Table", width: 120, height: 75, depth: 80, icon: Table },
  cabinet: { name: "Cabinet", width: 100, height: 90, depth: 45, icon: Archive },
  desk: { name: "Desk", width: 140, height: 75, depth: 60, icon: Monitor },
  sideboard: { name: "Sideboard", width: 160, height: 80, depth: 40, icon: Tv },
}

// Simple component to render a furniture library item
function FurnitureLibraryItem({ type, name, dimensions, onSelect }) {
  const Icon = FURNITURE_TYPES[type]?.icon || BookOpen

  return (
    <div className="border rounded p-2 cursor-pointer hover:bg-gray-50" onClick={onSelect}>
      <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-1">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <p className="text-xs font-medium text-center">{name}</p>
      <p className="text-xs text-gray-500 text-center">{dimensions}</p>
    </div>
  )
}

// Scene component to handle 3D rendering
function Scene({
  furnitureItems,
  selectedItemId,
  handleObjectSelect,
  editorMode,
  snapToGrid,
  gridSize,
  showGrid,
  viewMode,
  finish,
  handleTransformChange,
  showFasteners,
  doorsOpen,
}: {
  furnitureItems: FurnitureItem[]
  selectedItemId: string | null
  handleObjectSelect: (id: string) => void
  editorMode: EditorMode
  snapToGrid: boolean
  gridSize: number
  showGrid: boolean
  viewMode: ViewMode
  finish: string
  handleTransformChange: (object: Object3D) => void
  showFasteners: boolean
  doorsOpen: boolean
}) {
  // Create refs for each furniture item
  const itemRefs = useRef<{ [key: string]: Object3D | null }>({})
  const { camera } = useThree()

  // Set camera position based on view mode
  useEffect(() => {
    switch (viewMode) {
      case "top":
        camera.position.set(0, 10, 0)
        camera.lookAt(0, 0, 0)
        break
      case "front":
        camera.position.set(0, 0, 10)
        camera.lookAt(0, 0, 0)
        break
      case "side":
        camera.position.set(10, 0, 0)
        camera.lookAt(0, 0, 0)
        break
      default:
        camera.position.set(5, 5, 5)
        camera.lookAt(0, 0, 0)
        break
    }
  }, [viewMode, camera])

  // Clean up refs when items are removed
  useEffect(() => {
    // Remove refs for items that no longer exist
    Object.keys(itemRefs.current).forEach((id) => {
      if (!furnitureItems.some((item) => item.id === id)) {
        itemRefs.current[id] = null
      }
    })
  }, [furnitureItems])

  return (
    <>
      <color attach="background" args={["#f5f5f5"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      {/* Grid helper */}
      {showGrid && (
        <Grid
          infiniteGrid
          cellSize={gridSize / 100}
          cellThickness={0.5}
          sectionSize={gridSize / 100}
          sectionThickness={1}
          fadeDistance={30}
        />
      )}

      {/* Render furniture items */}
      {furnitureItems.map((item) => (
        <group
          key={item.id}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
          onClick={(e) => {
            e.stopPropagation()
            handleObjectSelect(item.id)
          }}
          ref={(ref) => {
            if (ref) {
              itemRefs.current[item.id] = ref
            }
          }}
        >
          <FurnitureModel
            type={item.type}
            dimensions={item.dimensions}
            material={item.material}
            finish={item.finish}
            hasDoors={true}
            shelfCount={4}
            materialColor={item.color}
            patternFinishType={finish}
            doorsOpen={doorsOpen}
            showFasteners={showFasteners}
          />

          {/* Highlight selected object */}
          {selectedItemId === item.id && (
            <mesh position={[0, 0, 0]}>
              <boxGeometry
                args={[
                  item.dimensions.width / 100 + 0.05,
                  item.dimensions.height / 100 + 0.05,
                  item.dimensions.depth / 100 + 0.05,
                ]}
              />
              <meshBasicMaterial color="#2196f3" wireframe transparent opacity={0.5} />
            </mesh>
          )}
        </group>
      ))}

      {/* Transform controls for selected object */}
      {selectedItemId && itemRefs.current[selectedItemId] && editorMode !== "camera" && (
        <TransformControls
          object={itemRefs.current[selectedItemId]}
          mode={editorMode === "select" ? "translate" : editorMode === "rotate" ? "rotate" : "scale"}
          onObjectChange={(e) => {
            if (e.target && e.target.object) {
              handleTransformChange(e.target.object)
            }
          }}
          size={1}
          translationSnap={snapToGrid ? gridSize / 100 : undefined}
          rotationSnap={snapToGrid ? Math.PI / 8 : undefined}
          scaleSnap={snapToGrid ? 0.1 : undefined}
        />
      )}

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={viewMode === "3d" && editorMode === "camera"} />
      <Environment preset="apartment" />
    </>
  )
}

export default function EnhancedFurnitureBuilder({ initialConfigId = null }) {
  const isMobile = useIsMobile()

  // State for editor modes
  const [editorMode, setEditorMode] = useState<EditorMode>("camera")
  const [viewMode, setViewMode] = useState<ViewMode>("3d")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(10) // Grid size in cm
  const [showFasteners, setShowFasteners] = useState(true)
  const [magnetizationOn, setMagnetizationOn] = useState(true)
  const [doorsOpen, setDoorsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>("size")
  const [selectedSubTab, setSelectedSubTab] = useState("back")

  // State for furniture items in the scene
  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([])
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [totalItems, setTotalItems] = useState(0)
  const [selectedItems, setSelectedItems] = useState(0)

  // State for the properties panel
  const [dimensions, setDimensions] = useState({
    width: 80,
    height: 180,
    depth: 30,
  })

  // State for material selection
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null)
  const [finish, setFinish] = useState("natural")
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [showSavedConfigurations, setShowSavedConfigurations] = useState(false)
  const [isLoadingInitialConfig, setIsLoadingInitialConfig] = useState(false)

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Get the selected item
  const selectedItem = furnitureItems.find((item) => item.id === selectedItemId)

  // Handle pattern selection
  const handlePatternSelect = async (pattern: Pattern) => {
    console.log("Pattern selected:", pattern.name)
    setSelectedPattern(pattern.id)
    setCurrentPattern(pattern)

    // If an item is selected, update its material
    if (selectedItemId) {
      setFurnitureItems((items) =>
        items.map((item) =>
          item.id === selectedItemId ? { ...item, patternId: pattern.id, color: pattern.color_hex } : item,
        ),
      )
    }
  }

  // Handle dimension change
  const handleDimensionChange = (dimension: "width" | "height" | "depth", value: number) => {
    setDimensions((prev) => ({ ...prev, [dimension]: value }))

    // If an item is selected, update its dimensions
    if (selectedItemId) {
      setFurnitureItems((items) =>
        items.map((item) =>
          item.id === selectedItemId ? { ...item, dimensions: { ...item.dimensions, [dimension]: value } } : item,
        ),
      )
    }
  }

  // Add a new furniture item
  const addFurnitureItem = (type: string) => {
    const furnitureType = FURNITURE_TYPES[type as keyof typeof FURNITURE_TYPES]
    if (!furnitureType) return

    const newItem: FurnitureItem = {
      id: `furniture-${Date.now()}`,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      dimensions: {
        width: furnitureType.width,
        height: furnitureType.height,
        depth: furnitureType.depth,
      },
      material: "premium-decor",
      finish: finish,
      patternId: selectedPattern,
      color: currentPattern?.color_hex || "#FFFFFF",
    }

    setFurnitureItems([...furnitureItems, newItem])
    setSelectedItemId(newItem.id)
    setTotalItems(totalItems + 1)
    setSelectedItems(1)

    // Update dimensions to match the new item
    setDimensions(newItem.dimensions)
  }

  // Delete the selected item
  const deleteSelectedItem = () => {
    if (selectedItemId) {
      setFurnitureItems((items) => items.filter((item) => item.id !== selectedItemId))
      setSelectedItemId(null)
      setTotalItems(totalItems - 1)
      setSelectedItems(0)
    }
  }

  // Duplicate the selected item
  const duplicateSelectedItem = () => {
    if (selectedItemId) {
      const itemToDuplicate = furnitureItems.find((item) => item.id === selectedItemId)
      if (itemToDuplicate) {
        const newItem = {
          ...itemToDuplicate,
          id: `furniture-${Date.now()}`,
          position: [itemToDuplicate.position[0] + 1, itemToDuplicate.position[1], itemToDuplicate.position[2]],
        }
        setFurnitureItems([...furnitureItems, newItem])
        setSelectedItemId(newItem.id)
        setTotalItems(totalItems + 1)
        setSelectedItems(1)
      }
    }
  }

  // Handle object selection
  const handleObjectSelect = (itemId: string) => {
    if (itemId === selectedItemId) {
      setSelectedItemId(null)
      setSelectedItems(0)
    } else {
      setSelectedItemId(itemId)
      setSelectedItems(1)

      // Update dimensions to match the selected item
      const item = furnitureItems.find((item) => item.id === itemId)
      if (item) {
        setDimensions(item.dimensions)
      }
    }
  }

  // Handle transform changes
  const handleTransformChange = (object: Object3D) => {
    if (!selectedItemId || !object || !object.position || !object.rotation || !object.scale) {
      return
    }

    setFurnitureItems((items) =>
      items.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              position: [object.position.x, object.position.y, object.position.z],
              rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
              scale: [object.scale.x, object.scale.y, object.scale.z],
            }
          : item,
      ),
    )
  }

  // Calculate price
  const calculatePrice = () => {
    let basePrice = 199

    // Add price based on dimensions
    const volume = (dimensions.width * dimensions.height * dimensions.depth) / 1000000
    basePrice += volume * 1000

    // Add price for each item
    basePrice += furnitureItems.length * 50

    // Add price for premium materials
    if (currentPattern?.is_premium) {
      basePrice *= currentPattern.price_factor || 1.2
    }

    return Math.round(basePrice)
  }

  // Load initial configuration
  const loadInitialConfig = useCallback(async () => {
    if (!initialConfigId) return

    try {
      setIsLoadingInitialConfig(true)
      const config = await getConfigurationById(initialConfigId)
      if (config) {
        // Implementation of loading configuration
        console.log("Loaded configuration:", config)
      }
    } catch (error) {
      console.error("Error loading initial configuration:", error)
    } finally {
      setIsLoadingInitialConfig(false)
    }
  }, [initialConfigId])

  // Reset the scene
  const resetScene = () => {
    if (confirm("Are you sure you want to reset the scene? All items will be removed.")) {
      setFurnitureItems([])
      setSelectedItemId(null)
      setTotalItems(0)
      setSelectedItems(0)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Toggle doors
  const toggleDoors = () => {
    setDoorsOpen(!doorsOpen)
  }

  // Toggle fasteners
  const toggleFasteners = () => {
    setShowFasteners(!showFasteners)
  }

  // Toggle magnetization
  const toggleMagnetization = () => {
    setMagnetizationOn(!magnetizationOn)
  }

  // Switch to camera rotation mode
  const switchToCameraMode = () => {
    setEditorMode("camera")
  }

  // Switch to edit mode
  const switchToEditMode = () => {
    setEditorMode("select")
  }

  useEffect(() => {
    loadInitialConfig()
  }, [loadInitialConfig])

  // Calculate estimated price
  const estimatedPrice = calculatePrice()

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-[calc(100vh-4rem)] relative">
        {/* Top header */}
        <div className="bg-white border-b p-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">Furniture Builder</h1>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              Bespoke Furniture
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              Sustainable Materials
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              Free Delivery
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {selectedItems > 0 && (
              <Badge variant="destructive" className="mr-2">
                {selectedItems} compartment{selectedItems !== 1 ? "s" : ""} selected
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={resetScene}>
              Clear
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - Furniture Library */}
          <div className="w-64 border-r bg-white overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Furniture Library</h2>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(FURNITURE_TYPES).map(([key, value]) => (
                  <FurnitureLibraryItem
                    key={key}
                    type={key}
                    name={value.name}
                    dimensions={`${value.width}×${value.height}×${value.depth}`}
                    onSelect={() => addFurnitureItem(key)}
                  />
                ))}
              </div>

              <Separator className="my-4" />

              <h2 className="text-lg font-semibold mb-4">Current Furniture</h2>

              {furnitureItems.length === 0 ? (
                <div className="text-sm text-gray-500">No furniture added yet. Drag items from the library above.</div>
              ) : (
                <div className="space-y-2">
                  {furnitureItems.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-2 border rounded cursor-pointer hover:bg-gray-50",
                        selectedItemId === item.id && "border-primary bg-primary/5",
                      )}
                      onClick={() => handleObjectSelect(item.id)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium capitalize">{item.type}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={(e) => {
                              e.stopPropagation()
                              duplicateSelectedItem()
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteSelectedItem()
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.dimensions.width}×{item.dimensions.height}×{item.dimensions.depth} cm
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                Drag and drop furniture from the library. Drag items in the canvas to reposition them.
                <br />
                Selected items: {selectedItems} | Total items: {totalItems}
              </div>
            </div>
          </div>

          {/* Main 3D canvas */}
          <div className="relative flex-1 flex flex-col">
            <div className="bg-white border-b p-2 flex items-center justify-between">
              <h2 className="font-semibold">Design Canvas</h2>

              <div className="flex items-center space-x-2">
                <Button
                  variant={editorMode === "camera" ? "default" : "outline"}
                  size="sm"
                  onClick={switchToCameraMode}
                  className="flex items-center gap-1"
                >
                  <Camera className="h-4 w-4" />
                  Camera Rotation Mode
                </Button>

                <Button
                  variant={editorMode !== "camera" ? "default" : "outline"}
                  size="sm"
                  onClick={switchToEditMode}
                  className="flex items-center gap-1"
                >
                  <Move className="h-4 w-4" />
                  Edit Mode
                </Button>

                <Button variant="outline" size="sm" onClick={toggleDoors} className="flex items-center gap-1">
                  <DoorOpen className={cn("h-4 w-4", doorsOpen && "text-amber-500")} />
                  Open Doors
                </Button>

                <Button variant="outline" size="sm" onClick={toggleMagnetization} className="flex items-center gap-1">
                  <Magnet className={cn("h-4 w-4", magnetizationOn && "text-blue-500")} />
                  Magnetization: {magnetizationOn ? "On" : "Off"}
                </Button>

                <Button variant="outline" size="sm" onClick={toggleFasteners} className="flex items-center gap-1">
                  {showFasteners ? (
                    <>
                      <Eye className="h-4 w-4" />
                      Hide Fasteners
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Show Fasteners
                    </>
                  )}
                </Button>
              </div>

              <Button variant="outline" size="icon" onClick={toggleFullscreen} className="bg-white">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex-1 relative">
              <Canvas key="main-furniture-canvas" shadows gl={{ antialias: true, alpha: false }}>
                <Scene
                  furnitureItems={furnitureItems}
                  selectedItemId={selectedItemId}
                  handleObjectSelect={handleObjectSelect}
                  editorMode={editorMode}
                  snapToGrid={snapToGrid}
                  gridSize={gridSize}
                  showGrid={showGrid}
                  viewMode={viewMode}
                  finish={finish}
                  handleTransformChange={handleTransformChange}
                  showFasteners={showFasteners}
                  doorsOpen={doorsOpen}
                />
              </Canvas>

              <div className="absolute bottom-4 left-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("3d")}
                  className={cn("bg-white", viewMode === "3d" && "border-primary")}
                >
                  <RotateClockwise className="h-4 w-4 mr-1" />
                  3D
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("top")}
                  className={cn("bg-white", viewMode === "top" && "border-primary")}
                >
                  Top
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("front")}
                  className={cn("bg-white", viewMode === "front" && "border-primary")}
                >
                  Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode("side")}
                  className={cn("bg-white", viewMode === "side" && "border-primary")}
                >
                  Side
                </Button>
              </div>

              <div className="absolute bottom-4 right-4 flex space-x-2">
                <Button variant="outline" size="sm" className="bg-white">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-white">
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-100 p-2 text-xs text-gray-500 border-t">
              Drag and drop furniture from the library. Drag items in the canvas to reposition them.
              <br />
              Selected items: {selectedItems} | Total items: {totalItems}
            </div>
          </div>

          {/* Right sidebar - Configuration */}
          <div className="w-80 border-l bg-white overflow-y-auto">
            <div className="p-4">
              <Tabs defaultValue="size" onValueChange={(value) => setActiveTab(value as TabType)}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="size">Size</TabsTrigger>
                  <TabsTrigger value="structure">Structure</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                </TabsList>

                <div className="mb-4">
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger
                      value="back"
                      onClick={() => setSelectedSubTab("back")}
                      data-state={selectedSubTab === "back" ? "active" : "inactive"}
                    >
                      Back
                    </TabsTrigger>
                    <TabsTrigger
                      value="base"
                      onClick={() => setSelectedSubTab("base")}
                      data-state={selectedSubTab === "base" ? "active" : "inactive"}
                    >
                      Base
                    </TabsTrigger>
                    <TabsTrigger
                      value="doors"
                      onClick={() => setSelectedSubTab("doors")}
                      data-state={selectedSubTab === "doors" ? "active" : "inactive"}
                    >
                      Doors
                    </TabsTrigger>
                    <TabsTrigger
                      value="drawers"
                      onClick={() => setSelectedSubTab("drawers")}
                      data-state={selectedSubTab === "drawers" ? "active" : "inactive"}
                    >
                      Drawers
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="size" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="width">Width (cm)</Label>
                        <span className="text-sm text-gray-500">{dimensions.width} cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[dimensions.width]}
                          min={40}
                          max={200}
                          step={1}
                          onValueChange={(value) => handleDimensionChange("width", value[0])}
                          className="flex-1"
                        />
                        <Input
                          id="width"
                          type="number"
                          min={40}
                          max={200}
                          value={dimensions.width}
                          onChange={(e) => handleDimensionChange("width", Number.parseInt(e.target.value) || 40)}
                          className="w-16"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>40cm</span>
                        <span>200cm</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <span className="text-sm text-gray-500">{dimensions.height} cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[dimensions.height]}
                          min={80}
                          max={240}
                          step={1}
                          onValueChange={(value) => handleDimensionChange("height", value[0])}
                          className="flex-1"
                        />
                        <Input
                          id="height"
                          type="number"
                          min={80}
                          max={240}
                          value={dimensions.height}
                          onChange={(e) => handleDimensionChange("height", Number.parseInt(e.target.value) || 80)}
                          className="w-16"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>80cm</span>
                        <span>240cm</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Label htmlFor="depth">Depth (cm)</Label>
                        <span className="text-sm text-gray-500">{dimensions.depth} cm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Slider
                          value={[dimensions.depth]}
                          min={20}
                          max={60}
                          step={1}
                          onValueChange={(value) => handleDimensionChange("depth", value[0])}
                          className="flex-1"
                        />
                        <Input
                          id="depth"
                          type="number"
                          min={20}
                          max={60}
                          value={dimensions.depth}
                          onChange={(e) => handleDimensionChange("depth", Number.parseInt(e.target.value) || 20)}
                          className="w-16"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>20cm</span>
                        <span>60cm</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="structure" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-grid">Show Grid</Label>
                      <Switch id="show-grid" checked={showGrid} onCheckedChange={setShowGrid} />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="snap-grid">Snap to Grid</Label>
                      <Switch id="snap-grid" checked={snapToGrid} onCheckedChange={setSnapToGrid} />
                    </div>

                    <div>
                      <Label htmlFor="grid-size">Grid Size (cm)</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Slider
                          id="grid-size"
                          value={[gridSize]}
                          min={5}
                          max={20}
                          step={1}
                          onValueChange={(value) => setGridSize(value[0])}
                          className="flex-1"
                        />
                        <Input
                          type="number"
                          value={gridSize}
                          onChange={(e) => setGridSize(Number(e.target.value))}
                          className="w-16"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="materials" className="space-y-6">
                  <ColorSquares onSelect={handlePatternSelect} />

                  <div className="space-y-4">
                    <Label>Finish Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["natural", "matte", "glossy", "oiled"].map((finishType) => (
                        <Card
                          key={finishType}
                          className={cn(
                            "cursor-pointer hover:border-primary",
                            finish === finishType && "border-primary bg-primary/5",
                          )}
                          onClick={() => setFinish(finishType)}
                        >
                          <CardContent className="p-3 text-center">
                            <span className="capitalize">{finishType}</span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">Estimated Price:</h3>
                    <p className="text-sm text-gray-500">
                      Price includes materials, labor, and all selected components.
                    </p>
                  </div>
                  <div className="text-2xl font-bold">${estimatedPrice}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full" onClick={() => setIsSaveModalOpen(true)}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="w-full" onClick={resetScene}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Cut List
                  </Button>
                </div>

                <Button className="w-full bg-black hover:bg-gray-800 text-white">Order Now</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SaveConfigurationModal
        isOpen={isSaveModalOpen}
        setIsOpen={setIsSaveModalOpen}
        configuration={{
          furniture_type: selectedItem?.type || "closet",
          dimensions,
          material_category: "premium-decor",
          material_option: "white",
          pattern_id: selectedPattern,
          finish,
          has_doors: true,
          shelf_count: 4,
          door_config: "one",
          door_direction: "left",
          has_mounting_strip: false,
          column_count: 0,
          compartment_doors: [{ type: "none" }],
          back_panel_config: {
            inset: false,
            thickness: 0.018,
            noOffset: false,
          },
        }}
        onSaveSuccess={() => setIsSaveModalOpen(false)}
      />
    </DndProvider>
  )
}
