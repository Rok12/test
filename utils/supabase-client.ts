import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Log environment variable status (without revealing values)
console.log("Supabase URL available:", !!supabaseUrl)
console.log("Supabase Anon Key available:", !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables - some features may not work")
}

// Create the client with explicit types to avoid issues
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Test the connection and log the result
supabase
  .from("patterns")
  .select("count", { count: "exact", head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error("Supabase connection test failed:", error.message)
    } else {
      console.log("Supabase connection successful, patterns count:", count)
    }
  })
  .catch((err) => {
    console.error("Supabase connection test error:", err.message)
  })

// Update the SavedConfiguration interface to include pattern_id
export interface SavedConfiguration {
  id?: string
  user_id?: string
  name: string
  furniture_type: string
  dimensions: {
    width: number
    height: number
    depth: number
  }
  material_category: string
  material_option: string
  pattern_id?: string | null
  finish: string
  has_doors: boolean
  shelf_count: number
  door_config?: string
  door_direction?: string
  has_mounting_strip: boolean
  column_count: number
  compartment_doors?: any[]
  back_panel_config: {
    inset: boolean
    thickness: number
    noOffset?: boolean
  }
  created_at?: string
  thumbnail_url?: string
}

// Check if user is authenticated
export async function isAuthenticated() {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log("Auth check - Session data:", data.session ? "Session exists" : "No session")
    if (error) {
      console.error("Error checking authentication:", error)
      return false
    }
    return !!data.session
  } catch (error) {
    console.error("Error in isAuthenticated:", error)
    return false
  }
}

// Get current user ID
export async function getCurrentUserId() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) {
      console.error("Error getting current user:", error)
      return null
    }
    console.log("Current user ID:", data.user?.id)
    return data.user?.id
  } catch (error) {
    console.error("Error in getCurrentUserId:", error)
    return null
  }
}

// Save a configuration to Supabase
export async function saveConfiguration(config: SavedConfiguration) {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      console.error("No active session found")
      throw new Error("You must be logged in to save configurations")
    }

    const userId = sessionData.session.user.id
    if (!userId) {
      console.error("User ID not found in session")
      throw new Error("Unable to determine user ID")
    }

    console.log("Saving configuration for user:", userId)

    // Make sure we're not sending undefined values
    const cleanConfig = {
      ...config,
      // Set the user_id to the current authenticated user
      user_id: userId,
      // Ensure compartment_doors is a valid JSON array
      compartment_doors: config.compartment_doors || [],
      // Add a timestamp if not provided
      created_at: config.created_at || new Date().toISOString(),
    }

    console.log("Saving configuration:", cleanConfig)

    // First, check if the user can insert into the table
    const { data: testData, error: testError } = await supabase.from("furniture_configurations").select("id").limit(1)

    if (testError) {
      console.error("Error testing table access:", testError)
      throw new Error(`Database access error: ${testError.message}`)
    }

    // Now try to insert the data
    const { data, error } = await supabase.from("furniture_configurations").insert([cleanConfig]).select()

    if (error) {
      console.error("Supabase insert error:", error)

      if (error.message.includes("row-level security")) {
        throw new Error(
          "Permission denied: You can only save your own configurations. Make sure RLS is configured correctly.",
        )
      }

      throw new Error(`Database error: ${error.message}`)
    }

    if (!data || data.length === 0) {
      console.error("No data returned from insert operation")
      throw new Error("No data returned from insert operation")
    }

    console.log("Configuration saved successfully:", data[0])
    return data[0]
  } catch (error) {
    console.error("Error in saveConfiguration:", error)
    throw error
  }
}

// Get all configurations for the current user
export async function getUserConfigurations() {
  try {
    // Get current user ID from the session directly
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      console.log("No session found, returning empty configurations array")
      return [] // Return empty array if not authenticated
    }

    const userId = sessionData.session.user.id
    if (!userId) {
      console.error("User ID not found in session")
      return [] // Return empty array if user ID not found
    }

    console.log("Fetching configurations for user:", userId)

    const { data, error } = await supabase
      .from("furniture_configurations")
      .select("*")
      .eq("user_id", userId) // Only get configurations for current user
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error fetching configurations:", error)
      throw error
    }

    console.log(`Found ${data?.length || 0} configurations`)
    return data || []
  } catch (error) {
    console.error("Error in getUserConfigurations:", error)
    throw error
  }
}

// Get a specific configuration by ID
export async function getConfigurationById(id: string) {
  try {
    const { data, error } = await supabase.from("furniture_configurations").select("*").eq("id", id).single()

    if (error) {
      console.error("Supabase error getting configuration by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getConfigurationById:", error)
    return null
  }
}

// Delete a configuration
export async function deleteConfiguration(id: string) {
  try {
    // First check if the user is authenticated
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      throw new Error("You must be logged in to delete configurations")
    }

    const { error } = await supabase.from("furniture_configurations").delete().eq("id", id)

    if (error) {
      console.error("Supabase error deleting configuration:", error)
      throw error
    }

    return true
  } catch (error) {
    console.error("Error in deleteConfiguration:", error)
    throw error
  }
}
