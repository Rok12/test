"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/utils/supabase-client"
import { useToast } from "@/hooks/use-toast"
import type { User } from "@supabase/supabase-js"

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        console.log("Current session:", data.session)

        if (data.session) {
          setUser(data.session.user)
          toast({
            title: "Authenticated",
            description: `Signed in as ${data.session.user.email}`,
          })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error checking auth state:", error)
        setLoading(false)
      }
    }

    checkUser()

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email)
      setUser(session?.user || null)

      if (event === "SIGNED_IN" && session) {
        toast({
          title: "Signed in successfully",
          description: `Welcome, ${session.user.email}`,
        })
      } else if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        })
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [toast])

  // Update the handleSignIn function to use a more reliable approach
  const handleSignIn = async () => {
    try {
      setLoading(true)
      // Use the signInWithOAuth method with minimal options
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      })

      if (error) {
        console.error("Sign in error:", error)
        throw error
      }
    } catch (error) {
      console.error("Error signing in:", error)
      toast({
        title: "Sign in failed",
        description: "There was a problem signing in. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }

      setUser(null)
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    )
  }

  return user ? (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-gray-500">Signed in as {user.email}</p>
      <Button variant="outline" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  ) : (
    <Button variant="outline" onClick={handleSignIn}>
      Sign In with Google
    </Button>
  )
}
