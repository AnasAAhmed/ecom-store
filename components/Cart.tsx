
"use client";

import React, { useState } from 'react';
import useCart, { useRegion } from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { Loader2, LoaderIcon, MinusCircle, PlusCircle, Trash, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import Link from 'next/link';
import { slugify } from '@/lib/utils/features';

const Cart = () => {
  const router = useRouter();
  const { user } = useUser();
  const { currency, exchangeRate } = useRegion();
  const [loading, setLoading] = useState(false);
  const [expand, setExpand] = useState(false);
  const [message, setMessage] = useState(false);
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [isCOD, setIsCOD] = useState<string>("NULL");

  const cart = useCart();
  const total = cart.cartItems.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );

  const totalRounded = total * exchangeRate;
  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };
  const handleCheckout = async () => {
    if (isCOD === "NULL") return (setMessage(true), setTimeout(() => { setMessage(false) }, 2000));
    if (isCOD === "COD") {
      if (!user) {
        return toast((t) => (
          <span>
            Please Sign-in first <b> it will help us to track your orders </b>
            <button className='bg-black text-white hover:opacity-45 py-1 px-2 mx-3 rounded-md' onClick={() => toast.dismiss(t.id)}>
              Dismiss
            </button>
            <button className='border-black hover:opacity-45 border py-1 px-2 rounded-md' onClick={() => router.push("/sign-in")}>
              Sign-in
            </button>
          </span>
        ));
      } else {
        setLoading(true)
        if (currency === 'PKR') { router.push(`/shipping`) } else { toast.error("Please select PKR currency"), setLoading(false) };
      }
    }
    if (isCOD !== "COD") {
      try {
        if (!user) {
          return toast((t) => (
            <span>
              Please Sign-in first <b> it will help us to track your orders </b>
              <button className='bg-black text-white hover:opacity-75 py-1 px-2 mx-3 rounded-md' onClick={() => toast.dismiss(t.id)}>
                Dismiss
              </button>
              <button className='border-black hover:opacity-75 border py-1 px-2 rounded-md' onClick={() => router.push("/sign-in")}>
                Sign-in
              </button>
            </span>
          ));
        }
        else {
          if (currency !== "PKR" && currency !== "USD") return toast.error(" Only USD or PKR are allowed for Online payment for now becasue this site is Demo.");
          setLoading(true)
          const res = await fetch(`/api/checkout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ cartItems: cart.cartItems, customer, currency, exchangeRate }),
          });

          if (res.ok) {
            const data = await res.json();
            window.location.href = data.url;
            console.log(data);
          } else {
            toast.error(`HTTP error! Status: ${res.statusText}`)
            console.error(`HTTP error! Status: ${res.status}`);
          }
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
        toast.error(`[checkout_POST] ${err}`)
        console.error("[checkout_POST]", err);
      }
    }
  };

  const revalidateStockBeforeCheckout = () => {
    setIsRevalidating(true);
    try {
      cart.updateStock();
      toast.success('Updating products stock');
      setTimeout(() => setIsRevalidating(false), 2000);
      setExpand(true);
    } catch (error) {
      toast.error('error updating products stock' + (error as Error).message);
      setIsRevalidating(false);
    }
  }


  return (
    <div className="flex gap-20 py-16 px-10 max-lg:flex-col max-sm:px-3">
      <div className="w-2/3 max-lg:w-full">
        <p className="text-heading3-bold">Shopping Cart</p>
        <hr className="my-6" />
        {cart.cartItems.length === 0 ? (
          <p className="text-body-bold">No item in cart</p>
        ) : (
          <div className='relative' style={{ opacity: isRevalidating ? 0.30 : 1 }}>
            {isRevalidating && <div className="absolute right-56 bg-white text-black">
              <Loader2 size={'4rem'} className='animate-spin' />
            </div>}
            {cart.cartItems.map((cartItem, i) => (
              <div key={i} className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between">
                <div className={`flex items-center ${cartItem.item.stock < 1 && 'opacity-35'}`}>
                  <Image
                    src={cartItem.item.media[0]}
                    width={100}
                    height={100}
                    className="rounded-lg w-32 h-32 object-cover"
                    alt="product"
                  />
                  <div className="flex flex-col gap-3 ml-4">
                    <Link href={`products/${slugify(cartItem.item.title)}`} className="text-body-bold line-clamp-2 max-w-[32rem]">{cartItem.item.title}</Link>

                    {cartItem.color && (
                      <p className="text-small-medium">
                        {cartItem.color && cartItem.color}
                        {cartItem.color && cartItem.size && '/'}
                        {cartItem.size && cartItem.size}</p>
                    )}

                    {cartItem.item.stock < 5 && <p className="text-small-medium">{`only ${cartItem.item.stock} left`}</p>}
                  </div>
                </div>
                <div className='flex gap-2 justify-center flex-col'>

                  <p className="flex gap-1 text-small-medium">{currency} {(cartItem.item.price * exchangeRate).toFixed()}
                    {cartItem.item.expense > 0 && <span className="line-through text-[12px] text-red-1">{currency} {cartItem.item.expense}</span>}
                  </p>
                  {cartItem.item.stock > 0 ? (
                    <div className="flex gap-4 items-center">
                      <MinusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => cart.decreaseQuantity(cartItem.item._id)}
                      />
                      <p className="text-body-bold">{cartItem.quantity}</p>
                      <PlusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => cart.increaseQuantity(cartItem.item._id)}
                      />
                    </div>
                  ) : (
                    <p className='text-red-1 text-[10px] font-semibold'>Not Available</p>
                  )}

                  <Trash
                    className="hover:text-red-1 self-center cursor-pointer"
                    onClick={() => cart.removeItem(cartItem.item._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='w-1/3 max-lg:w-full  flex flex-col gap-8 bg-grey-1 rounded-lg px-4 py-3' style={{ height: `${expand ? "26" : "12"}rem` }}>
        <p className="text-heading4-bold pb-4">
          Summary{" "}
          <span>{`(${cart.cartItems.length} ${cart.cartItems.length > 1 ? "items" : "item"})`}</span>
        </p>
        <div className="flex justify-between text-body-semibold">
          <span>Total Amount</span>
          <span>{currency} {totalRounded.toFixed()}</span>
        </div>
        {expand &&
          <div className="flex flex-col gap-4 ">
            <div className='flex flex-row justify-between items-center'>
              <p className="text-body-bold">Select Payment Method</p>
              <button onClick={() => setExpand(false)}><XCircleIcon /></button>
            </div>
            <div className="flex border rounded-lg px-3 hover:bg-gray-300 border-gray-300 items-center gap-2">
              <input
                required
                type="radio"
                name="shippingRate"
                id="COD"
                disabled={loading}
                onChange={(e) => { setIsCOD("COD"); setMessage(false) }}
              />
              <label htmlFor="COD" className="cursor-pointer flex items-center gap-2 rounded-lg py-3 px-4 w-full ">
                C.O.D (Pakistan Only)
              </label>
            </div>
            <div className="flex border rounded-lg px-3  hover:bg-gray-300 border-gray-300 items-center gap-2">
              <input
                required
                type="radio"
                name="shippingRate"
                id="ONLINE-PAYMENT"
                disabled={loading}
                onChange={(e) => { setIsCOD("ONLINE"); setMessage(false) }}
              />
              <label htmlFor="ONLINE-PAYMENT" className="cursor-pointer flex items-center gap-2  rounded-lg py-3 px-4 w-full ">

                Online Payment
              </label>
            </div>
            {message && <p className="text-small-medium text-red-1">Please Select Payment Method</p>}
            <button
              className={`border rounded-lg flex justify-center ${cart.cartItems.length === 0 && "cursor-not-allowed"} text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white`}
              onClick={handleCheckout}
              disabled={cart.cartItems.length === 0}
            >
              {loading ? <LoaderIcon className='animate-spin h-[17px]' /> : "Checkout"}
            </button>
          </div>
        }
        {!expand && <button
          className={`border rounded-lg flex justify-center ${cart.cartItems.length === 0 && "cursor-not-allowed"} text-body-bold bg-white py-3 w-full hover:bg-black hover:text-white`}
          onClick={revalidateStockBeforeCheckout}
          disabled={cart.cartItems.length === 0 || totalRounded < 1}
        >
          Proceed
        </button>}
      </div>
    </div>
  );
};

export default Cart;

