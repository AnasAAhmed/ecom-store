import StarRatings from "./StarRatings";
import HeartFavorite from "./HeartFavorite";
import { AddtoCartBtnForNonVariant, PriceAndExpense, SizesAndColors } from "./ProductInteractivity";

const ProductInfo = ({ productInfo }: { productInfo: ProductType }) => {
    
    return (
        <div className="max-w-1/2 sm:w-[500px] flex flex-col gap-4">

            <div className="flex justify-between items-start">
                <h4 className="text-heading4-bold sm:text-heading3-bold">{productInfo.title}</h4>

            </div>

            {/* Price & Discounts */}
            <div className="text-heading4-bold flex justify-between items-start">
                {/* for server side for bots and search engine*/}
                <div className=" sr-only mt-[2spx]">
                    <span className="text-small-medium mr-1">$</span>{productInfo.price}
                    {productInfo.expense > 0 && (
                        <>
                            <span className="bg-red-600 ml-3 text-white text-[17px] px-2 py-1 rounded-md">
                                {((productInfo.expense - productInfo.price) / productInfo.expense * 100).toFixed(0)}% Off
                            </span>
                            <p className="text-small-medium line-through  text-red-1">$ {productInfo.expense}</p>
                        </>
                    )}
                </div>
                {/* for client side for different currencies */}
                <PriceAndExpense baseExpense={productInfo.expense} basePrice={productInfo.price} />
                <HeartFavorite productId={productInfo._id} />
            </div>

            {/* Rating and Sold Count */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <StarRatings rating={productInfo.ratings} />
                    <span title="ratings" className="text-blue-500"> ({(productInfo.ratings).toFixed()}/5)</span>
                </div>
                sold({productInfo.sold})
            </div>

            <p className="text-small-medium sm:text-body-medium text-gray-800"  >{productInfo.description}</p>
            {productInfo.variants.length > 0 ? (
                // for client side interactivity
                <SizesAndColors productInfo={productInfo} />
            ) : (
                <>
                    <div className="text-body-medium text-grey-2">
                        {productInfo.stock > 0 ? (
                            productInfo.stock < 6 ? (
                                <span className="text-red-500">Only {productInfo.stock} items left</span>
                            ) : (
                                <span title="stock is > 6 " className="text-green-500">Available</span>
                            )
                        ) : (
                            <span title="stock is 0" className="text-red-500">Not Available</span>
                        )}
                    </div>
                    {/* for client side interactivity */}
                    <AddtoCartBtnForNonVariant productInfo={productInfo} />
                </>
            )}

            {/* <div className="flex flex-col gap-2">
                <p className="text-base-medium text-grey-2">Quantity:</p>
                <div className="flex gap-4 items-center">
                    <MinusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    />
                    <p className="text-body-bold">{quantity}</p>
                    <PlusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => quantity < productInfo.stock && setQuantity(quantity + 1)}
                    />
                </div>
            </div>

            <button
                title="Add to cart"
                className="outline text-base-bold py-3 disabled:cursor-not-allowed rounded-lg bg-black text-white hover:opacity-85"
                disabled={
                    (productInfo.variants.length > 0 && (!selectedVariant || selectedVariant.quantity < 1)) ||
                    productInfo.stock < 1
                }
                onClick={() => {
                    cart.addItem({
                        item: {
                            _id: productInfo._id,
                            title: productInfo.title,
                            media: productInfo.media,
                            expense: productInfo.expense,
                            stock: selectedVariant?.quantity || productInfo.stock,
                            price: productInfo.price,
                        },
                        quantity,
                        color: selectedVariant?.color,
                        size: selectedVariant?.size,
                        variantId: selectedVariant?._id,
                    });
                }}
            >
                {productInfo.variants.length > 0
                    ? (!selectedVariant || selectedVariant?.quantity < 1 ? "Not Available" : "Add to Cart")
                    : (productInfo.stock < 1 ? "Not Available" : "Add to Cart")}
            </button> */}

        </div>
    );
};

export default ProductInfo;
