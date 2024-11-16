"use client"

import useCart from "@/lib/hooks/useCart";
import Link from "next/link";
import { useEffect } from "react";

const Succes = () => {
  const cart = useCart();

  useEffect(() => {
    cart.clearCart();
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5">
      <p className="text-heading4-bold text-red-1">Payment Successful</p>
      <p>Thank you for your purchase</p>
      <Link
        href="/search"
        className="p-4 border rounded-md text-base-bold hover:bg-black hover:text-white"
      >
        CONTINUE TO SHOPPING
      </Link> 
      <a
        href="/orders"
        className="p-4 rounded-md border text-base-bold hover:bg-black hover:text-white"
      >
        Check Order
      </a>
    </div>
  );
};

export default Succes;
