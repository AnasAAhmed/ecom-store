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

            if (res.status === 204) {
                // no content → no FYP
                setProducts([]);
                setLoading2(false);
                return;
            }

            if (!res.ok) {
                setError(res.statusText || "Something went wrong with FYP Products");
                setLoading2(false);
                return;
            }

            const data = await res.json();
            setProducts(data);
            setLoading2(false);
        };
        ss();
    }, [])

    if (loading2) return null;

    if (error) {
        console.warn('FYP Prodcuts:', error);
        return null;
    }
    if (!products.length) return null;

    return (
        <SliderList heading={heading || 'You would also like'}
            text={text || "Personalized picks based on your browsing"}
            Products={products}
        />
    )
}

export default FYProdcutList
