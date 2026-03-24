import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { itemName, price, cancelUrl } = await req.json()
    
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    console.log('Checkout baseUrl:', baseUrl)
    
    // Determine cancel URL based on item type
    const finalCancelUrl = cancelUrl || (itemName.includes('Event Ticket') ? `${baseUrl}/tn-social` : `${baseUrl}/inventory`)
    
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
      cancel_url: finalCancelUrl,
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
