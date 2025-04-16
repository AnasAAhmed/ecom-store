'use client';

import { ArrowLeftIcon, LoaderIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useCart, { useRegion } from '@/lib/hooks/useCart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

const shippingSchema = z.object({
    street: z.string().min(15, "Street address must be at least 15 characters"),
    city: z.string().min(4, "City must be at least 4 characters"),
    state: z.string().min(5, "State must be at least 5 characters"),
    postalCode: z.string().min(5, "Postal Code is required and must be at least 5 digits"),
    phone: z.string().min(11, "Phone must be at least 11 digits"),
    country: z.string().min(8, "Country is required"),
    shippingRate: z.enum(['Fast (COD)', 'Standard (COD)']),
});

const ShippingForm = ({ user }: { user: { id: string, email: string, image: string } | null }) => {
    const cart = useCart();
    const { currency, exchangeRate } = useRegion();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [shippingRateNumber, setShippingRateNumber] = useState<number>(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(shippingSchema),
    });

    if (!cart.cartItems.length || !user) return null;

    // Calculate the total cost
    const total = cart.cartItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
    const totalShippingRate = total + shippingRateNumber;
    const totalAmount = (totalShippingRate * exchangeRate).toFixed();

    const customerInfo = {
        id: user!.id,
        email: user!.email,
    };

    const submitHandler = async (data: any) => {
        const { street, city, state, postalCode, phone, country, shippingRate } = data;

        if (currency !== 'PKR') return toast.error('Please select PKR Currency');
        setIsProcessing(true);

        const shippingAddress = { street, city, state, postalCode, phone, country };
        const orderData = {
            shippingAddress,
            products: cart.cartItems.map((item) => ({
                product: item.item._id,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                variantId: item.variantId,
            })),
            totalAmount,
            shippingRate: `${shippingRate} (${(shippingRateNumber * exchangeRate).toFixed()})`,
            exchangeRate,
            currency,
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderData, customerInfo }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                // toast.error(errorResponse.message || 'Failed to place order');
                throw new Error(errorResponse.message || 'Failed to place order')
            } else {
                toast.success('Order Placed Successfully');
                router.push('/payment_success');
            }
        } catch (err) {
            toast.error('An error occurred: '+ (err as Error).message );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="px-4 py-8 sm:px-24">
            <Link title='back to cart' aria-label='back to cart' href="/cart" className="back-btn">
                <ArrowLeftIcon />
            </Link>
            <form onSubmit={handleSubmit(submitHandler)}>
                <h1 className="text-2xl font-semibold mb-8 text-center">Shipping Address</h1>

                {/* Address Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {['street', 'city', 'state', 'postalCode', 'phone'].map((field) => (
                        <div key={field}>
                            <input
                                {...register(field)}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                            />
                            {errors[field] && <span className="text-red-500">{(errors[field]?.message as string)}</span>}
                        </div>
                    ))}
                    <div>
                        <select
                            {...register('country')}
                            className="border border-gray-300 rounded-lg py-3 px-4 w-full focus:outline-none text-lg"
                        >
                            <option value="Pakistan">Pakistan</option>
                        </select>
                        {errors.country && <span className="text-red-500">{(errors.country?.message as string)}</span>}
                    </div>
                </div>

                {/* Shipping Rate Radios */}
                <div className="flex flex-col gap-4 mb-8">
                    {['Fast (COD)', 'Standard (COD)'].map((rate) => (
                        <div key={rate} className="relative flex border rounded-lg px-3 hover:bg-gray-300 items-center gap-2">
                            <input
                                {...register('shippingRate')}
                                type="radio"
                                id={rate}
                                value={rate}
                                onChange={() => setShippingRateNumber(rate === 'Fast (COD)' ? 4 : 1)}
                            />
                            <label htmlFor={rate} className="cursor-pointer flex items-center gap-2 py-3 px-4 w-full">
                                {rate} delivery ({currency} {(rate === 'Fast (COD)' ? 4 : 1) * exchangeRate})
                            </label>
                        </div>
                    ))}
                    {errors.shippingRate && <span className="text-red-500">{(errors.shippingRate?.message as string)}</span>}
                </div>

                {/* Summary */}
                <h1 className="text-2xl font-semibold mb-4 text-center">Summary</h1>
                <div className="border p-4 rounded-lg mb-8">
                    <ul className="mb-4">
                        {cart.cartItems.map((item, index) => (
                            <li key={index} className="flex items-center gap-4 mb-2">
                                <img src={item.item.media[0]} alt={item.item.title} className="h-14 w-14 sm:h-24 sm:w-24" />
                                <div>
                                    <span>{item.item.title}</span>
                                    <p>Size: {item.size || 'N/A'} | Color: {item.color || 'N/A'}</p>
                                    <p>Quantity: {item.quantity}</p>
                                </div>
                                <span>{currency} {(item.item.price * item.quantity * exchangeRate).toFixed()}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between">
                        <span>Shipping Rate (C.O.D):</span>
                        <span>{currency} {(shippingRateNumber * exchangeRate).toFixed()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Total Amount:</span>
                        <span>{currency} {totalAmount}</span>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    title='Confirm Place Order'
                    className="flex items-center justify-center rounded-lg transition-all duration-200 text-lg text-white bg-black py-3 w-full hover:bg-gray-200 hover:text-black"
                >
                    {isProcessing ? <LoaderIcon className="animate-spin" /> : `Place Order for ${currency} ${totalAmount}`}
                </button>
            </form>
        </div>
    );
};


export default ShippingForm
