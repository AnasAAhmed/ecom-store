"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ShoppingCart } from "lucide-react";
import HeartFavorite from "./HeartFavorite";
import StarRatings from "./StarRatings";
import useCart, { useRegion } from "@/lib/hooks/useCart";
import { currencyToSymbolMap } from "@/lib/utils/features";

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
      className={`relative bg-white image-width rounded-t-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 ${isSoldOut ? "opacity-70" : ""
        }`}
    >
      <Link title={"See details of " + title} href='/product/[slug]' as={`/products/${slug}`} className="block" prefetch={false} >
        <div className="relative image-height group">
          <Image
            src={media[0]}
            alt={title}
            fill
            sizes="(max-width: 450px) 9rem, (max-width: 700px) 12rem, 16rem"
            className="w-full object-cover"
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
              title="Add to Cart"
              disabled={isSoldOut}
              onClick={(e) => { handleAddToCart(e); e.stopPropagation() }}
              className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-500 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="py-1 px-3">
          <h6 className="text-lg sm:pb-1 font-medium text-gray-900 line-clamp-2 ">
            <abbr title={title} className="no-underline">
              {title}
            </abbr>
          </h6>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <p className="text-lg font-bold text-gray-900">
                <small>{currencyToSymbolMap[currency]}</small>  {productPrice}
              </p>
              {expense > price && (
                <p className="text-small-medium max-sm:hidden line-through text-gray-500">
                  <small>{currencyToSymbolMap[currency]}</small> {productExpense}
                </p>
              )}
            </div>
            <HeartFavorite productId={_id} updateSignedInUser={updateSignedInUser} />
          </div>
          <div className="mt-1 flex flex-wrap items-center space-x-1 text-small-medium text-gray-600">
            <StarRatings rating={ratings} />
            <span>({numOfReviews})</span>
            {sold > 0 && (
              <p className="mtd-1 text-xs text-gray-500">Sold ({sold})</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
