"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { getAllPatterns, addPattern } from "@/utils/pattern-service"
import { supabase } from "@/utils/supabase-client"
import type { Pattern } from "@/types/pattern-types"

export default function PatternsAdminPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  // New pattern form state
  const [newPattern, setNewPattern] = useState({
    name: "",
    category: "solid",
    color_hex: "#FFFFFF",
    is_premium: false,
    price_factor: 1.0,
  })

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        if (!data.session) {
          router.push("/")
          return
        }

        // Check if user has admin role
        // This is a simplified check - in a real app, you'd check app_metadata
        const isUserAdmin = data.session.user.email?.includes("admin") || false
        setIsAdmin(isUserAdmin)

        if (!isUserAdmin) {
          router.push("/")
          return
        }

        loadPatterns()
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/")
      }
    }

    checkAdmin()
  }, [router])

  const loadPatterns = async () => {
    try {
      setIsLoading(true)
      const data = await getAllPatterns()
      setPatterns(data)
    } catch (error) {
      console.error("Error loading patterns:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPattern = async () => {
    try {
      const result = await addPattern(newPattern)
      if (result) {
        setPatterns([...patterns, result])
        setNewPattern({
          name: "",
          category: "solid",
          color_hex: "#FFFFFF",
          is_premium: false,
          price_factor: 1.0,
        })
      }
    } catch (error) {
      console.error("Error adding pattern:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Pattern Management</h1>

      <Tabs defaultValue="patterns" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patterns">All Patterns</TabsTrigger>
          <TabsTrigger value="add">Add New Pattern</TabsTrigger>
        </TabsList>

        <TabsContent value="patterns" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.map((pattern) => (
              <Card key={pattern.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{pattern.name}</span>
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: pattern.color_hex }} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span>{pattern.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color:</span>
                      <span>{pattern.color_hex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Premium:</span>
                      <span>{pattern.is_premium ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price Factor:</span>
                      <span>{pattern.price_factor}x</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pattern-name">Pattern Name</Label>
                    <Input
                      id="pattern-name"
                      value={newPattern.name}
                      onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
                      placeholder="e.g., Oak Wood"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pattern-category">Category</Label>
                    <Select
                      value={newPattern.category}
                      onValueChange={(value) => setNewPattern({ ...newPattern, category: value })}
                    >
                      <SelectTrigger id="pattern-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid Colors</SelectItem>
                        <SelectItem value="wood">Wood Patterns</SelectItem>
                        <SelectItem value="marble">Marble Patterns</SelectItem>
                        <SelectItem value="fabric">Fabric Textures</SelectItem>
                        <SelectItem value="metal">Metal Finishes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="color-hex">Color (HEX)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color-hex"
                        value={newPattern.color_hex}
                        onChange={(e) => setNewPattern({ ...newPattern, color_hex: e.target.value })}
                        placeholder="#FFFFFF"
                      />
                      <input
                        type="color"
                        value={newPattern.color_hex}
                        onChange={(e) => setNewPattern({ ...newPattern, color_hex: e.target.value })}
                        className="w-10 h-10 p-1 rounded border"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price-factor">Price Factor</Label>
                    <Input
                      id="price-factor"
                      type="number"
                      min="1.0"
                      max="3.0"
                      step="0.1"
                      value={newPattern.price_factor}
                      onChange={(e) =>
                        setNewPattern({ ...newPattern, price_factor: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-premium"
                    checked={newPattern.is_premium}
                    onCheckedChange={(checked) => setNewPattern({ ...newPattern, is_premium: checked })}
                  />
                  <Label htmlFor="is-premium">Premium Pattern</Label>
                </div>

                <div className="space-y-2">
                  <Label>Texture Image (Optional)</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drag and drop or click to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG (max. 2MB)</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Upload Texture
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button onClick={handleAddPattern}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pattern
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
