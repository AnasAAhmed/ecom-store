import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";


export async function OPTIONS(data: any,) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": `${process.env.ECOM_STORE_URL}`,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  return NextResponse.json(data, { headers: corsHeaders });
}


export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, currency, exchangeRate } = await req.json();
    if (!cartItems || !customer || !currency || !exchangeRate) {
      return new NextResponse("Not enough data to checkout", { statusText: "Not enough data to checkout" });
    }
    const shippingOptions = currency === 'USD'
      ? [
        { shipping_rate: "shr_1PBuy1BxsJkAdKVPWZgtJcuW" },
        { shipping_rate: "shr_1PBurSBxsJkAdKVPHis4y2cO" },
      ]
      : [
        { shipping_rate: "shr_1PltIeBxsJkAdKVPFWU8YWzr" },
        { shipping_rate: "shr_1PltJDBxsJkAdKVPArU5k5L6" },
      ];
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["US", "PK"],
      },
      shipping_options: shippingOptions,
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `${cartItem.item.title}${cartItem.size ? ` (Size: ${cartItem.size})` : ''}${cartItem.color ? ` (Color: ${cartItem.color})` : ''}`,
            images: [cartItem.item.media[0]],
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
              variantId: cartItem.variantId
            },
          },
          unit_amount: (cartItem.item.price * 100 * exchangeRate).toFixed() || 1,
        },
        quantity: cartItem.quantity,
      })),
      metadata: {
        exchange_rate: exchangeRate.toString(),
      },
      client_reference_id: customer.id,
      customer_email: customer.email!,
      success_url: `${process.env.ECOM_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOM_STORE_URL}/cart`,

    }, {
      idempotencyKey: crypto.randomUUID(),
    });
    return OPTIONS(session);
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
