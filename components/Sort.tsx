'use client'
import { useProgressStore } from '@/lib/hooks/useProgressBar';
import { updateCategories } from '@/lib/hooks/useUserPrefrence';
import { Filter, Loader, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent, useEffect, useState } from 'react'

interface SortData {
    categories: string[];
    variantSizes: string[];
    variantColors: string[];
}

const Sort = ({ isCollectionPage = false }: { isCollectionPage?: boolean }) => {
    const router = useRouter();
    const start = useProgressStore((state) => state.start);
    const [query, setQuery] = useState('');
    const [sort, setSort] = useState('');
    const [sortField, setSortField] = useState('');
    const [category, setCategory] = useState('');
    const [color, setColor] = useState('');
    const [size, setSize] = useState('');
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    const [filters, setFilters] = useState<SortData>({
        categories: ['shirt', 'shoe', 'console', 'hat', 'pants'],
        variantSizes: ['s', 'm', 'l', 'xl', 'xxl'],
        variantColors: ['white', 'black', 'blue', 'red', 'green', 'yellow'],
    });
    const [loading, setLoading] = useState(true);

    const queryParam = params.get('query') || '';
    const sortParam = params.get('sort') || '';
    const sortFieldParam = params.get('sortField') || '';
    const categoryParam = params.get('category') || '';
    const sizeParam = params.get('size') || '';
    const colorParam = params.get('color') || '';

    useEffect(() => {
        setQuery(queryParam)
        setSort(sortParam)
        setSortField(sortFieldParam)
        setCategory(categoryParam)
        setSize(sizeParam)
        setColor(colorParam)
    }, [queryParam,categoryParam,colorParam,sizeParam,sortFieldParam,sortParam]);

    useEffect(() => {
        const fetchSortData = async () => {
            try {
                const res = await fetch('/api/search/sort-data');
                const data = await res.json();
                console.log(data);

                if (data.success) {
                    setFilters((prev) => ({
                        ...prev,
                        ...data.data,
                    }));
                }
            } catch (err) {
                console.error('Error fetching sort data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSortData();
    }, []);

    const handleSelectChange = (
        key: string,
        value: string,
        persistCategory = false
    ) => {
        start();
        const searchParams = new URLSearchParams(window.location.search);

        if (!value) {
            searchParams.delete(key);
        } else {
            searchParams.set(key, value);
        }

        if (persistCategory && value) updateCategories(value);

        const newUrl = `?${searchParams.toString()}`;
        router.push(newUrl, { scroll: true });
    };

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        start();
        const page = params.get("page");
        if (page) params.delete("page");
        router.push(`/search?query=${query}`);
    };


    return (
        <>
            {!isCollectionPage && <h1 className='text-[20px] self-center font-serif font-medium text-center sm:text-[30px]'>Search Our Site</h1>}
            {!isCollectionPage && <div className="px-2 sm:px-3 py-2 flex">
                <form onSubmit={(e) => handleSearch(e)} className="flex sm:shidden w-full items-center border rounded-lg px-4 py-1">
                    <input
                        list="pp"
                        className="outline-none w-full bg-transparent"
                        placeholder="Search..."
                        value={query}
                        type="search"

                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <datalist id="pp">
                        <option value="Gray sneakers with dense surface">Gray sneakers with dense surface</option>
                        <option value="Casual dark gray tshirt">Casual dark gray tshirt</option>
                        <option value="Casual white T shirt">Casual white T shirt</option>
                        <option value="Sony PS5 Console">Sony PS5 Console</option>
                        <option value="Trendycasual sneaker-Light weight fashion sheos white">Trendycasual sneaker-Light weight fashion sheos white</option>
                        <option value="Rain Jacket Women Windbreaker Striped Climbing">Rain Jacket Women Windbreaker Striped Climbing</option>
                        <option value="BIYLACLESEN Women 3 in 1 Snowboard Jacket Winter Coats">BIYLACLESEN Women 3 in 1 Snowboard Jacket Winter Coats</option>
                    </datalist>
                    <button title="Confirm Search" type="submit"><Search className="cursor-pointer h-4 w-4 hover:text-blue-500" /></button>
                </form>
            </div>}
            <details open={true} className="px-2 sm:px-4">
                <summary className="flex gap-1 w-24 items-center mb-3 cursor-pointer">
                    Filters <Filter size={'1rem'} />
                </summary>

                <div className="flex gap-2 sm:gap-3 mb-8 flex-wrap justify-center items-center">
                    {/* Sort */}
                    <select
                        className="h-10 px-3 bg-gray-100 rounded-lg"
                        value={sort}
                        onChange={(e) =>
                            handleSelectChange('field', e.target.value.split('|')[0])
                        }
                    >
                        <option value="">Sort</option>
                        <option value="price|asc">Price (Low to High)</option>
                        <option value="price|desc">Price (High to Low)</option>
                        <option value="sold|desc">Best-Selling</option>
                        <option value="createdAt|desc">Latest</option>
                        <option value="ratings|desc">Most-Rated</option>
                        <option value="ratings|asc">Less-Rated</option>
                    </select>

                    {/* Sizes */}
                    <select
                        className="h-10 px-3 bg-gray-100 rounded-lg"
                        onChange={(e) => handleSelectChange('size', e.target.value)}
                        value={size}
                    >
                        <option value="">Sizes</option>
                        {filters.variantSizes.map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                        {loading && <option value="" className='text-[9px] sm:text-[12px]'>Loading More...</option>}

                    </select>

                    {/* Colors */}
                    <select
                        className="h-10 px-3 bg-gray-100 rounded-lg"
                        value={color}
                        onChange={(e) => handleSelectChange('color', e.target.value)}
                    >
                        <option value="">Colors</option>
                        {filters.variantColors.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                        {loading && <option value="" className='text-[9px] sm:text-[12px]'>Loading More...</option>}

                    </select>

                    {/* Categories (not for collection page) */}
                    {!isCollectionPage && (
                        <select
                            className="h-10 px-3 bg-gray-100 rounded-lg"
                            onChange={(e) =>
                                handleSelectChange('category', e.target.value, true)
                            }
                            value={category}
                        >
                            <option value="">Category</option>
                            {filters.categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                            {loading && <option value="" className='text-[9px] sm:text-[12px]'>Loading More...</option>}

                        </select>
                    )}
                </div>
            </details>
        </>
    )
}

export default Sort
