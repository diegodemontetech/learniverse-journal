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

    // Parse and validate request body
    let userId: string;
    try {
      const body = await req.json();
      console.log('Received request body:', body);
      
      if (!body.userId || typeof body.userId !== 'string') {
        throw new Error('Invalid or missing userId in request body');
      }
      userId = body.userId;
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify the requesting user is an admin
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser(req.headers.get('Authorization')?.replace('Bearer ', ''))

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error('Error getting user: ' + authError.message)
    }

    // Get the user's role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user?.id)
      .single()

    if (profileError) {
      console.error('Profile error:', profileError);
      throw new Error('Error getting profile: ' + profileError.message)
    }

    if (profile.role !== 'admin') {
      throw new Error('Only admins can delete users')
    }

    // Delete related records first
    console.log('Deleting related records for user:', userId)

    // Delete certificates
    const { error: certificatesError } = await supabaseClient
      .from('certificates')
      .delete()
      .eq('user_id', userId)
    
    if (certificatesError) {
      console.error('Error deleting certificates:', certificatesError)
      throw new Error('Error deleting certificates: ' + certificatesError.message)
    }

    // Delete quiz attempts
    const { error: quizAttemptsError } = await supabaseClient
      .from('quiz_attempts')
      .delete()
      .eq('user_id', userId)

    if (quizAttemptsError) {
      console.error('Error deleting quiz attempts:', quizAttemptsError)
      throw new Error('Error deleting quiz attempts: ' + quizAttemptsError.message)
    }

    // Delete user progress
    const { error: progressError } = await supabaseClient
      .from('user_progress')
      .delete()
      .eq('user_id', userId)

    if (progressError) {
      console.error('Error deleting user progress:', progressError)
      throw new Error('Error deleting user progress: ' + progressError.message)
    }

    // Delete the user's profile
    const { error: deleteProfileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (deleteProfileError) {
      console.error('Error deleting profile:', deleteProfileError);
      throw new Error('Error deleting profile: ' + deleteProfileError.message)
    }

    // Finally, delete the user from auth.users
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError);
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