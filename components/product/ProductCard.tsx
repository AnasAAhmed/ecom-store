"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ShoppingCart } from "lucide-react";
import HeartFavorite from "./HeartFavorite";
import StarRatings from "./StarRatings";
import useCart, { useRegion } from "@/lib/hooks/useCart";
import { currencyToSymbolMap } from "@/lib/utils/features.csr";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const image1 = product.media[0];
  const image2 = product.media[1] ? product.media[1] : null;
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
      className={`relative bg-white image-width roundsed-t-lg shadosw-md overflow-hidden  ${isSoldOut ? "opacity-70" : ""
        }`}
    >
      <Link title={"See details of " + title} href='/product/[slug]' as={`/products/${slug}`} className="block" prefetch={false} >
        <div className="relative image-height group overflow-hidden">
          <div className="relative rousnded-md w-full max- h-64 overflow-hidden">
            <Image
              src={image1}
              fill
              sizes="(max-width: 450px) 9rem, (max-width: 700px) 12rem, 16rem"
              alt={product.title}
              className={` inset-0 object-cover transition-transform hover:scale-110 duration-300 ${image2 && 'group-hover:opacity-0'}`}
            />
            {image2 && (
              <Image
                src={image2}
                fill
                sizes="(max-width: 450px) 9rem, (max-width: 700px) 12rem, 16rem"
                alt={`${product.title} alt`}
                className="absolute inset-0 object-cover opacity-0 hover:scale-110 transition-transform duration-300 group-hover:opacity-100"
              />
            )}
          </div>
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
            <span title={JSON.stringify(
              variants.map(({ size, color }) => ({ size, color  }))
            ).replace(/[\[{"}-]/g, ' ')} className="absolute top-2 right-2 bg-gray-900 text-white p-2 rounded-full">
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
        <div className="py-2 px-1">
          <h6 className="text-body-medium font-medium text-gray-900 line-clamp-2 ">
            <abbr title={title} className="no-underline">
              {title}
            </abbr>
          </h6>
          <div className="mt-1 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <p className="text-body-medium font-bold text-gray-900">
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
          <div className="mt-1 flex flex-wrap justify-between items-center space-x-1 text-small-medium text-gray-600">
            <div className="flex justify-start items-center">

            <StarRatings rating={ratings} />
            <span>({numOfReviews})</span>
            </div>
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
