import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Customer from "@/lib/models/Customer";
import { stockReduce } from "@/lib/actions/order.actions";
import { extractNameFromEmail } from "@/lib/utils/features";

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("Stripe-Signature") as string

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      const customerInfo = {
        id: session.client_reference_id,
        email: session?.customer_email,
        name: session.customer_details?.name || extractNameFromEmail(session?.customer_email! || ''),
        phone: session?.customer_details?.phone,
      }

      const shippingAddress = {
        street: session?.shipping_details?.address?.line1,
        city: session?.shipping_details?.address?.city,
        state: session?.shipping_details?.address?.state,
        postalCode: session?.shipping_details?.address?.postal_code,
        country: session?.shipping_details?.address?.country,
        phone: customerInfo.phone
      }

      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"] }
      )

      const lineItems = await retrieveSession?.line_items?.data

      const orderItems = lineItems!.map((item: any) => {
        return {
          product: item.price.product.metadata.productId,
          color: item.price.product.metadata.color || undefined,
          size: item.price.product.metadata.size || undefined,
          variantId: item.price.product.metadata.variantId || undefined,
          quantity: item.quantity,
        }
      });

      const exchangeRate = retrieveSession.metadata?.exchange_rate ? parseFloat(retrieveSession.metadata!.exchange_rate) : 1;
      const totalAmountInUSD = session.amount_total
        ? (session.amount_total / 100) / exchangeRate
        : 0;

      await connectToDB()

      const newOrder = new Order({
        sessionId:session.id,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        products: orderItems,
        shippingAddress,
        currency: session?.currency,
        shippingRate: (session?.shipping_cost?.amount_total! / 100).toString(),
        totalAmount: totalAmountInUSD,
        statusHistory: { status: "Pending: Payment-Successfull & Processing", changedAt: Date.now() },
        status: "pending",
        method: 'card',
        isPaid: true,
        exchangeRate: exchangeRate,
      })

      await newOrder.save();

      let customer = await Customer.findOne({ _id: customerInfo.id });

      if (customer) {
        customer.orders.push(newOrder._id);
        customer.ordersCount += 1;
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
          ordersCount: 1
        });
      };
      await customer.save();

      //reduce stock
      await stockReduce(orderItems);
    }
    return new NextResponse("Order created", { status: 200 })
  } catch (err) {
    console.log("[webhooks_POST]", err)
    return new NextResponse("Failed to create the order. Contact Owner: " + (err as Error).message, { status: 500 })
  }
}