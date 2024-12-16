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

    // Parse request body
    let userId: string;
    try {
      const requestData = await req.json();
      console.log('Received request body:', requestData);
      
      if (!requestData.userId || typeof requestData.userId !== 'string') {
        throw new Error('Invalid or missing userId in request body');
      }
      userId = requestData.userId;
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

    console.log("Attempting to delete user:", userId);

    // Delete related records first
    const tables = [
      'certificates',
      'quiz_attempts',
      'user_progress',
      'daily_logins',
      'news_reads',
      'lesson_views',
      'ebook_views',
      'news_ratings',
      'lesson_ratings',
      'lesson_likes',
      'news_likes',
      'lesson_comments',
      'news_comments',
      'notifications',
      'user_ebook_progress'
    ];

    for (const table of tables) {
      const { error: deleteError } = await supabaseClient
        .from(table)
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.error(`Error deleting from ${table}:`, deleteError);
      }
    }

    // Delete the user's profile
    const { error: deleteProfileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (deleteProfileError) {
      throw new Error('Error deleting profile: ' + deleteProfileError.message);
    }

    // Delete the user from auth.users
    const { error: deleteAuthError } = await supabaseClient.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      throw new Error('Error deleting auth user: ' + deleteAuthError.message);
    }

    console.log("Successfully deleted user:", userId);

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in delete-user function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})