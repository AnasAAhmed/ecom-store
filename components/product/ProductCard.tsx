"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ShoppingCart } from "lucide-react";
import HeartFavorite from "./HeartFavorite";
import StarRatings from "../StarRatings";
import useCart, { useRegion } from "@/lib/hooks/useCart";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const { currency, exchangeRate } = useRegion();
  const cart = useCart();
  const {
    _id,
    slug,
    title,
    price,
    expense,
    media,
    stock,
    ratings,
    numOfReviews,
    sold,
    variants,
  } = product;

  const productPrice = (price * exchangeRate).toFixed();
  const productExpense = (expense * exchangeRate).toFixed();
  const isSoldOut = stock < 1;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    cart.addItem({
      item: { _id, title, media, price, expense, stock },
      quantity: 1,
    });
  };

  return (
    <div
      className={`relative bg-white max-w-56 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 ${isSoldOut ? "opacity-70" : ""
        }`}
    >
      <Link href={`/products/${slug}`} className="block" prefetch={false} >
        <div className="relative group">
          <Image
            src={media[0]}
            alt={title}
            width={250}
            height={220}
            className="w-full max-h-56 object-cover"
          />
          {isSoldOut ? (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[12px] font-semibold px-2 py-1 rounded">
              Sold Out
            </span>
          ) : (
            expense > 0 && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-[12px] font-semibold px-2 py-1 rounded">
                {((expense - price) / expense * 100).toFixed(0)}% Off
              </span>
            )
          )}

          {!isSoldOut && variants?.length > 0 ? (
            <span className="absolute top-2 right-2 bg-gray-900 text-white p-2 rounded-full">
              <ChevronDown className="w-4 h-4" />
            </span>
          ) : (
            <button
              aria-label="Add to cart"
              disabled={isSoldOut}
              onClick={(e) => { handleAddToCart(e); e.stopPropagation() }}
              className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="py-1 px-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{title}</h3>
          <div className="mt-1 flex items-center justify-between">
            <div >
              <p className="text-lg font-bold text-gray-900">
                {currency.toLowerCase()} {productPrice}
              </p>
              {expense > price && (
                <p className="text-small-medium line-through text-gray-500">
                  {currency} {productExpense}
                </p>
              )}
            </div>
            <HeartFavorite productId={_id} updateSignedInUser={updateSignedInUser} />
          </div>
          <div className="mt-1 flex items-center space-x-1 text-small-medium text-gray-600">
            <StarRatings rating={ratings} />
            <span>({numOfReviews})</span>
          </div>
          {sold > 0 && (
            <p className="mt-1 text-xs text-gray-500">Sold ({sold})</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
