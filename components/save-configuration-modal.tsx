"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveConfiguration, isAuthenticated, supabase, type SavedConfiguration } from "@/utils/supabase-client"
import { useToast } from "@/hooks/use-toast"

interface SaveConfigurationModalProps {
  isOpen: boolean
  onClose: () => void
  currentConfig: Omit<SavedConfiguration, "name">
  onSaveSuccess: (savedConfig: SavedConfiguration) => void
}

export function SaveConfigurationModal({ isOpen, onClose, currentConfig, onSaveSuccess }: SaveConfigurationModalProps) {
  const [configName, setConfigName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        setIsCheckingAuth(true)
        const authenticated = await isAuthenticated()
        console.log("User authentication status:", authenticated)
        setIsUserAuthenticated(authenticated)
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsUserAuthenticated(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    if (isOpen) {
      checkAuthentication()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/builder`,
        },
      })

      if (error) {
        throw error
      }

      // The page will redirect to Google for authentication
    } catch (error) {
      console.error("Error initiating sign in:", error)
      toast({
        title: "Sign in failed",
        description: "There was a problem initiating the sign in process. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSave = async () => {
    if (!configName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your configuration",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      // Double-check authentication before saving
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        toast({
          title: "Authentication required",
          description: "You need to sign in to save configurations",
          variant: "destructive",
        })
        return
      }

      // Create a clean configuration object
      const configToSave: SavedConfiguration = {
        ...currentConfig,
        name: configName,
        // Ensure these fields are properly formatted
        compartment_doors: currentConfig.compartment_doors || [],
        back_panel_config: {
          inset: currentConfig.back_panel_config?.inset || false,
          thickness: currentConfig.back_panel_config?.thickness || 0.018,
          noOffset: currentConfig.back_panel_config?.noOffset || false,
        },
      }

      console.log("Attempting to save configuration:", configToSave)

      const savedConfig = await saveConfiguration(configToSave)

      console.log("Configuration saved successfully:", savedConfig)

      toast({
        title: "Configuration saved",
        description: "Your furniture configuration has been saved successfully",
      })

      onSaveSuccess(savedConfig)
      onClose()
    } catch (error) {
      console.error("Error saving configuration:", error)

      // More descriptive error message
      toast({
        title: "Save failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error saving your configuration. Please check the console for details.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // If still checking authentication status, show loading
  if (isCheckingAuth) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="text-center py-8">
            <p>Checking authentication status...</p>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated, show sign in prompt
  if (!isUserAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Authentication Required</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">You need to sign in to save your furniture configurations.</p>

            <div className="flex justify-center mt-6">
              <Button onClick={handleSignIn}>Sign In with Google</Button>
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If authenticated, show the save form
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Save Configuration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="config-name">Configuration Name</Label>
            <Input
              id="config-name"
              value={configName}
              onChange={(e) => setConfigName(e.target.value)}
              placeholder="My Custom Bookshelf"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
