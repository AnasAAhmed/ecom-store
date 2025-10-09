'use client'

import React, { useEffect, useState } from 'react'
import SliderList from './SliderList';

const FYProdcutList = ({ heading, text }: { heading?: string; text?: string }) => {
    const [loading2, setLoading2] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        const ss = async () => {
            setLoading2(true);
            const res = await fetch('/api/products/for-you', {
                method: 'GET',

            })
            if (!res.ok) {
                setError(res.statusText || 'Something Went wrong with FYP Products');
                setLoading2(false);
                return;
            }
            const data = await res.json();
            setProducts(data);
            setLoading2(false);
        };
        ss();
    }, [])

    if (loading2) return (<div className="flex flex-col items-centers w-full mt-6 mb-12">
        <div className='h-7 w-36 self-center text-center bg-gray-200 mb-3 animate-pulse' />
        <div className='h-7 w-96 self-center text-center bg-gray-200 mb-7 animate-pulse' />
        <div className="flex gap-4 sm:gap-6 overflow-x-scroll no-scrollbar px-4 sm:px-14 snap-x snap-mandatory scroll-smooth">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 h-[22rem] w-64 bg-gray-200 animate-pulse" />

            ))}
        </div>
    </div>)

    if (error) return <p className='text-heading3-bold self-center text-center my-12'>{error}</p>;

    return (
        <SliderList heading={heading || 'You would also like'}
            text={text || "Personalized picks based on your browsing"}
            Products={products}
        />
    )
}

export default FYProdcutList
