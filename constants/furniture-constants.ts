import { BookOpen, Table, Archive, Monitor, Tv } from "lucide-react"
import type { FurnitureType, MaterialCategory, Finish, DoorType } from "@/types/furniture-types"

// Furniture types with their default dimensions and icons
export const FURNITURE_TYPES: Record<string, FurnitureType> = {
  closet: { name: "Closet", width: 80, height: 180, depth: 30, icon: BookOpen },
  table: { name: "Table", width: 120, height: 75, depth: 80, icon: Table },
  cabinet: { name: "Cabinet", width: 100, height: 90, depth: 45, icon: Archive },
  desk: { name: "Desk", width: 140, height: 75, depth: 60, icon: Monitor },
  sideboard: { name: "Sideboard", width: 160, height: 80, depth: 40, icon: Tv },
}

// Materials with their properties
export const MATERIAL_CATEGORIES: MaterialCategory[] = [
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
export const FINISHES: Finish[] = [
  { id: "natural", name: "Natural", factor: 1.0 },
  { id: "matte", name: "Matte", factor: 1.1 },
  { id: "glossy", name: "Glossy", factor: 1.2 },
  { id: "oiled", name: "Oiled", factor: 1.15 },
]

// Door types
export const DOOR_TYPES: DoorType[] = [
  { id: "none", name: "No Door" },
  { id: "single-left", name: "Single Door (Left Hinge)" },
  { id: "single-right", name: "Single Door (Right Hinge)" },
  { id: "double", name: "Double Doors" },
]

// Base prices for different furniture types
export const BASE_PRICES: Record<string, number> = {
  closet: 199,
  table: 299,
  cabinet: 249,
  desk: 279,
  sideboard: 349,
}

// Tab categories for the furniture builder
export const TAB_CATEGORIES = {
  ROW_ONE: [
    { id: "type", label: "Type" },
    { id: "dimensions", label: "Size" },
    { id: "material", label: "Material" },
    { id: "back", label: "Back" },
  ],
  ROW_TWO: [
    { id: "structure", label: "Structure" },
    { id: "base", label: "Base" },
    { id: "drawers", label: "Drawers" },
    { id: "doors", label: "Doors" },
  ],
}
