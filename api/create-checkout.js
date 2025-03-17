const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        console.log('Request received:', req.body); // Log request
        console.log('STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY); // Check key

        const { planName, amount } = req.body;

        if (!planName || !amount) {
            return res.status(400).json({ error: 'Missing planName or amount' });
        }

        const isLocal = process.env.NODE_ENV === 'development';
        const baseUrl = isLocal 
            ? 'http://localhost:3000' 
            : process.env.VERCEL_URL 
                ? `https://${process.env.VERCEL_URL}` 
                : 'https://missfit-coaching-website.vercel.app';

        console.log('Base URL:', baseUrl); // Debug URL

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `MissFit Resume Writing - ${planName} Plan`,
                            description: `Resume writing services - ${planName} Package`,
                        },
                        unit_amount: Math.round(parseFloat(amount) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/success?plan=${encodeURIComponent(planName)}`,
            cancel_url: `${baseUrl}/resume`,
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error.message, error.stack);
        return res.status(500).json({ error: error.message });
    }
}