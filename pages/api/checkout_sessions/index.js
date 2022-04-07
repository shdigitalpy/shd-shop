const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler (req, res) {
    if (req.method === 'POST') {
        console.log(" shipping charge ", req?.body?.shippingCost)
        try {
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: req?.body?.items ?? [],
                discounts: req?.body?.discounts ?? [],
                shipping_options: [{
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: req?.body?.shippingCost ?? 0,
                            currency: 'chf',
                        },
                        display_name: 'Express',
                    },
                }],
                success_url: `${req.headers.origin}/success/?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${req.headers.origin}/shop-cart/?canceled=true`,
            });

            res.status(200).json(session);
        } catch (err) {
            console.log("error aaya")
            res.status(500).json({ statusCode: 500, message: "error aaya" + err.message });
        }
    } else {
        res.setHeader('Allow', 'Post');
        res.status(405).end('Method not allowed');
    }
};
