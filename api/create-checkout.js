const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Request body:', req.body); // Log incoming data
    const { planName, amount } = req.body;

    if (!planName || !amount) {
      return res.status(400).json({ error: 'Missing planName or amount' });
    }

    console.log('STRIPE_SECRET_KEY:', !!process.env.STRIPE_SECRET_KEY); // Check if key exists
    console.log('VERCEL_URL:', process.env.VERCEL_URL);
    console.log('SITE_URL:', process.env.SITE_URL);

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
            unit_amount: Math.round(parseFloat(amount) * 100), // Ensure valid number
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.VERCEL_URL || process.env.SITE_URL || 'https://missfit-coaching-dhadfhxb1-erics-projects-360b0df5.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VERCEL_URL || process.env.SITE_URL || 'https://missfit-coaching-dhadfhxb1-erics-projects-360b0df5.vercel.app'}/cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error.message, error.stack);
    return res.status(500).json({ error: error.message });
  }
}