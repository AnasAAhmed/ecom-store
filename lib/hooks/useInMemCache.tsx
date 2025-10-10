import { useEffect, useState } from "react";

type CacheEntry<T> = {
    data: T;
    expiry: number;
};

const cache: Record<string, CacheEntry<any>> = {};

/**
 * useCachedFetch
 * - caches responses in memory
 * - invalidates after `staleSeconds` (secs)
 */
export function useInMemCache<T>(
    url: string,
    staleSeconds = 120 // default: 2 minutes
) {
    const staleTime = staleSeconds * 1000;
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            setLoading(true);

            const cached = cache[url];
            if (cached && cached.expiry > Date.now()) {
                setData(cached.data);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(url, { cache: "no-store" }); 
                if (!res.ok) throw new Error("Fetch failed");

                const json = (await res.json()) as T;
                if (!cancelled) {
                    setData(json);
                    cache[url] = { data: json, expiry: Date.now() + staleTime };
                }
            } catch (err) {
                if (!cancelled) setError(err as Error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [url, staleTime]);

    return { data, loading, error };
}
