'use client'

import React, { useEffect, useState } from 'react'
import SliderList from './SliderList';

const FYProdcutList = ({ heading, text }: { heading?: string; text?: string }) => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => {
        const ss = async () => {
            setLoading(true);
            const res = await fetch('/api/products/for-you', {
                method: 'GET',

            })

            if (!res.ok) {
                setError(res.statusText || "Something went wrong with FYP Products");
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (!data) {
                // no content → no FYP
                setProducts([]);
                setLoading(false);
                return;
            }

            setProducts(data);
            setLoading(false);
        };
        ss();
    }, [])

    if (loading) return null;

    if (error) {
        console.warn('FYP Prodcuts:', error);
        return null;
    }
    if (!products?.length) return null;

    return (
        <SliderList heading={heading || 'You may also like'}
            text={text || "Personalized picks based on your browsing"}
            Products={products}
        />
    )
}

export default FYProdcutList
