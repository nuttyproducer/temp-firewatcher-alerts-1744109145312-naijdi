
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (_req) => {
  try {
    // Get the NASA_FIRMS_API_KEY from the environment variables
    const apiKey = Deno.env.get("NASA_FIRMS_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "NASA FIRMS API key not configured" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        apiKey,
        message: "NASA FIRMS API key retrieved successfully" 
      }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
})
