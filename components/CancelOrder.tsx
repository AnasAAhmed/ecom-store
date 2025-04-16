'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LoaderIcon } from 'lucide-react';
import Modal from './ui/Modal';
import { useRouter } from 'next/navigation';

type OrderManageProps = {
  order: OrderType;
};

const CancelOrder = ({ order }: OrderManageProps) => {
  const [loadingUp, setLoadingUp] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter()
  const onClose = () => setIsOpen(false);

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
        onClose()
        toast.success('Order Canceled successfully we will Contact you in an hour');
      } else {
        const errorResponse = await res.json();
        throw new Error(errorResponse.message || 'Failed to place order')
        setLoadingUp(false);
      }
    } catch (err) {
      setLoadingUp(false);
      console.error('Error updating order status:', err);
      toast.error('Internal server error: ' + (err as Error).message + ' Please try again.');
    }
  };

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
    <>
      <button title='See Details' onClick={() => setIsOpen(true)}> <b> Details</b> &rarr;</button>
      <Modal onClose={onClose} isOpen={isOpen} overLay={true}>
        <div className=" animate-modal flex flex-col justify-center overflow-y-auto items-center space-y-4 bg-gray-100 pb-4 px-4 rounded shadow-md">
          <button title='Close order detail modal' aria-label='Close order detail modal' className='print:hidden text-[26px] self-end mt-3' onClick={() => setIsOpen(false)}>&times;</button>

          <div className="flex flex-wrap gap-3 items-center pb-3">
            <div className="flex flex-col pb-10 px-10 gap-3">
              <p className="text-base-bold">
                Order ID: <span className="text-base-medium">{order._id}</span>
              </p>
              <p className="text-base-bold">
                Placed order on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-base-bold">
                Customer's Email: {order.customerEmail}
              </p>
              <p className="text-base-bold">
                Shipping address: <span className="text-base-medium leading-8">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}, phone:{order.shippingAddress.phone || "null"}</span>
              </p>
              <p className="text-base-bold">
                Exchange Rate: {order.exchangeRate}
              </p>
              <p className="text-base-bold">
                Currency: <span className="text-base-medium">{order.currency}</span>
              </p>
              <p className="text-base-bold">
                Total {!order.status.startsWith('COD') && 'Paid'}: <span className="text-base-medium">${order.totalAmount} ({order.exchangeRate} x {order.totalAmount} = {order.totalAmount * order.exchangeRate}{order.currency})</span>
              </p>
              <p className="text-base-bold">
                Shipping rate: <span className="text-base-medium">({order.currency}) {order.shippingRate}</span>
              </p>
              <p className="text-base-bold"
                style={{ color: order.status.startsWith('Canceled') ? 'red' : '' }}>
                Status: {order.status}
              </p>
              <p className="text-base-bold">
                Products: <span className="text-base-medium">{order.products.length}</span>
              </p>
              <table>
                <thead className='border'>
                  <th className='border'>Product</th>
                  <th className='border'>size</th>
                  <th className='border'>color</th>
                  <th className='border'>quantity</th>
                  <th className='border'>price in usd</th>
                  <th className='border'>exchange rate in ({order.currency})</th>
                  <th className='border'>price in ({order.currency})</th>
                </thead>
                {order.products.map((i) => (
                  <tbody className='border'>
                    {i.product ? <>
                      <th className='border'>{i.product.title}</th>
                      <th className='border'>{i.size || 'N/A'}</th>
                      <th className='border'>{i.color || 'N/A'}</th>
                      <th className='border'>{i.quantity}</th>
                      <th className='border'>${i.product.price} </th>
                      <th className='border'>{order.exchangeRate}</th>
                      <th className='border'>{i.product.price * order.exchangeRate}</th>
                    </>
                      : <>
                        <th className='border'> This product has been deleted from the website.</th>
                        <th className='border'>{i.size || 'N/A'}</th>
                        <th className='border'>{i.color || 'N/A'}</th>
                        <th className='border'>{i.quantity}</th>
                        <th className='border'> This product has been deleted from the website.</th>
                        <th className='border'>{order.exchangeRate}</th>
                        <th className='border'> This product has been deleted from the website.</th>
                      </>}
                  </tbody>
                ))}
              </table>
            </div>
          </div>
          {!order.status.startsWith('Canceled') && timeDifference <= 2 && (
            <div className='mx-auto print:hidden items-center flex gap-3'>
              <label htmlFor='Cancel'>Cancel Order:</label>
              <select id='Cancel' className='h-8' value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value={''}>Select a reason</option>
                {cancellationReasons.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              {newStatus !== order.status && (
                <button title='Confirm Order Cancelation' className="bg-blue-500 rounded-md p-3 hover:opacity-55 text-white" onClick={() => handleSubmit()}>
                  {loadingUp ? <LoaderIcon className='mx-[7px] animate-spin' /> : "Confirm"}
                </button>
              )}
            </div>
          )}
          <button title='Get Invoice' className='text-lg bg-black print:hidden text-white rounded-md p-2 self-start' onClick={() => window.print()}>Get Invoice</button>

        </div>
      </Modal>
    </>
  );
};



export default CancelOrder;