"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/utils/supabase-client"
import { useToast } from "@/hooks/use-toast"

export function MagicLinkAuth() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/builder`,
        },
      })

      if (error) throw error

      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      })
    } catch (error: any) {
      console.error("Magic link error:", error)
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Sign in with Magic Link</h3>
        <p className="text-sm text-gray-500">We'll send a secure link to your email</p>
      </div>

      <form onSubmit={handleMagicLinkSignIn} className="space-y-4">
        <div>
          <Label htmlFor="magic-email">Email</Label>
          <Input id="magic-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send Magic Link"}
        </Button>
      </form>
    </div>
  )
}
