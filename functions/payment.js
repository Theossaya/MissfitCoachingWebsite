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
        const { planName, amount } = await request.json();
        console.log('Request body:', { planName, amount }); // Debug log

        if (!planName || !amount) {
            console.log('Missing planName or amount');
            return new Response(JSON.stringify({ error: 'Missing planName or amount' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            });
        }

        // Use Stripe via environment variable
        const stripe = new Stripe(env.STRIPE_SECRET_KEY);
        console.log('Stripe initialized'); // Debug log

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `MissFit Resume Writing - ${planName} Plan`,
                        description: `${planName} Package`,
                    },
                    unit_amount: Math.round(parseFloat(amount) * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${request.headers.get('Origin') || 'https://65cb7696.missfitcoachingweb.pages.dev'}/success?plan=${encodeURIComponent(planName)}`,
            cancel_url: `${request.headers.get('Origin') || 'https://65cb7696.missfitcoachingweb.pages.dev'}/resume`,
        });

        console.log('Session created:', session.id); // Debug log

        return new Response(JSON.stringify({ sessionId: session.id }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (error) {
        console.error('Worker error:', error.message);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
    }
}