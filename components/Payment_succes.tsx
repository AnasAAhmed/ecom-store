'use client'
import useCart from '@/lib/hooks/useCart';
import SmartLink from "@/components/SmartLink";
import React, { useEffect } from 'react'

const Payment_succes = () => {
    const cart = useCart();

    useEffect(() => {
        cart.clearCart();
    }, []);

    return (
        <div className="h-screen flex flex-col justify-center items-center gap-5">
            <p className="text-heading4-bold text-red-1">Payment Successful</p>
            <p>Thank you for your purchase</p>
            <SmartLink
            title='Go to shop'
                href="/search"
                prefetch={false}
                className="p-4 border rounded-md text-base-bold hover:bg-black hover:text-white"
            >
                CONTINUE TO SHOPPING
            </SmartLink>
            <a
                href="/orders"
                title='View your orders'
                className="p-4 rounded-md border text-base-bold hover:bg-black hover:text-white"
            >
                Check Order
            </a>
        </div>
    );
};

export default Payment_succes
