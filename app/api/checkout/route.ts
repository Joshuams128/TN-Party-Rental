import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { itemName, price } = await req.json()
    
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    console.log('Checkout baseUrl:', baseUrl)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ 
        price_data: {
          currency: 'cad',
          product_data: { name: itemName },
          unit_amount: price,
        },
        quantity: 1 
      }],
      mode: 'payment',
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/inventory`,
    })
    
    console.log('Session created with success_url:', `${baseUrl}/success`)
    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return Response.json(
      { error: error instanceof Error ? error.message : 'Checkout failed' },
      { status: 500 }
    )
  }
}
