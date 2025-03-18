addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    console.log('Request received:', request.method, request.url); // Debug log

    if (request.method === 'OPTIONS') {
        console.log('Handling OPTIONS request');
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (request.method !== 'POST') {
        console.log('Method not allowed:', request.method);
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }

    try {
        console.log('Processing POST request');
        if (!env.STRIPE_SECRET_KEY) {
            console.error('STRIPE_SECRET_KEY not set');
            return new Response(JSON.stringify({ error: 'Server configuration error: STRIPE_SECRET_KEY not set' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
        }

        const { planName, amount } = await request.json();
        console.log('Request body:', { planName, amount });

        if (!planName || !amount) {
            console.log('Missing planName or amount');
            return new Response(JSON.stringify({ error: 'Missing planName or amount' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
        }

        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'payment_method_types[]': 'card',
                'line_items[0][price_data][currency]': 'usd',
                'line_items[0][price_data][product_data][name]': `MissFit Resume Writing - ${planName} Plan`,
                'line_items[0][price_data][product_data][description]': `${planName} Package`,
                'line_items[0][price_data][unit_amount]': Math.round(parseFloat(amount) * 100).toString(),
                'line_items[0][quantity]': '1',
                'mode': 'payment',
                'success_url': `${request.headers.get('Origin') || 'https://2846a354.missfitcoachingweb.pages.dev'}/success?plan=${encodeURIComponent(planName)}`,
                'cancel_url': `${request.headers.get('Origin') || 'https://2846a354.missfitcoachingweb.pages.dev'}/resume`,
            }).toString(),
        });

        const session = await response.json();
        console.log('Stripe session created:', session.id);

        if (!response.ok) {
            throw new Error(session.error?.message || 'Failed to create Stripe session');
        }

        return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Worker error:', error.message, error.stack);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }
}