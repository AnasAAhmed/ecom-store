'use client'
import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import HeartFavorite from "./HeartFavorite";
import StarRatings from "./StarRatings";
import { PriceAndExpense } from "./ProductInteractivity";
import { slugify } from "@/lib/utils/features";
import FadeInOnView from "../FadeInView";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: UserType) => void;
  onRemove?: (productId: string) => void;
  index?: number;
}

const ProductCardCsr = ({ product, updateSignedInUser, onRemove, index = 1 }: ProductCardProps) => {
  const image1 = product.media[0];
  const image2 = product.media[1] ? product.media[1] : null;
  const {
    _id,
    title,
    price,
    expense,
    stock,
    ratings,
    numOfReviews,
    sold,
  } = product;

  const isSoldOut = stock < 1;

  return (
    <FadeInOnView
      key={index}
      delay={index * 100}
      threshold={0.2}
      className={`relative image-width min-w-[9rem] sm:min-w-[16rem] roundsed-t-lg overflow-hidden  ${isSoldOut ? "opacity-70" : ""
        }`}
      animation="animate-fadeInUp"
    >
      <SmartLink title={"See details of " + title} href={`/products/${slugify(title)}`} >
        <div className="relative aspect-[4/4.2] group overflow-hidden">

          {/* <div> */}
          <Image
            src={image1}
            alt={product.title}
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL="/fallback.avif"
            sizes="(max-width: 450px) 9rem, (max-width: 700px) 12rem, 16rem"
            className={` rounded-sm inset-0 object-cover transition-opacity duration-300 ${image2 && 'group-hover:opacity-0'}`}
          />
          {image2 && (
            <Image
              src={image2}
              fill
              loading="lazy"
              unoptimized
              sizes="(max-width: 450px) 9rem, (max-width: 700px) 12rem, 16rem"
              alt={`${product.title} alt`}
              className="absolute rounded-sm inset-0 object-cover opacity-0 hover:scale-110 transition-transform duration-300 group-hover:opacity-100"
            />
          )}
          {isSoldOut ? (
            <span className="absolute top-2 left-2 bg-red-700 text-white text-[12px] font-semibold px-2 py-1 rounded">
              Sold Out
            </span>
          ) : (
            expense > 0 && (
              <span className="absolute top-2 left-2 bg-black text-white text-[12px] font-semibold px-2 py-1 rounded-full">
                {((expense - price) / expense * 100).toFixed(0)}% Off
              </span>
            )
          )}
        </div>
        <div className="py-1">
          {onRemove && <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove?.(_id);
            }}
            title='Remove from recently viewed'
            className="absolxute top-2 right-2 bg-red-700 pointer-events-auto z-20 text-white text-[12px] font-semibold px-2 py-1 rounded">
            Remove
          </button>}
          <h1 title={title} className="text-small-medium hover:underline sm:text-[16px] text-start font-medium text-gray-900 line-clamp-2 ">
            {title}
          </h1>
          <div className="mst-1 px-1 flex items-center justify-between">
            <div className="sr-only flex gap-2 items-center">
              <p className="text-small-medium sm:text-body-medium font-bold text-gray-900">
                <small>$</small>  {price}
              </p>
              {expense > price && (
                <p className="text-[12px] sm:text-small-medium max-sm:hidden line-through text-gray-700">
                  <small>$</small> {expense}
                </p>
              )}
            </div>
            <PriceAndExpense isCard={true} baseExpense={expense} basePrice={price} />
            {sold > 0 && (
              <p className="mtd-1 text-[14px] text-gray-500">Sold ({sold})</p>
            )}
          </div>
          <div className="mt-1 flex flex-wrap justify-between items-center space-x-1 text-small-medium text-gray-800">
            <div className="flex justify-start items-center">

              <StarRatings rating={ratings} />
              <span>({numOfReviews})</span>
            </div>
            <HeartFavorite productId={_id} updateSignedInUser={updateSignedInUser} />
          </div>
        </div>
      </SmartLink>
    </FadeInOnView>
  );
};

export default ProductCardCsr;
