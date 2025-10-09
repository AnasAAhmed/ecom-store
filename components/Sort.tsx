'use client'
import { useProgressStore } from '@/lib/hooks/useProgressBar';
import { updateCategories } from '@/lib/hooks/useUserPrefrence';
import { useRouter } from 'next/navigation';
import React from 'react'

const Sort = ({ isCollectionPage = false }: { isCollectionPage?: boolean }) => {
    const router = useRouter();
      const start = useProgressStore((state) => state.start);
    
    // const searchParams = new URLSearchParams(window.location.search);
    // searchParams.set('page', newPage.toString());
    // const newUrl = `?${searchParams.toString()}`;
    // router.push(newUrl, { scroll: isScrollToTop });
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        start();
        const searchParams = new URLSearchParams(window.location.search);
        const [field, order] = e.target.value.split("|");
        if (!field || !order) {
            searchParams.delete('field');
            searchParams.delete('order');
            const newUrl = `?${searchParams.toString()}`;
            router.push(newUrl, { scroll: true });
        } else {
            searchParams.set('field', field.toString());
            searchParams.set('order', order.toString());
            const newUrl = `?${searchParams.toString()}`;
            router.push(newUrl, { scroll: true });
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        start();

        const searchParams = new URLSearchParams(window.location.search);
        const category = e.target.value;
        if (category === '') {
            searchParams.delete('category');
            const newUrl = `?${searchParams.toString()}`;
            router.push(newUrl, { scroll: true });
        } else {
            searchParams.set('category', category.toString());
            const newUrl = `?${searchParams.toString()}`;
            updateCategories(category);
            router.push(newUrl, { scroll: true });
        }
    };
    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        start();

        const searchParams = new URLSearchParams(window.location.search);
        const size = e.target.value;
        if (size === '') {
            searchParams.delete('size');
            const newUrl = `?${searchParams.toString()}`;
            router.push(newUrl, { scroll: true });
        } else {
            searchParams.set('size', size.toString());
            const newUrl = `?${searchParams.toString()}`;
            router.push(newUrl, { scroll: true });
        }
    };
    const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        start();

        const searchParams = new URLSearchParams(window.location.search);
        const color = e.target.value;
        if (color === '') {
            searchParams.delete('color');
            const newUrl = `?${searchParams.toString()}`;
            router.push(newUrl, { scroll: true });
        } else {
            searchParams.set('color', color.toString());
            const newUrl = `?${searchParams.toString()}`;
            router.push(newUrl, { scroll: true });
        }
    };
    return (
        <div className='flex gap-3 mb-8 flex-wrap items-center'>
            <select
                className="h-10 px-3 sm:msb-4 mr-2 bg-gray-100 rounded-lg"
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
                <option value="">None</option>
            </select>
            <select
                className="h-10 px-3 mr-2 bg-gray-100 rounded-lg"
                onChange={handleSizeChange}
            >
                <option value="">Sizes</option>
                <option value="s">Small</option>
                <option value="m">Medium</option>
                <option value="l">Large</option>
                <option value="xl">Extra Large</option>
                <option value="xxl">XxL</option>
                <option value="">None</option>

            </select>
            <select
                className="h-10 px-3 bg-gray-100 rounded-lg"
                onChange={handleColorChange}
            >
                <option value="">Colors</option>
                <option value="white">white</option>
                <option value="blue">blue</option>
                <option value="red">red</option>
                <option value="yellow">yellow</option>
                <option value="black">black</option>
                <option value="green">green</option>
                <option value="">None</option>
            </select>
            <select
                className="h-10 px-3 my-4 bg-gray-100 rounded-lg"
                // value={`${sortField}|${sort}`}
                onChange={handleCategoryChange}
            >
                <option value="">Select Category</option>
                <option value="shirt">shirt</option>
                <option value="shoe">shoe</option>
                <option value="console">console</option>
                <option value="hat">hat</option>
                <option value="pants">pants</option>
                <option value="">None</option>
            </select>
        </div>
    )
}

export default Sort
