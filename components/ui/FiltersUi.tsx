'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import SmartLink from '../SmartLink';

export default function FilterBadges({ isCollection = false }: { isCollection?: boolean }) {
    const router = useRouter();
    const params = useParams<{ collection: string }>()
    const searchParams = useSearchParams();

    // Convert searchParams to a plain object
    const paramsObj = Object.fromEntries(searchParams.entries());

    const filters = Object.entries(paramsObj);

    if (filters.length === 0) return null;

    const handleRemove = (key: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.delete(key);
        const newQuery = newParams.toString();
        router.push(`/search${newQuery ? `?${newQuery}` : ''}`);
    };


    return (
        <div className="mb-4">
            <p className="text-sm md:text-base font-semibold mb-2">
                Active Filters:
            </p>
            <div className="flex flex-wrap gap-2">
                {filters.map(([key, value]) => (
                    <span
                        key={key}
                        className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                        {key}: <strong>{value}</strong>
                        <button
                            onClick={() => handleRemove(key)}
                            className="text-blue-500 hover:text-blue-700"
                            aria-label={`Remove ${key}`}
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <SmartLink
                    href={isCollection?`/collections/${params?.collection}`:"/search"}
                    className="text-xs text-gray-600 underline hover:text-gray-800 ml-2"
                >
                    Clear all ×
                </SmartLink>
            </div>
        </div>
    );
}
