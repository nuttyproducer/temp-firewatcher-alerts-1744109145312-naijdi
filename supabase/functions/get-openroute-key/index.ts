
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

serve(async (_req) => {
  try {
    // Get the OPENROUTE_API_KEY from the environment variables
    const apiKey = Deno.env.get("OPENROUTE_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "OpenRouteService API key not configured" }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        apiKey,
        message: "OpenRouteService API key retrieved successfully" 
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
