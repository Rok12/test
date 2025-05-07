"use client"

import dynamic from "next/dynamic"

// Use dynamic import to avoid SSR issues with Three.js
const EnhancedFurnitureBuilder = dynamic(() => import("@/components/enhanced-furniture-builder"), { ssr: false })

export default function DesignerPage() {
  return (
    <div className="h-screen">
      <EnhancedFurnitureBuilder />
    </div>
  )
}
