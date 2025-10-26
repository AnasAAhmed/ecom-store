import { revalidatePath, revalidateTag } from "next/cache";
import { connectToDB } from "../mongoDB";
import Order from "../models/Order";
import Product from "../models/Product";

export async function getOrders(customerEmail: string, page: number) {
  try {
    await connectToDB();
    const limit = 6
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments({ customerEmail });
    if (!totalOrders) {
      return JSON.parse(JSON.stringify({
        totalOrders
      }))
    }
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await Order.find({
      customerEmail
    })
    .populate({ path: "products.product", model: Product ,opti
      ons: { limit: 2 },select:'-_id title price media' })
    .select('-customerPhone -customerEmail -shippingAddress -statusHistory -sessionId')
    .sort({ createdAt: 'desc' })
    .limit(limit)
    .skip(skip) ;

    return JSON.parse(JSON.stringify({
      orders,
      totalPages,
      totalOrders
    }))

  } catch (err) {
    console.log("[customerId_GET", err);
    throw new Error('Internal Server Error ' + (err as Error).message)

  };
};

export async function getSingleOrder(orderId: string) {
  try {
    await connectToDB();

    const order = await Order.findById(orderId)
    .populate({ path: "products.product", model: Product,select:'-_id title media price' })
    .select("-__v -updatedAt");

    return JSON.parse(JSON.stringify(order))

  } catch (err) {
    console.log("[single_order_GET", err);
    throw new Error('Internal Server Error ' + (err as Error).message)

  };
};

//for COD form & stripe webhook
export const stockReduce = async (products: OrderProductCOD[]) => {
  await connectToDB();
  for (let i = 0; i < products.length; i++) {
    const order = products[i];
    const product = await Product.findById(order.product).select('_id stock variants sold title slug');
    if (!product) throw new Error("Product Not Found");

    // Reduce the general product stock
    if (product.stock >= order.quantity) {
      product.stock -= order.quantity;
      product.sold += order.quantity;
    } else {
      console.error(`Not enough stock for product: ${order.product}`);
      throw new Error("Not enough stock for this Product");
    }

    // Find the matching variant
    if ((order.size || order.color) && order.variantId) {
      const variant = product.variants.find((v: Variant) => v._id!.toString() === order.variantId);
      if (!variant) throw new Error(`Variant not ${order.variantId} found for product: ${order.product}, size: ${order.size}, color: ${order.color}`);

      // Reduce the variant stock
      if (variant.quantity! >= order.quantity) {
        variant.quantity! -= order.quantity;
      } else {
        console.error(`Not enough stock for variant: ${order.product}, size: ${order.size}, color: ${order.color}`);
        throw new Error("Not enough stock for this variant");
      }
    }
    await product.save();

    revalidatePath('/');
    revalidatePath(`/products/${product.slug}`);
    revalidateTag(`/products/${product.slug}`);
  };
};