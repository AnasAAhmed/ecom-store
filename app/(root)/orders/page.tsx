import { auth } from "@/auth";
import CancelOrder from "@/components/CancelOrder";
import PaginationControls from "@/components/PaginationControls";
import { getOrders } from "@/lib/actions/actions";
import { slugify } from "@/lib/utils/features";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Borcelle | Orders",
  description: "Track your orders here",
};

const Orders = async ({ searchParams }: { searchParams: any }) => {
  const page = Number(searchParams?.page) || 1;
  const session = (await auth()) as Session
  if (!session) {
    return redirect('/login?redirect_url=/orders');
  };
  const data = await getOrders(session?.user?.email!, page);

  return (
    <div className="sm:px-10 py-5 px-3 min-h-[90vh]">
      <p className="text-heading3-bold my-10">Your Orders</p>

      <div className="flex flex-col gap-6">
        {data.totalOrders > 0 ? (
          data.orders?.map((order: OrderType) => (
            <div
              key={order._id}
              className="flex flex-col gap-6 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <p className="text-base-medium">
                 <b> Total Amount</b>: {(order.totalAmount * order.exchangeRate).toFixed()}
                </p>
                <p className="text-base-medium">
                 <b>Payment method</b> : {order.method}
                </p>
                <p className="text-base-medium">
                  <CancelOrder order={order} />
                </p>
                <p className="text-base-medium"><b>Currency</b>: {order.currency.toLowerCase()}</p>
                <p className="text-base-medium truncate max-w-60"
                  style={{ color: order.status.startsWith('Canceled') ? 'red' : '' }}>
                 <b> Status</b>: {order.status}
                </p>
                {order.method !== 'COD' && order.status.startsWith('Canceled') &&
                  <p className="text-base-medium flex flex-col max-w-60 gap-1" >
                   <b> Contact for refund</b>:
                    <a href="tel:example@gmail.com" className="hover:underline">Call to: example@gmail.com</a>
                    <a href="mailto:example@gmail.com" className="hover:underline">Email:example@gmail.com</a>
                  </p>}
              </div>

              <div className="flex flex-col gap-5">
                {order.products.map((orderItem: OrderItemType, i) => (
                  <div key={i} className="flex gap-4">
                    {orderItem.product ? (
                      <>
                        <Image
                          src={orderItem.product.media[0]}
                          alt={orderItem.product.title}
                          width={100}
                          height={100}
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg"
                        />
                        <div className="flex flex-col justify-between w-full">
                          <p className="text-small-medium">
                            Title:{" "}
                            <span className="text-small-bold">
                              <Link title={"See details of "+orderItem.product.title} href={`/products/${slugify(orderItem.product.title)}`}>
                                {orderItem.product.title}
                              </Link>
                            </span>
                          </p>
                          <p className="text-small-medium">
                            Shipping Rate:{" "}
                            <span className="text-small-bold">
                              {order.shippingRate || "3-9 days free delivery"}
                            </span>
                          </p>
                          <p className="text-small-medium">
                            Unit Price:{" "}
                            {(orderItem.product.price * order.exchangeRate).toFixed()}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col justify-between w-full">
                        <p className="text-small-medium text-red-500">
                          This product has been deleted from the website.
                        </p>
                      </div>
                    )}
                    <div className="flex flex-col justify-between w-full">
                      <p className="text-small-medium">
                        Color:{" "}
                        <span className="text-small-bold">
                          {orderItem.color || "N/A"}
                        </span>
                      </p>
                      <p className="text-small-medium">
                        Size:{" "}
                        <span className="text-small-bold">
                          {orderItem.size || "N/A"}
                        </span>
                      </p>
                      <p className="text-small-medium">
                        Quantity:{" "}
                        <span className="text-small-bold">
                          {orderItem.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-body-bold my-5">You have no orders yet.</p>
        )}
      </div>
      <PaginationControls currentPage={page} totalPages={data.totalPages} />
    </div>
  );
};

export const dynamic = "force-dynamic";
export default Orders;
