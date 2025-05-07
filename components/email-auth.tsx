"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/utils/supabase-client"
import { useToast } from "@/hooks/use-toast"

export function EmailAuth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/builder`,
          },
        })

        if (error) throw error

        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your sign up.",
        })
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${email}`,
        })
      }
    } catch (error: any) {
      console.error("Authentication error:", error)
      toast({
        title: isSignUp ? "Sign up failed" : "Sign in failed",
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
        <h3 className="text-lg font-medium">{isSignUp ? "Create an account" : "Sign in"}</h3>
        <p className="text-sm text-gray-500">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button type="button" className="text-blue-600 hover:underline" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>

      <form onSubmit={handleEmailAuth} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>
    </div>
  )
}
