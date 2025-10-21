'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef } from 'react'
import SmartLink from '../SmartLink';
import FadeInOnView from '../FadeInView';
import ProductCardCsr from './ProductCardCsr';

const SliderList = ({ Products, heading, text, isViewAll = true }: { isFyp?: boolean; text?: string; Products: ProductType[], heading?: string; isViewAll?: boolean }) => {

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
                <p className="max-sm:mx-2 sm:text-body-semibold text-gray-600 text-center mb-8 text-small-medium capitalize">{text}</p>
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

                {Products.map((product: ProductType, i) => (
                    <ProductCardCsr index={i} key={product._id} product={product} />
                ))}

            </div>

            <button
                aria-label="Scroll Right"
                onClick={() => scroll('right')}
                className="hidsd:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100"
            >
                <ChevronRight />
            </button>
            {Products.length > 4 && isViewAll && <div className="self-stretch mt-8 flex flex-row items-start justify-center py-[0rem] px-[1.25rem]">
                <div className="w-[12.875rem] flex flex-col items-start justify-start ">
                    <FadeInOnView delay={300} threshold={0.5} animation="animate-fadeIn">
                        <SmartLink prefetch={false} title=" View All Products" href="/search" className="h-[1.875rem] mx-auto relative font-medium inline-block z-[1] text-heading4-bold">
                            View All Products
                        </SmartLink>
                        <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pr-[0.187rem] pl-[0.375rem]">
                            <div className="h-[0.125rem] flex-1 relative box-border z-[1] border-t-[2px] border-solid border-black" />
                        </div>
                    </FadeInOnView>
                </div>
            </div>}
        </div>
    )
}

export default SliderList
