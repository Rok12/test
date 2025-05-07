"use client"

import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"

// Dynamically import the 3D components to avoid SSR issues
const FurnitureBuilder = dynamic(() => import("@/components/enhanced-furniture-builder"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
})

export default function BuilderPage() {
  const searchParams = useSearchParams()
  const configId = searchParams.get("config")

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <FurnitureBuilder initialConfigId={configId} />
      </Suspense>
    </div>
  )
}
