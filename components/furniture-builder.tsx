"use client"
import { useState, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import {
  RotateCcw,
  ShoppingCart,
  Heart,
  Share2,
  Save,
  Maximize,
  Minimize,
  DoorOpen,
  BookOpen,
  Table,
  Archive,
  Monitor,
  Tv,
  Loader2,
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
import { Switch } from "@/components/ui/switch"
import { FurnitureModel } from "@/components/furniture-model"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SaveConfigurationModal } from "@/components/save-configuration-modal"
import { SavedConfigurations } from "@/components/saved-configurations"
import { type SavedConfiguration, getConfigurationById } from "@/utils/supabase-client"
import { MaterialTabWithPatterns } from "@/components/furniture-tabs/material-tab-with-patterns"
import { getPatternById } from "@/utils/pattern-service"
import type { Pattern } from "@/types/pattern-types"
import * as THREE from "three"
import { CutListModal } from "@/components/cut-list-modal"

// Furniture types with their default dimensions and icons
const FURNITURE_TYPES = {
  closet: { name: "Closet", width: 80, height: 180, depth: 30, icon: BookOpen },
  table: { name: "Table", width: 120, height: 75, depth: 80, icon: Table },
  cabinet: { name: "Cabinet", width: 100, height: 90, depth: 45, icon: Archive },
  desk: { name: "Desk", width: 140, height: 75, depth: 60, icon: Monitor },
  sideboard: { name: "Sideboard", width: 160, height: 80, depth: 40, icon: Tv },
}

// Materials with their properties
const MATERIAL_CATEGORIES = [
  {
    id: "premium-decor",
    name: "Premium Decor",
    description: "Lighter, high-quality coated boards suitable for larger furniture",
    info: "Premium Decor options are sourced from leading manufacturers like Egger and Kronospan, offering modern, durable finishes.",
    options: [
      {
        id: "white",
        name: "White",
        color: "#FFFFFF",
        description: "A crisp, clean finish (e.g., Egger U104 Alabaster White or Kronospan K101 PE White)",
        price: 1.2,
      },
      {
        id: "grey",
        name: "Grey",
        color: "#CCCCCC",
        description: "A sleek, neutral tone (e.g., Egger U708 Light Grey or Kronospan 8534 BS Light Grey)",
        price: 1.2,
      },
      {
        id: "black",
        name: "Black",
        color: "#222222",
        description: "A bold, sophisticated look (e.g., Egger U999 Black or Kronospan K019 PW Black)",
        price: 1.3,
      },
      {
        id: "beige",
        name: "Beige",
        color: "#E8D0A9",
        description: "A warm, subtle hue (e.g., Egger U200 Beige or Kronospan 8548 SN Natural Beige)",
        price: 1.2,
      },
    ],
  },
  {
    id: "mdf",
    name: "MDF",
    description: "Medium-Density Fiberboard with lacquered or coated surfaces",
    info: "MDF options provide a smooth, versatile surface ideal for painting or veneering.",
    options: [
      {
        id: "white-matte",
        name: "White",
        color: "#F5F5F5",
        description: "A soft, non-reflective white finish for a minimalist style",
        price: 1.0,
      },
      {
        id: "grey-matte",
        name: "Grey",
        color: "#AAAAAA",
        description: "A muted, contemporary grey with a smooth, matte texture",
        price: 1.0,
      },
      {
        id: "black-matte",
        name: "Black",
        color: "#333333",
        description: "A deep, understated black with a velvety matte finish",
        price: 1.1,
      },
      {
        id: "beige-matte",
        name: "Beige",
        color: "#D9C9B6",
        description: "A gentle, earthy beige with a matte surface for warmth",
        price: 1.0,
      },
    ],
  },
  {
    id: "solid-wood",
    name: "Solid Wood",
    description: "Natural, sustainable wood with various treatments",
    info: "Solid Wood options reflect Pickawood's use of twelve solid wood types, such as maple, oak, or walnut, with natural or oiled finishes.",
    options: [
      {
        id: "oak",
        name: "Oak",
        color: "#D4BE9C",
        description: "A light, durable wood with visible grain and a natural oil finish",
        price: 1.8,
      },
      {
        id: "walnut",
        name: "Walnut",
        color: "#5C4033",
        description: "A rich, dark brown wood with a warm tone and smooth oil treatment",
        price: 2.0,
      },
      {
        id: "maple",
        name: "Maple",
        color: "#F0E0C0",
        description: "A pale, creamy wood with a subtle white oil finish for brightness",
        price: 1.7,
      },
      {
        id: "beech",
        name: "Beech",
        color: "#C19A6B",
        description: "A light reddish-brown wood with a uniform grain and natural oil",
        price: 1.6,
      },
    ],
  },
  {
    id: "plywood",
    name: "Plywood",
    description: "Layered birch wood with a modern, stable structure",
    info: "Plywood options emphasize strength and the characteristic layered edge look.",
    options: [
      {
        id: "birch-natural",
        name: "Birch Plywood (Natural)",
        color: "#F5DEB3",
        description: "A light, blonde finish with visible layers and a natural coating",
        price: 1.4,
      },
      {
        id: "birch-white",
        name: "Birch Plywood (White)",
        color: "#F8F8F8",
        description: "A bright, white-coated surface retaining the plywood edge aesthetic",
        price: 1.5,
      },
      {
        id: "birch-grey",
        name: "Birch Plywood (Grey)",
        color: "#B0B0B0",
        description: "A modern grey finish highlighting the layered birch construction",
        price: 1.5,
      },
      {
        id: "birch-black",
        name: "Birch Plywood (Black)",
        color: "#2A2A2A",
        description: "A striking black coating with the distinctive plywood edge visible",
        price: 1.6,
      },
    ],
  },
]

// Finishes with their properties
const FINISHES = [
  { id: "natural", name: "Natural", factor: 1.0 },
  { id: "matte", name: "Matte", factor: 1.1 },
  { id: "glossy", name: "Glossy", factor: 1.2 },
  { id: "oiled", name: "Oiled", factor: 1.15 },
]

// Door types
const DOOR_TYPES = [
  { id: "none", name: "No Door" },
  { id: "single-left", name: "Single Door (Left Hinge)" },
  { id: "single-right", name: "Single Door (Right Hinge)" },
  { id: "double", name: "Double Doors" },
]

// Base prices for different furniture types
const BASE_PRICES = {
  closet: 199,
  table: 299,
  cabinet: 249,
  desk: 279,
  sideboard: 349,
}

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

// Add initialConfigId to the component props
export default function FurnitureBuilder({ initialConfigId = null }) {
  // Add state for loading initial configuration
  const [isLoadingInitialConfig, setIsLoadingInitialConfig] = useState(false)

  // Add these new state variables
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null)

  // Add new state for the selected color
  const [selectedColor, setSelectedColor] = useState("oak-natural")

  // Update the state variables to use thumbnailUrl instead of currentTextureUrl
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string | null>(null)

  // Add new state for pattern dimensions
  const [patternDimensions, setPatternDimensions] = useState({
    length: 100,
    width: 100,
    thickness: 18,
    textureRepeatX: 1,
    textureRepeatY: 1,
  })

  // Update the handlePatternSelect function to use thumbnail_url instead of texture_url
  const handlePatternSelect = async (pattern: Pattern) => {
    console.log("Pattern selected in FurnitureBuilder:", pattern.name)
    console.log("Pattern finishType:", pattern.finishType)
    console.log("Pattern thumbnail URL:", pattern.thumbnail_url)
    console.log("Pattern dimensions:", {
      length: pattern.length || 100,
      width: pattern.width || 100,
      thickness: pattern.thickness || 18,
      textureRepeatX: pattern.texture_repeat_x || 1,
      textureRepeatY: pattern.texture_repeat_y || 1,
    })

    // Validate the thumbnail URL before setting it
    if (pattern.thumbnail_url) {
      try {
        const response = await fetch(pattern.thumbnail_url, { method: "HEAD" })
        if (!response.ok) {
          console.error(`Thumbnail URL is not accessible: ${pattern.thumbnail_url}`)
          // Continue anyway, the FurnitureModel will handle the error
        } else {
          console.log(`Thumbnail URL is accessible: ${pattern.thumbnail_url}`)
        }
      } catch (error) {
        console.error(`Error checking thumbnail URL: ${error.message}`)
        // Continue anyway, the FurnitureModel will handle the error
      }
    } else {
      console.warn(`No thumbnail URL available for pattern: ${pattern.name}`)
    }

    // Update the current pattern
    setCurrentPattern(pattern)

    // Update the selected pattern ID
    setSelectedPattern(pattern.id)

    // Update the current thumbnail URL
    setCurrentThumbnailUrl(pattern.thumbnail_url || null)

    // Update pattern dimensions
    setPatternDimensions({
      length: pattern.length || 100,
      width: pattern.width || 100,
      thickness: pattern.thickness || 18,
      textureRepeatX: pattern.texture_repeat_x || 1,
      textureRepeatY: pattern.texture_repeat_y || 1,
    })

    // Update the selected color
    const colorId =
      pattern.name === "White Marble"
        ? "white-marble"
        : pattern.name === "Walnut Classic"
          ? "walnut-classic"
          : pattern.name === "Oak Natural"
            ? "oak-natural"
            : "concrete-grey"
    setSelectedColor(colorId)
  }

  // Add useEffect to load initial configuration if provided
  const loadInitialConfig = useCallback(async () => {
    if (!initialConfigId) return

    try {
      setIsLoadingInitialConfig(true)
      const config = await getConfigurationById(initialConfigId)
      if (config) {
        loadConfiguration(config)
      }
    } catch (error) {
      console.error("Error loading initial configuration:", error)
    } finally {
      setIsLoadingInitialConfig(false)
    }
  }, [initialConfigId])

  // Add this useEffect to load the pattern when selectedPattern changes
  const loadPattern = useCallback(async () => {
    if (!selectedPattern) {
      setCurrentPattern(null)
      setPatternDimensions({
        length: 100,
        width: 100,
        thickness: 18,
        textureRepeatX: 1,
        textureRepeatY: 1,
      })
      return
    }

    try {
      const pattern = await getPatternById(selectedPattern)
      setCurrentPattern(pattern)

      // Update pattern dimensions
      if (pattern) {
        setPatternDimensions({
          length: pattern.length || 100,
          width: pattern.width || 100,
          thickness: pattern.thickness || 18,
          textureRepeatX: pattern.texture_repeat_x || 1,
          textureRepeatY: pattern.texture_repeat_y || 1,
        })
      }
    } catch (error) {
      console.error("Error loading pattern:", error)
    }
  }, [selectedPattern])

  // State for sidebar width
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // State for furniture configuration
  // Update the initial furniture type from bookshelf to closet
  const [furnitureType, setFurnitureType] = useState("closet")
  const [dimensions, setDimensions] = useState({
    width: FURNITURE_TYPES.closet.width,
    height: FURNITURE_TYPES.closet.height,
    depth: FURNITURE_TYPES.closet.depth,
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

  // State for door configuration
  const [segmentConfig, setSegmentConfig] = useState([
    { id: 1, doorDirection: "left" },
    { id: 2, doorDirection: "right" },
    { id: 3, doorDirection: "left" },
  ])

  // New state for shelf mounting holes strip
  const [hasMountingStrip, setHasMountingStrip] = useState(false)

  // New state for column dividers
  const [columnCount, setColumnCount] = useState(0)

  // New state for compartment doors
  const [compartmentDoors, setCompartmentDoors] = useState([])

  // Add new state for back panel configuration
  const [backPanelConfig, setBackPanelConfig] = useState({
    inset: false,
    thickness: 0.018,
    noOffset: false,
  })

  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [showSavedConfigurations, setShowSavedConfigurations] = useState(false)

  // Calculate the maximum number of columns based on furniture width
  const maxColumns = Math.max(Math.floor(dimensions.width / 30) - 1, 0)

  // Calculate the number of compartments based on columns
  const compartmentCount = columnCount + 1

  // Ensure column count is valid when width changes
  useEffect(() => {
    if (columnCount > maxColumns) {
      setColumnCount(maxColumns)
    }
  }, [dimensions.width, columnCount, maxColumns])

  // Initialize compartment doors when compartment count changes
  useEffect(() => {
    // If we have fewer compartment door configs than compartments, add new ones
    if (compartmentDoors.length < compartmentCount) {
      const newDoors = [...compartmentDoors]
      for (let i = compartmentDoors.length; i < compartmentCount; i++) {
        newDoors.push({ type: "none" })
      }
      setCompartmentDoors(newDoors)
    }
    // If we have more compartment door configs than compartments, remove extra ones
    else if (compartmentDoors.length > compartmentCount) {
      setCompartmentDoors(compartmentDoors.slice(0, compartmentCount))
    }
  }, [compartmentCount, compartmentDoors])

  // Update the getSelectedMaterialColor function to use the pattern color if available
  const getSelectedMaterialColor = () => {
    if (currentPattern) {
      return currentPattern.color_hex
    }

    const category = MATERIAL_CATEGORIES.find((cat) => cat.id === materialCategory)
    if (!category) return "#FFFFFF"

    const option = category.options.find((opt) => opt.id === materialOption)
    return option ? option.color : "#FFFFFF"
  }

  // Get the selected material price factor
  const getSelectedMaterialPrice = () => {
    const category = MATERIAL_CATEGORIES.find((cat) => cat.id === materialCategory)
    if (!category) return 1.0

    const option = category.options.find((opt) => opt.id === materialOption)
    return option ? option.price : 1.0
  }

  // Update the calculatePrice function to include the pattern price factor
  const calculatePrice = () => {
    const basePrice = BASE_PRICES[furnitureType as keyof typeof BASE_PRICES]
    const materialFactor = getSelectedMaterialPrice()
    const finishFactor = materialCategory === "solid-wood" ? FINISHES.find((f) => f.id === finish)?.factor || 1 : 1
    const patternFactor = currentPattern?.price_factor || 1.0

    // Calculate volume in cubic meters
    const volume = (dimensions.width * dimensions.height * dimensions.depth) / 1000000

    // Door cost - count doors in all compartments
    let doorsCost = 0
    if (hasDoors) {
      compartmentDoors.forEach((door) => {
        if (door.type === "double") {
          doorsCost += 80 // Double doors cost more
        } else if (door.type !== "none") {
          doorsCost += 50 // Single door
        }
      })
    }

    // Shelf cost
    const shelvesCost = shelfCount * 15

    // Mounting strip cost
    const mountingStripCost = hasMountingStrip ? 25 : 0

    // Column dividers cost
    const columnDividersCost = columnCount > 0 ? columnCount * 20 : 0

    // Standard edge banding cost
    const edgeBandingCost = 20

    return (
      Math.round(
        (basePrice +
          volume * 1000 * materialFactor * finishFactor * patternFactor +
          doorsCost +
          shelvesCost +
          mountingStripCost +
          columnDividersCost +
          edgeBandingCost) *
          100,
      ) / 100
    )
  }

  // Update the getCurrentConfiguration function to include the pattern
  const getCurrentConfiguration = (): Omit<SavedConfiguration, "name"> => {
    return {
      furniture_type: furnitureType,
      dimensions,
      material_category: materialCategory,
      material_option: materialOption,
      pattern_id: selectedPattern,
      finish,
      has_doors: hasDoors,
      shelf_count: shelfCount,
      door_config: doorConfig,
      door_direction: doorDirection,
      has_mounting_strip: hasMountingStrip,
      column_count: columnCount,
      compartment_doors: compartmentDoors,
      back_panel_config: backPanelConfig,
    }
  }

  // Update the loadConfiguration function to load the pattern
  const loadConfiguration = (config: SavedConfiguration) => {
    setFurnitureType(config.furniture_type)
    setDimensions(config.dimensions)
    setMaterialCategory(config.material_category)
    setMaterialOption(config.material_option)
    if (config.pattern_id) setSelectedPattern(config.pattern_id)
    setFinish(config.finish)
    setHasDoors(config.has_doors)
    setShelfCount(config.shelf_count)
    if (config.door_config) setDoorConfig(config.door_config)
    if (config.door_direction) setDoorDirection(config.door_direction)
    setHasMountingStrip(config.has_mounting_strip)
    setColumnCount(config.column_count)
    if (config.compartment_doors) setCompartmentDoors(config.compartment_doors)
    setBackPanelConfig(config.back_panel_config)
    setShowSavedConfigurations(false)
  }

  const handleSaveSuccess = (savedConfig: SavedConfiguration) => {
    // You could add additional logic here if needed
    console.log("Configuration saved successfully:", savedConfig)
  }

  // Update the handleColorChange function to ensure texture and thumbnail URLs are kept together
  const handleColorChange = async (colorId: string, patternId: string | null) => {
    setSelectedColor(colorId)

    console.log(`Color selected: ${colorId}, Pattern ID: ${patternId}`)

    if (patternId) {
      try {
        // Load the full pattern data to get the thumbnail URL
        console.log(`Fetching pattern details for ID: ${patternId}`)
        const pattern = await getPatternById(patternId)

        if (pattern) {
          console.log(`Selected ${pattern.name}:`)
          console.log(`- Thumbnail URL: ${pattern.thumbnail_url || "none"}`)
          console.log(`- Color Hex: ${pattern.color_hex}`)
          console.log(
            `- Dimensions: length=${pattern.length || 100}, width=${pattern.width || 100}, thickness=${pattern.thickness || 18}`,
          )
          console.log(`- Texture Repeat: X=${pattern.texture_repeat_x || 1}, Y=${pattern.texture_repeat_y || 1}`)

          // Check if thumbnail URL exists and is accessible
          if (pattern.thumbnail_url) {
            try {
              const response = await fetch(pattern.thumbnail_url, { method: "HEAD" })
              console.log(`Thumbnail URL check: ${pattern.thumbnail_url} - Status: ${response.status}`)
              console.log(`Thumbnail URL is accessible: ${response.ok}`)
            } catch (error) {
              console.error(`Error checking thumbnail URL: ${error.message}`)
            }
          } else {
            console.warn(`No thumbnail URL available for pattern: ${pattern.name}`)
          }

          setSelectedPattern(patternId)
          setCurrentPattern(pattern)

          // Update pattern dimensions
          setPatternDimensions({
            length: pattern.length || 100,
            width: pattern.width || 100,
            thickness: pattern.thickness || 18,
            textureRepeatX: pattern.texture_repeat_x || 1,
            textureRepeatY: pattern.texture_repeat_y || 1,
          })

          // Update the current thumbnail URL
          setCurrentThumbnailUrl(pattern.thumbnail_url || null)
        } else {
          console.warn(`Pattern not found for ID: ${patternId}`)
          setSelectedPattern(null)
          setCurrentPattern(null)
          setCurrentThumbnailUrl(null)
        }
      } catch (error) {
        console.error("Error loading pattern:", error)
        setSelectedPattern(null)
        setCurrentPattern(null)
        setCurrentThumbnailUrl(null)
      }
    } else {
      setSelectedPattern(null)
      setCurrentPattern(null)
      setCurrentThumbnailUrl(null)
    }
  }

  // Update dimensions when furniture type changes
  useEffect(() => {
    const defaultDimensions = FURNITURE_TYPES[furnitureType as keyof typeof FURNITURE_TYPES]
    setDimensions({
      width: defaultDimensions.width,
      height: defaultDimensions.height,
      depth: defaultDimensions.depth,
    })

    // Reset component options based on furniture type
    if (furnitureType === "table") {
      setHasDoors(false)
      setShelfCount(0)
      setHasMountingStrip(false)
      setColumnCount(0)
    } else if (furnitureType === "closet") {
      setHasDoors(true)
      setShelfCount(4)
      setHasMountingStrip(false)
      setColumnCount(0)
    } else if (furnitureType === "cabinet") {
      setHasDoors(true)
      setShelfCount(2)
      setHasMountingStrip(false)
      setColumnCount(0)
    }
  }, [furnitureType])

  // Handle reset
  const handleReset = () => {
    const defaultDimensions = FURNITURE_TYPES.closet

    setFurnitureType("closet")
    setDimensions({
      width: defaultDimensions.width,
      height: defaultDimensions.height,
      depth: defaultDimensions.depth,
    })
    setMaterialCategory(MATERIAL_CATEGORIES[0].id)
    setMaterialOption(MATERIAL_CATEGORIES[0].options[0].id)
    setSelectedPattern(null)
    setFinish(FINISHES[0].id)
    setHasDoors(true) // Set to true for closets
    setShelfCount(4)
    setDoorsOpen(false)
    setDoorConfig("one")
    setDoorDirection("left")
    setHasMountingStrip(false)
    setColumnCount(0)
    setCompartmentDoors([{ type: "none" }])
    setSegmentConfig([
      { id: 1, doorDirection: "left" },
      { id: 2, doorDirection: "right" },
      { id: 3, doorDirection: "left" },
    ])
    setBackPanelConfig({
      inset: false,
      thickness: 0.018,
      noOffset: false,
    })
    setPatternDimensions({
      length: 100,
      width: 100,
      thickness: 18,
      textureRepeatX: 1,
      textureRepeatY: 1,
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

  // Update compartment door type
  const updateCompartmentDoorType = (index, type) => {
    const newDoors = [...compartmentDoors]
    newDoors[index] = { ...newDoors[index], type }
    setCompartmentDoors(newDoors)
  }

  // Update segment door direction
  const updateSegmentDoorDirection = (segmentId, direction) => {
    setSegmentConfig((prev) =>
      prev.map((segment) => (segment.id === segmentId ? { ...segment, doorDirection: direction } : segment)),
    )
  }

  // Get segments based on door configuration
  const getSegments = () => {
    if (doorConfig === "one") {
      return 1
    } else if (doorConfig === "two") {
      return 2
    }
    return 1
  }

  // Update door configuration
  useEffect(() => {
    if (doorConfig === "one") {
      // Update the first segment with the selected direction
      setSegmentConfig((prev) => [{ ...prev[0], doorDirection }, ...prev.slice(1)])
    } else if (doorConfig === "two") {
      // Set two doors, left and right
      setSegmentConfig((prev) => [
        { ...prev[0], doorDirection: "left" },
        { ...prev[1], doorDirection: "right" },
        ...prev.slice(2),
      ])
    }
  }, [doorConfig, doorDirection])

  // Update the cleanup effect for the current thumbnail URL
  useEffect(() => {
    return () => {
      // Clean up thumbnail URL when component unmounts
      setCurrentThumbnailUrl(null)
    }
  }, [])

  useEffect(() => {
    loadInitialConfig()
    loadPattern()
  }, [loadInitialConfig, loadPattern])

  // Also, add a cleanup effect to properly dispose of Three.js resources
  // Add this useEffect near your other useEffect hooks:

  useEffect(() => {
    return () => {
      // Clean up Three.js resources when component unmounts
      if (typeof window !== "undefined") {
        // Force Three.js to release WebGL resources
        const renderers = Object.values(THREE.WebGLRenderer.pool || {})
        renderers.forEach((renderer) => {
          if (renderer && typeof renderer.dispose === "function") {
            renderer.dispose()
          }
        })
      }
    }
  }, [])

  // In the return statement, add a loading indicator when loading initial config
  if (isLoadingInitialConfig) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
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

        {/* Optimize the Canvas component to reduce complexity
        // 1. Simplify the lighting setup
        // 2. Use fewer Three.js features */}
        <Canvas
          key="main-furniture-canvas"
          shadows
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            // Set up proper disposal of WebGL context
            gl.dispose = () => {
              console.log("Properly disposing WebGL context")
              // Call the original dispose method
              THREE.WebGLRenderer.prototype.dispose.call(gl)
            }
          }}
        >
          <PerspectiveCamera makeDefault position={[3, 2, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

          {/* Update the FurnitureModel component props to use thumbnailUrl instead of patternTexture */}
          <FurnitureModel
            type={furnitureType}
            dimensions={dimensions}
            material={materialCategory + "-" + materialOption}
            finish={finish}
            hasDrawers={false}
            hasDoors={hasDoors}
            shelfCount={shelfCount}
            materialColor={getSelectedMaterialColor()}
            doorsOpen={doorsOpen}
            segments={getSegments()}
            segmentConfig={segmentConfig.slice(0, getSegments())}
            hasMountingStrip={hasMountingStrip}
            columnCount={columnCount}
            compartmentDoors={compartmentDoors}
            backPanelConfig={backPanelConfig}
            thumbnailUrl={currentThumbnailUrl}
            patternDimensions={patternDimensions}
            patternFinishType={currentPattern?.finishType || "solid"} // Make sure this is passed correctly
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

              <TabsList className="grid grid-cols-4 mb-4 mt-1">
                <TabsTrigger value="structure">Structure</TabsTrigger>
                <TabsTrigger value="base">Base</TabsTrigger>
                <TabsTrigger value="doors">Doors</TabsTrigger>
                <TabsTrigger value="drawers">Drawers</TabsTrigger>
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
                <MaterialTabWithPatterns
                  selectedPattern={selectedPattern}
                  setSelectedPattern={setSelectedPattern}
                  finish={finish}
                  setFinish={setFinish}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  onPatternSelect={handlePatternSelect}
                />
              </TabsContent>

              {/* Components Tab */}
              <TabsContent value="structure" className="space-y-6">
                <div className="space-y-4">
                  {furnitureType === "closet" && (
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

                      <div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="mounting-strip">Mounting Strip</Label>
                          <Switch
                            id="mounting-strip"
                            checked={hasMountingStrip}
                            onCheckedChange={(checked) => setHasMountingStrip(checked)}
                          />
                        </div>
                        <p className="text-sm text-gray-500">Adds a mounting strip for easier wall attachment.</p>
                      </div>
                    </>
                  )}

                  {furnitureType === "cabinet" && (
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
                          max={5}
                          step={1}
                          onValueChange={(value) => setShelfCount(value[0])}
                        />
                      </div>

                      <div>
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
                        />
                      </div>

                      {/* Compartment Doors Configuration */}
                      {columnCount > 0 && (
                        <Accordion type="single" collapsible>
                          {Array.from({ length: compartmentCount }).map((_, index) => (
                            <AccordionItem key={index} value={`compartment-${index}`}>
                              <AccordionTrigger>Compartment {index + 1}</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  <Label>Door Type</Label>
                                  <Select
                                    value={compartmentDoors[index]?.type || "none"}
                                    onValueChange={(value) => updateCompartmentDoorType(index, value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select door type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {DOOR_TYPES.map((doorType) => (
                                        <SelectItem key={doorType.id} value={doorType.id}>
                                          {doorType.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Back Panel Tab */}
              <TabsContent value="back" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="inset">Inset Back Panel</Label>
                      <Switch
                        id="inset"
                        checked={backPanelConfig.inset}
                        onCheckedChange={(checked) => setBackPanelConfig({ ...backPanelConfig, inset: checked })}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Set back panel inset or outset.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="no-offset">No Offset</Label>
                      <Switch
                        id="no-offset"
                        checked={backPanelConfig.noOffset}
                        onCheckedChange={(checked) => setBackPanelConfig({ ...backPanelConfig, noOffset: checked })}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Remove offset between back panel and frame.</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="back-panel-thickness">Back Panel Thickness (cm)</Label>
                      <span className="text-sm text-gray-500">{backPanelConfig.thickness} cm</span>
                    </div>
                    <Slider
                      id="back-panel-thickness"
                      value={[backPanelConfig.thickness]}
                      min={0.01}
                      max={0.03}
                      step={0.001}
                      onValueChange={(value) => setBackPanelConfig({ ...backPanelConfig, thickness: value[0] })}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Base Tab */}
              <TabsContent value="base" className="space-y-6">
                <div className="space-y-4">
                  <p>Base options will be available soon.</p>
                </div>
              </TabsContent>

              {/* Doors Tab */}
              <TabsContent value="doors" className="space-y-6">
                <div className="space-y-4">
                  {(furnitureType === "cabinet" || furnitureType === "closet") && (
                    <>
                      <div>
                        <Label>Door Configuration</Label>
                        <RadioGroup value={doorConfig} onValueChange={setDoorConfig} className="grid grid-cols-2 gap-4">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="one" id="door-one" className="mt-1" />
                            <Label htmlFor="door-one" className="cursor-pointer">
                              <span>One Door</span>
                            </Label>
                          </div>
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value="two" id="door-two" className="mt-1" />
                            <Label htmlFor="door-two" className="cursor-pointer">
                              <span>Two Doors</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {doorConfig === "one" && (
                        <div>
                          <Label>Door Direction</Label>
                          <RadioGroup
                            value={doorDirection}
                            onValueChange={setDoorDirection}
                            className="grid grid-cols-2 gap-4"
                          >
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="left" id="door-left" className="mt-1" />
                              <Label htmlFor="door-left" className="cursor-pointer">
                                <span>Left</span>
                              </Label>
                            </div>
                            <div className="flex items-start space-x-2">
                              <RadioGroupItem value="right" id="door-right" className="mt-1" />
                              <Label htmlFor="door-right" className="cursor-pointer">
                                <span>Right</span>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                    </>
                  )}
                  {furnitureType !== "cabinet" && furnitureType !== "closet" && (
                    <p>Door options are only available for cabinets and closets.</p>
                  )}
                </div>
              </TabsContent>

              {/* Drawers Tab */}
              <TabsContent value="drawers" className="space-y-6">
                <div className="space-y-4">
                  <p>Drawer options will be available soon.</p>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-4" />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Price: ${calculatePrice()}</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to cart</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add to wishlist</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {/* Add the CutListModal component here */}
              <CutListModal
                furnitureType={furnitureType}
                dimensions={dimensions}
                hasDoors={hasDoors}
                shelfCount={shelfCount}
                columnCount={columnCount}
                materialCategory={materialCategory}
                materialOption={materialOption}
              />
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" className="w-full" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button className="w-full" onClick={() => setIsSaveModalOpen(true)}>
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold">Saved Configurations</h3>
              <Button variant="link" size="sm" onClick={() => setShowSavedConfigurations(!showSavedConfigurations)}>
                {showSavedConfigurations ? "Hide" : "Show"}
              </Button>
            </div>

            {showSavedConfigurations && <SavedConfigurations loadConfiguration={loadConfiguration} />}
          </div>
        </div>
      )}

      <SaveConfigurationModal
        isOpen={isSaveModalOpen}
        setIsOpen={setIsSaveModalOpen}
        configuration={getCurrentConfiguration()}
        onSaveSuccess={handleSaveSuccess}
      />
    </div >\
