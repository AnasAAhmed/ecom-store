'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

const Sort = () => {
    const router = useRouter();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, order] = e.target.value.split("|");
        if (!field && !order) return router.push(`/search`);
        const newUrl = `?field=${field}&order=${order}`;
        router.push(newUrl, { scroll: true });
    };
    return (
        <select
            className="h-10 px-3 my-4 bg-gray-100 rounded-lg"
            // value={`${sortField}|${sort}`}
            onChange={handleSortChange}
        >
            <option value="">Sort</option>
            <option value="price|asc">Price (Low to High)</option>
            <option value="price|desc">Price (High to Low)</option>
            <option value="sold|desc">Best-Selling</option>
            <option value="createdAt|desc">Latest</option>
            <option value="ratings|desc">Most-Rated</option>
            <option value="ratings|asc">Less-Rated</option>
        </select>
    )
}

export default Sort
