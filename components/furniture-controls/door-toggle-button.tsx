"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DoorOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface DoorToggleButtonProps {
  isOpen: boolean
  onClick: () => void
}

export const DoorToggleButton = ({ isOpen, onClick }: DoorToggleButtonProps) => {
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
