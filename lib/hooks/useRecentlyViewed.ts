'use client'
const RECENTLY_VIEWED_KEY = "recentlyViewedProducts";

// function excludeKeys<T extends object, K extends keyof T>(
//   obj: T,
//   keys: K[]
// ): Omit<T, K> {
//   const { ...copy } = obj;
//   keys.forEach(key => {
//     delete (copy as any)[key];
//   });
//   return copy;
// }
type RecenltyProdcut = {
  _id: string;
  title: string;
  media: string[];
  category: string;
  slug: string;
  stock: number;
  numOfReviews: number;
  sold: number;
  ratings: number;
  price: number;
  expense: number;
  updatedAt: Date;
}

export function addProductToRecentlyViewed(product: RecenltyProdcut) {
  let items: RecenltyProdcut[] = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");

  // Remove if already exists
  const isExist = items.find((i) => i._id === product._id);
  if (isExist) return;

  items.unshift(product);

  // Keep max 10
  if (items.length > 10) {
    items = items.slice(0, 10);
  }

  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
}
export function removeRecentlyViewed(productId: string) {
  let items: RecenltyProdcut[] = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");

  // remove from Product-IDs Cookie
  const cookieKey = "Product-IDs";
  const ids = document.cookie
    .split("; ")
    .find((row) => row.startsWith(cookieKey + "="))
    ?.split("=")[1];

  let newIds = ids ? decodeURIComponent(ids).split(",") : [];

  // remove if exists
  newIds = newIds.filter((id) => id !== productId);


  document.cookie = `${cookieKey}=${encodeURIComponent(newIds.join(","))}; path=/;`;

   // remove from recentlyViewedProducts Local Storage
  const filteredItems = items.filter((i) => i._id !== productId);

  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(filteredItems));
}
export function getRecentlyViewed(): ProductType[] | [] {
  return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
}
