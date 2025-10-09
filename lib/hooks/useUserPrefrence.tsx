"use client";

// Improved tracking with range
export function updatePriceRange(price: number) {
    const cookieKey = "avgPriceRange";
    const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith(cookieKey + "="))
        ?.split("=")[1];

    let { sum, count, min, max } = existing
        ? JSON.parse(decodeURIComponent(existing))
        : { sum: 0, count: 0, min: price, max: price };

    sum += price;
    count += 1;
    min = Math.min(min, price);
    max = Math.max(max, price);

    document.cookie = `${cookieKey}=${encodeURIComponent(JSON.stringify({ sum, count, min, max }))}; path=/;`;
}

export function updateCategories(category: string) {
    const cookieKey = "categories";
    const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith(cookieKey + "="))
        ?.split("=")[1];

    let categoryMap: Record<string, number> = existing
        ? JSON.parse(decodeURIComponent(existing))
        : {};

    categoryMap[category] = (categoryMap[category] || 0) + 1;
    
    const entries = Object.entries(categoryMap)
        .sort((a, b) => b[1] - a[1]) 
        .slice(0, 10);               

    const limitedMap = Object.fromEntries(entries);

    document.cookie = `${cookieKey}=${encodeURIComponent(JSON.stringify(limitedMap))}; path=/;`;
}

export function updateRecentlyViewed(productId: string) {
    const cookieKey = "Product-IDs";
    const existing = document.cookie
        .split("; ")
        .find((row) => row.startsWith(cookieKey + "="))
        ?.split("=")[1];

    let ids = existing ? decodeURIComponent(existing).split(",") : [];

    // remove duplicate if exists
    ids = ids.filter((id) => id !== productId);

    // add new one at start
    ids.unshift(productId);

    // keep only last 10
    ids = ids.slice(0, 10);

    document.cookie = `${cookieKey}=${encodeURIComponent(ids.join(","))}; path=/;`;
}