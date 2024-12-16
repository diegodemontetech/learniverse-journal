import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the request body
    const { userId } = await req.json()
    console.log('Attempting to delete user:', userId)

    // Verify the requesting user is an admin
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''))

    if (authError) {
      throw new Error('Error getting user: ' + authError.message)
    }

    // Get the user's role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()

    if (profileError) {
      throw new Error('Error getting profile: ' + profileError.message)
    }

    if (profile.role !== 'admin') {
      throw new Error('Only admins can delete users')
    }

    // Delete the user from auth.users (this will cascade to profiles due to FK)
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)

    if (deleteError) {
      throw new Error('Error deleting user: ' + deleteError.message)
    }

    console.log('Successfully deleted user:', userId)

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in delete-user function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})