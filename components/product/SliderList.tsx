'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef } from 'react'
import SmartLink from '../SmartLink';
import Image from 'next/image';
import ProductCard from './ProductCard';

const SliderList = ({ Products, heading, text, isViewAll = true }: { text?: string; Products: ProductType[], heading?: string; isViewAll?: boolean }) => {

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -300 : 300,
                behavior: 'smooth',
            });
        }
    };
    return (
        <div className="relative w-full mt-6 mb-12">
            {heading &&
                <h1 className="text-heading3-bold text-center mt-8 mb-4 sm:text-heading2-bold capitalize">{heading}</h1>
            }
            {text &&
                <p className="text-body-semibold text-gray-600 text-center mb-8 sm:text-base-medium capitalize">{text}</p>
            }
            <button
                aria-label="Scroll Left"
                onClick={() => scroll('left')}
                className="hidsd:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100"
            >
                <ChevronLeft />
            </button>

            <div
                ref={scrollRef}
                className="flex  gap-4 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-14 snap-x snap-mandatory scroll-smooth"
            >
                {Products.map((product: ProductType) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>

            <button
                aria-label="Scroll Right"
                onClick={() => scroll('right')}
                className="hidsd:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100"
            >
                <ChevronRight />
            </button>
        </div>
    )
}

export default SliderList
