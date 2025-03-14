/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Import the Stripe library
import Stripe from 'stripe';

export default {
  async fetch(request, env, ctx) {
    // Handle CORS for local development
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }

    // Only process POST requests
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      // Parse request body
      const data = await request.json();
      
      // Validate required fields
      if (!data.planName || !data.planPrice) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Initialize Stripe with your secret key from environment variables
      const stripe = new Stripe(env.STRIPE_SECRET_KEY);
      
      // Create a checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: data.planName,
                description: `${data.planName} Package`,
              },
              unit_amount: Math.round(parseFloat(data.planPrice) * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: data.successUrl || `${request.headers.get('Origin') || 'https://yourdomain.com'}/success`,
        cancel_url: data.cancelUrl || `${request.headers.get('Origin') || 'https://yourdomain.com'}/pricing`,
      });
      
      // Return the session ID
      return new Response(
        JSON.stringify({ id: session.id }),
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
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        }
      );
    }
  }
};