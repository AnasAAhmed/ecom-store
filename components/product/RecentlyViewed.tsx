'use client'

import React, { useEffect, useState } from 'react'
import SliderList from './SliderList';
import { getRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';

const RecentlyViewed = ({ heading, text }: { heading?: string; text?: string }) => {
    const [loading2, setLoading2] = useState(true);
    const [products, setProducts] = useState<ProductType[] | []>([]);

    useEffect(() => {
        const ss = async () => {
            setLoading2(true);
            const data = getRecentlyViewed();

            if (!data) {
                // no content → no RecentlyViewed
                setProducts([]);
                setLoading2(false);
                return;
            }

            setProducts(data);
            setLoading2(false);
        };
        ss();
    }, [])

    if (loading2) return null;

    if (!products.length) return null;

    return (
        <SliderList heading={heading || 'Recently Viewed'}
            text={text || "Personalized picks based on your browsing"}
            Products={products}
        />
    )
}

export default RecentlyViewed;
