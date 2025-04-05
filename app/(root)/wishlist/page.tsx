import ProductCard from "@/components/product/ProductCard";
import { FC } from "react";
import { getWishList } from "@/lib/actions/actions";
import type { Metadata } from 'next';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProductList from "@/components/product/ProductList";

export const metadata: Metadata = {
  title: "Borcelle | Wishlist",
  description: "This is wishlist products",
};

const WishlistPage: FC = async () => {
  const session = (await auth()) as Session

  if (!session) {
    return redirect('/login');
  }
  const wishlist = await getWishList(session.user.id);


  if (!wishlist || wishlist.wishlist.length === 0) {
    return (
      <div className="px-10 py-5 min-h-[90vh]">
        <p className="text-heading3-bold my-10">Your Wishlist</p>
        <p>No items in your wishlist</p>
      </div>
    );
  }

  return (
    <div className="py-5 min-h-[90vh]">
      <p className="px-7 sm:px-10 text-heading3-bold my-10">Your Wishlist</p>
      <div className="flex flex-wrap justify-center gap-16">
        <ProductList isViewAll={false} heading="Our Top Selling Products" Products={wishlist.wishlist} />

      </div>
    </div>
  );
};

export default WishlistPage;
