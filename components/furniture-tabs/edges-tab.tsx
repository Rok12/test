"use client"

import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface EdgesTabProps {
  hasWhiteEdges: boolean
  setHasWhiteEdges: (has: boolean) => void
}

export const EdgesTab = ({ hasWhiteEdges, setHasWhiteEdges }: EdgesTabProps) => {
  return (
    <div className="space-y-4">
      <Label className="mb-2 block">Edge Treatment</Label>

      <div className="grid grid-cols-2 gap-4">
        <div
          className={cn(
            "border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
            !hasWhiteEdges && "border-primary bg-primary/5",
          )}
          onClick={() => setHasWhiteEdges(false)}
        >
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 bg-white border-2 border-t-[#A67C52] border-l-[#A67C52] border-r-[#A67C52] border-b-white"></div>
          </div>
          <p className="text-xs text-center font-medium">Front Edge Only</p>
          <p className="text-xs text-center text-gray-500 mt-1">White edge banding on front-facing edges only</p>
        </div>

        <div
          className={cn(
            "border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors",
            hasWhiteEdges && "border-primary bg-primary/5",
          )}
          onClick={() => setHasWhiteEdges(true)}
        >
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 bg-white border-2 border-white"></div>
          </div>
          <p className="text-xs text-center font-medium">All Edges</p>
          <p className="text-xs text-center text-gray-500 mt-1">White edge banding on all panel edges</p>
        </div>
      </div>
    </div>
  )
}
