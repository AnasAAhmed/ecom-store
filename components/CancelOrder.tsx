'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type OrderManageProps = {
  order: OrderType;
};

const CancelOrder = ({ order }: OrderManageProps) => {
  const [loadingUp, setLoadingUp] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const router = useRouter()

  useEffect(() => {
    setNewStatus(order.status);
  }, [order._id])

  const handleSubmit = async () => {
    if (!newStatus) return;

    try {
      setLoadingUp(true);
      const res = await fetch(`/api/order/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: `Canceled: ${newStatus}` }),
      });

      if (res.ok) {
        setLoadingUp(false);
        router.refresh();
        toast.success('Order Canceled successfully we will Contact you in an hour');
      } else {
        const errorResponse = await res.json();
        setLoadingUp(false);
        throw new Error((errorResponse||res.statusText) || 'Failed to Cancel order')
      }
    } catch (err) {
      setLoadingUp(false);
      console.error('Error updating order status:', err);
      toast.error((err as Error).message);
    }
  };
  function getStatusColor(status: string): string {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes("pending")) return "#d97706";
    if (lowerStatus.includes("shipped") || lowerStatus.includes("processing")) return "#2563eb";
    if (lowerStatus.includes("delivered")) return "#16a34a";
    if (lowerStatus.includes("canceled") || lowerStatus.includes("cancelled")) return "#dc2626";
    if (lowerStatus.includes("refunded")) return "#7c3aed";

    return "#374151";
  }
  const cancellationReasons = [
    "Found a better price elsewhere",
    "Changed my mind",
    "Item is no longer needed",
    "Ordered by mistake",
    "Shipping time was too long",
    "Prefer a different product",
    order.method !== "COD" ? "Issues with payment" : '',
    "Concerns about product quality",
    "Other"
  ];
  const orderCreationTime = new Date(order.createdAt).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - orderCreationTime) / (1000 * 60 * 60);
  return (
    <div className="w-full sm:mt-24 mt-12 mx-auto max-w-4xl px-4 sm:px-6 py-6 space-y-8 font-sans">

      <button
        className="print:hidden flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        onClick={() => router.back()}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </button>

      {/* Order Info */}
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <p>
            <span className="font-medium text-gray-600">Order ID:</span>{' '}
            <span className="text-gray-900">{order._id}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Placed on:</span>{' '}
            <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Customer Email:</span>{' '}
            <span className="text-gray-900">{order.customerEmail}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Phone:</span>{' '}
            <span className="text-gray-900">{order.customerPhone}</span>
          </p>
          <p className="sm:col-span-2">
            <span className="font-medium text-gray-600">Shipping Address:</span>{' '}
            <span className="text-gray-900 block">
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state},{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              <br />
              Phone: {order.shippingAddress.phone || 'N/A'}
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Exchange Rate:</span>{' '}
            <span className="text-gray-900">{order.exchangeRate}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Payment Method:</span>{' '}
            <span className="text-gray-900">{order.method.toUpperCase()}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Currency:</span>{' '}
            <span className="text-gray-900">{order.currency}</span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Total {!order.status.startsWith('COD') && 'Paid'}:</span>{' '}
            <span className="text-gray-900">
              ${order.totalAmount} ({order.exchangeRate} x {order.totalAmount} ={' '}
              {(order.totalAmount * order.exchangeRate).toFixed(2)} {order.currency})
            </span>
          </p>
          <p>
            <span className="font-medium text-gray-600">Shipping Rate:</span>{' '}
            <span className="text-gray-900">
              ({order.currency}) {order.shippingRate}
            </span>
          </p>
          <p
            className='font-semibold'
            style={{ color: getStatusColor(order.status) }}
          >
            <span className="font-medium text-gray-600">Status:</span> {order.status}
          </p>
          <p>
            <span className="font-medium text-gray-600">Products:</span>{' '}
            <span className="text-gray-900">{order.products.length}</span>
          </p>
          <div className="bg-white sm:col-span-2 print:hidden p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status History</h2>
            <div className="relative pl-6">
              <div className="absolute top-0 left-2 w-0.5 h-full bg-gray-200"></div>
              {order.statusHistory.map((statusItem, index) => (
                <div key={statusItem._id} className="relative flex items-start gap-4 mb-6 last:mb-0">

                  <div style={{ backgroundColor: getStatusColor(statusItem.status) }} className="absolute left-0 w-4 h-4 rounded-full border-2 "></div>
                  <div className="pl-6">
                    <p className={`text-sm font-medium ${statusItem.status.includes('Canceled') ? 'text-red-600' : 'text-gray-900'}`}>
                      {statusItem.status}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(statusItem.changedAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="min-w-full text-sm text-gray-900">
          <thead className="bg-gray-50 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="p-4 border-b">Image</th>
              <th className="p-4 border-b">Product</th>
              <th className="p-4 border-b">Size</th>
              <th className="p-4 border-b">Color</th>
              <th className="p-4 border-b">Quantity</th>
              <th className="p-4 border-b">Price (USD)</th>
              <th className="p-4 border-b">Exchange Rate</th>
              <th className="p-4 border-b">Price ({order.currency})</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors border-b last:border-b-0">
                <td className="p-4 w-24">
                  {item.product?.media?.[0] ? (
                    <img
                      src={item.product.media[0]}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-md border border-gray-100"
                    />
                  ) : (
                    <div className="text-xs text-red-500">Image not available</div>
                  )}
                </td>
                <td className="p-4 font-medium">
                  {item.product?.title || <span className="text-red-500">Product deleted</span>}
                </td>
                <td className="p-4">{item.size || 'N/A'}</td>
                <td className="p-4">{item.color || 'N/A'}</td>
                <td className="p-4">{item.quantity}</td>
                <td className="p-4">{item.product ? `$${item.product.price}` : '-'}</td>
                <td className="p-4">{order.exchangeRate}</td>
                <td className="p-4">
                  {item.product ? `${(item.product.price * order.exchangeRate).toFixed(2)}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancel Order (Conditional) */}
      {!order.status.startsWith('canceled') && timeDifference <= 2 && (
        <div className="flex items-center gap-4 print:hidden bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <label htmlFor="Cancel" className="text-sm font-medium text-gray-600">
            Cancel Order:
          </label>
          <select
            id="Cancel"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="">Select a reason</option>
            {cancellationReasons.map((reason) => (
              <option key={reason} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          {newStatus !== order.status && (
            <button
              title="Confirm Order Cancellation"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              onClick={handleSubmit}
            >
              {loadingUp ? (
                <LoaderIcon className="mx-[7px] animate-spin" />
              ) : (
                'Confirm'
              )}
            </button>
          )}
        </div>
      )}

      {/* Print Button */}
      <button
        title="Get Invoice"
        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-md text-sm font-medium transition-colors print:hidden"
        onClick={() => window.print()}
      >
        Get Invoice
      </button>
    </div>

    // </Modal> 
  );
};



export default CancelOrder;