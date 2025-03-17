const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { planName, amount } = req.body;

        if (!planName || !amount) {
            return res.status(400).json({ error: 'Missing planName or amount' });
        }

        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : 'https://missfit-coaching-dhadfhxb1-erics-projects-360b0df5.vercel.app'; // Fallback URL

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
                        unit_amount: Math.round(parseFloat(amount) * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/success.html?plan=${encodeURIComponent(planName)}`,
            cancel_url: `${baseUrl}/pages/resume.html`,
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error.message);
        return res.status(500).json({ error: error.message });
    }
}