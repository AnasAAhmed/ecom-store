import StarRatings from "./StarRatings";
import HeartFavorite from "./HeartFavorite";
import { AddtoCartBtnForNonVariant, PriceAndExpense, SizesAndColors } from "./ProductInteractivity";
import Link from "next/link";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
    const discount = ((productInfo.expense - productInfo.price) / productInfo.expense * 100).toFixed(0);
    const isColors = productInfo.variants.filter(i => i.color !== '')
    const isSizes = productInfo.variants.filter(i => i.size !== '')
    const initialVariant = productInfo.variants.find(v => v.quantity > 0) || null;
    return (
        <div className="max-w-1/2 sm:max-w-[500px] flex flex-col gap-4">

            <div className="flex justify-between items-start">
                <h1 className="text-heading4-bold sm:text-heading3-bold">{productInfo.title}</h1>

            </div>

            {/* Price & Discounts */}
            <div className="text-heading4-bold flex justify-between items-end">
                {/* for server side for bots and search engine*/}
                <div className=" sr-only mt-[2spx]">
                    <span className="text-small-medium mr-1">$</span>{productInfo.price}
                    {productInfo.expense > 0 && (
                        <>
                            <span className="bg-blue-700 ml-3 text-white text-[17px] px-2 py-1 rounded-md">
                                {discount}% Off
                            </span>
                            <p className="text-small-medium line-through  text-gray-700">$ {productInfo.expense}</p>
                        </>
                    )}
                </div>
                {/* for client side for different currencies */}
                <PriceAndExpense
                    category={productInfo.category}
                    productId={productInfo._id}
                    baseExpense={productInfo.expense}
                    basePrice={productInfo.price} />
                <HeartFavorite productId={productInfo._id} />
            </div>

            {/* Rating and Sold Count */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <StarRatings rating={productInfo.ratings} />
                    <Link href={'#reviews'}>
                        <span title="ratings" className="text-blue-700"> ({(productInfo.ratings).toFixed()}/5)</span>
                    </Link>
                </div>
                sold({productInfo.sold})
            </div>

            <p className="text-small-medium sm:text-body-medium text-gray-800"  >{productInfo.description}</p>
            {productInfo.variants.length > 0 ? (
                // for client side interactivity
                <SizesAndColors initialVariant={initialVariant} isColors={isColors} isSizes={isSizes} productInfo={productInfo} />
            ) : (
                <>
                    <div className="text-body-medium text-gray-700">
                        {productInfo.stock > 0 ? (
                            productInfo.stock < 6 ? (
                                <span className="text-yellow-700">Only {productInfo.stock} items left</span>
                            ) : (
                                <span title="stock is > 6 " className="text-green-700">Available</span>
                            )
                        ) : (
                            <span title="stock is 0" className="text-red-700">Not Available</span>
                        )}
                    </div>
                    {/* for client side interactivity */}
                    <AddtoCartBtnForNonVariant productInfo={productInfo} />
                </>
            )}
        </div>
    );
};

export default ProductInfo;
