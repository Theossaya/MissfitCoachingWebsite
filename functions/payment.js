export async function onRequest(context) {
    // Handle CORS
    if (context.request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        }
      });
    }
  
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
      const data = await context.request.json();
      
      if (!data.planName || !data.amount) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { 
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }
  
      const stripeSecretKey = context.env.STRIPE_SECRET_KEY;
      const origin = context.request.headers.get('Origin') || 'https://missfitcoachingweb.pages.dev';
      
      // Build form data for Stripe API
      const formData = new URLSearchParams();
      formData.append('payment_method_types[0]', 'card');
      formData.append('line_items[0][price_data][currency]', 'usd');
      formData.append('line_items[0][price_data][product_data][name]', `MissFit Resume Writing - ${data.planName} Plan`);
      formData.append('line_items[0][price_data][product_data][description]', `${data.planName} Package`);
      formData.append('line_items[0][price_data][unit_amount]', Math.round(parseFloat(data.amount) * 100));
      formData.append('line_items[0][quantity]', 1);
      formData.append('mode', 'payment');
      formData.append('success_url', `${origin}/success?plan=${encodeURIComponent(data.planName)}`);
      formData.append('cancel_url', `${origin}/resume`);
      
      // Call Stripe API directly
      const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${stripeSecretKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });
      
      if (!stripeResponse.ok) {
        const errorData = await stripeResponse.json();
        throw new Error(errorData.error?.message || 'Error creating Stripe session');
      }
      
      const session = await stripeResponse.json();
      
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