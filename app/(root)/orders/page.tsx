import { auth } from "@/auth";
import PaginationControls from "@/components/PaginationControls";
import SmartLink from "@/components/SmartLink";
import { getOrders } from "@/lib/actions/order.actions";
import { slugify } from "@/lib/utils/features";
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "Borcelle | Orders",
  description: "Track your orders here",
};

const Orders = async (props: { searchParams: Promise<any> }) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const session = (await auth()) as Session
 if (!session||!session.user.id) {
    redirect('/login');
    return 
  }
  const data = await getOrders(session?.user?.email!, page);
  function getStatusColor(status: string): string {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("pending")) return "#d97706";
    if (lowerStatus.includes("shipped") || lowerStatus.includes("processing")) return "#2563eb";
    if (lowerStatus.includes("delivered")) return "#16a34a";
    if (lowerStatus.includes("canceled") || lowerStatus.includes("cancelled")) return "#dc2626";
    if (lowerStatus.includes("refunded")) return "#7c3aed";

    return "#374151";
  }

  return (
    <div className="sm:px-10 py-5 px-3 min-h-[90vh]">
      <p className="text-heading3-bold my-10">Your Orders ({data.totalOrders || 0})</p>
      <div className="flex flex-col gap-6">
        {data.totalOrders > 0 ? (
          data.orders?.map((order: OrderType) => (
            <div
              key={order._id}
              className="flex flex-col gap-6 p-4 bg-gray-50 rounded-lg shadow-sm "
            >
              <div className="flex flex-col gap-4">
                {order.products.map((orderItem: OrderItemType, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 bg-white border rounded-2xl shadow-md transition hover:shadow-lg"
                  >
                    {/* Image or Deleted Product */}
                    {orderItem.product ? (
                      <Image
                        src={orderItem.product.media[0]}
                        alt={orderItem.product.title}
                        width={128}
                        height={128}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-red-100 text-red-500 rounded-xl text-sm text-center px-2">
                        Product deleted
                      </div>
                    )}

                    {/* Details Section */}
                    <div className="flex flex-col justify-between gap-2 flex-1">
                      {orderItem.product && (
                        <>
                          <p className="text-sm sm:text-base font-medium text-gray-800">
                            <span className="font-semibold">Title:</span>{" "}
                            <SmartLink
                              className="text-blue-600 hover:underline line-clamp-2"
                              title={`See details of ${orderItem.product.title}`}
                              href={`/products/${slugify(orderItem.product.title)}`}
                            >
                              {orderItem.product.title}
                            </SmartLink>
                          </p>

                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Unit Price:</span>{" "}
                            {(orderItem.product.price * order.exchangeRate).toFixed()} <small>{order.currency.toUpperCase()}</small>
                          </p>
                        </>
                      )}

                      {/* Attributes */}
                      <div className="flex flex-wrap gap-3 mt-2">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Color:</span>{" "}
                          {orderItem.color || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Size:</span>{" "}
                          {orderItem.size || "N/A"}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Quantity:</span>{" "}
                          {orderItem.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {order.products.length > 2 && <SmartLink href={`/orders/${order._id}`} className="hover:text-gray-500">
                View All {order.products.length} Products
              </SmartLink>}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md">
                <div>
                  <p className="text-base-medium">
                    <b>Order ID</b>: #{order._id}
                  </p>
                  <p className="text-base-medium">
                    <b>IsPaid</b>: {String(order.isPaid)}
                  </p>
                  <p className="text-base-medium">
                    <b>Payment</b>: {order.method}
                  </p>
                  <p className="text-base-medium" style={{ color: getStatusColor(order.status) }}>
                    <b>Status</b>: {order.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Shipping Rate:</span>{" "}
                    {order.shippingRate || "3-9 days free delivery"}
                  </p>
                  <p className="text-base-medium">
                    <b>Total</b>: {(order.totalAmount * order.exchangeRate).toFixed()} {order.currency}
                  </p>
                </div>
                <SmartLink className="hover:text-gray-500" href={`/orders/${order._id}`}>
                  View Details
                </SmartLink>
              </div>
            </div>
          ))
        ) : (
          <p className="text-body-bold my-5">You have no orders yet.</p>
        )}
      </div>
      <PaginationControls currentPage={page} totalPages={data.totalPages} />
    </div >
  );
};

export default Orders;
