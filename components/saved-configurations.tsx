"use client"

import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getUserConfigurations, deleteConfiguration, type SavedConfiguration } from "@/utils/supabase-client"
import { useToast } from "@/hooks/use-toast"

interface SavedConfigurationsProps {
  onLoadConfiguration: (config: SavedConfiguration) => void
}

export function SavedConfigurations({ onLoadConfiguration }: SavedConfigurationsProps) {
  const [configurations, setConfigurations] = useState<SavedConfiguration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadConfigurations()
  }, [])

  const loadConfigurations = async () => {
    try {
      setIsLoading(true)
      const configs = await getUserConfigurations()
      setConfigurations(configs)
    } catch (error) {
      console.error("Error loading configurations:", error)
      toast({
        title: "Error loading saved designs",
        description: "There was a problem loading your saved furniture designs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteConfiguration(id)
      setConfigurations(configurations.filter((config) => config.id !== id))
      toast({
        title: "Configuration deleted",
        description: "Your saved design has been deleted",
      })
    } catch (error) {
      console.error("Error deleting configuration:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting your configuration",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading saved designs...</div>
  }

  if (configurations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>You don't have any saved designs yet.</p>
        <p className="text-sm mt-2">Design and save your furniture to see them here.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {configurations.map((config) => (
        <Card key={config.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center p-4">
              <div className="flex-1">
                <h3 className="font-medium">{config.name}</h3>
                <p className="text-sm text-gray-500">
                  {config.furniture_type.charAt(0).toUpperCase() + config.furniture_type.slice(1)} •
                  {new Date(config.created_at!).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onLoadConfiguration(config)}>
                  Load
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(config.id!)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
