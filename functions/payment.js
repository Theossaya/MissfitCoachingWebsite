import Stripe from 'stripe';

export async function onRequest(context) {
  // Handle CORS for cross-origin requests
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }
    });
  }

  // Only process POST requests
  if (context.request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    // Parse request body
    const data = await context.request.json();
    
    // Validate required fields
    if (!data.planName || !data.amount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Initialize Stripe with your secret key from environment variables
    const stripe = new Stripe(context.env.STRIPE_SECRET_KEY);
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `MissFit Resume Writing - ${data.planName} Plan`,
              description: `${data.planName} Package`,
            },
            unit_amount: Math.round(parseFloat(data.amount) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${context.request.headers.get('Origin') || 'https://missfitcoachingweb.pages.dev'}/success?plan=${encodeURIComponent(data.planName)}`,
      cancel_url: `${context.request.headers.get('Origin') || 'https://missfitcoachingweb.pages.dev'}/resume`,
    });
    
    // Return the session ID for redirectToCheckout
    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (error) {
    // Handle errors
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}