"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getUserConfigurations, type SavedConfiguration } from "@/utils/supabase-client"
import { supabase } from "@/utils/supabase-client"
import { useRouter } from "next/navigation"
import { getPatternById } from "@/utils/pattern-service"

export default function MyProjectsPage() {
  const [configurations, setConfigurations] = useState<SavedConfiguration[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        if (!data.session) {
          // Redirect to home if not authenticated
          router.push("/")
          return
        }

        setUser(data.session.user)
        loadConfigurations()
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const loadConfigurations = async () => {
    try {
      setIsLoading(true)
      const configs = await getUserConfigurations()
      setConfigurations(configs)
    } catch (error) {
      console.error("Error loading configurations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Inside the component, add this function to get pattern information
  const getPatternInfo = async (patternId: string | null | undefined) => {
    if (!patternId) return null

    try {
      return await getPatternById(patternId)
    } catch (error) {
      console.error("Error fetching pattern:", error)
      return null
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className="text-gray-600">View and manage your saved furniture designs</p>
        </div>
        <Button asChild className="bg-black text-white hover:bg-black/90">
          <Link href="/builder">
            Create New Design
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {configurations.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No saved designs yet</h2>
          <p className="text-gray-500 mb-6">Start creating your custom furniture to see your designs here.</p>
          <Button asChild>
            <Link href="/builder">Start Designing</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {configurations.map(async (config) => {
            const pattern = config.pattern_id ? await getPatternInfo(config.pattern_id) : null

            return (
              <Card key={config.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                  {/* If there's a pattern, show its color */}
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: pattern?.color_hex || "#F0F0F0" }}
                  >
                    <div className="text-4xl font-bold text-white opacity-50">
                      {config.furniture_type.charAt(0).toUpperCase()}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{config.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-sm text-gray-600">
                      {config.furniture_type.charAt(0).toUpperCase() + config.furniture_type.slice(1)}
                      {pattern && <span className="ml-2">• {pattern.name}</span>}
                    </div>
                    <div className="text-sm text-gray-500">{new Date(config.created_at!).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button asChild size="sm">
                      <Link href={`/builder?config=${config.id}`}>Edit Design</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
