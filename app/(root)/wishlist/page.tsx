import ProductCard from "@/components/product/ProductCard";
import { FC } from "react";
import { auth } from "@clerk/nextjs/server";
import { getWishList } from "@/lib/actions/actions";
import type { Metadata } from 'next';

export const metadata: Metadata= {
  title: "Borcelle | Wishlist",
  description: "This is wishlist products",
};

const WishlistPage: FC = async () => {
  const { userId } = auth()
  if (!userId) return;
  const wishlist = await getWishList(userId!);


  if (!wishlist || wishlist.wishlist.length === 0) {
    return (
      <div className="px-10 py-5 min-h-[90vh]">
        <p className="text-heading3-bold my-10">Your Wishlist</p>
        <p>No items in your wishlist</p>
      </div>
    );
  }

  return (
    <div className="px-10 py-5 min-h-[90vh]">
      <p className="text-heading3-bold my-10">Your Wishlist</p>
      <div className="flex flex-wrap justify-center gap-16">
        {wishlist.wishlist.map((product: ProductType) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
