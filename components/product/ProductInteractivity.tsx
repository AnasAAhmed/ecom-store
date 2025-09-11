'use client'
import useCart, { useRegion } from '@/lib/hooks/useCart';
import { currencyToSymbolMap } from '@/lib/utils/features.csr';
import { MinusCircle, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'

type VariantsType = {
    _id: string;
    size: string;
    color: string;
    quantity: number;
}

export const SizesAndColors = (
    { initialVariant, productInfo, isColors, isSizes }:
        { initialVariant: VariantsType | null; productInfo: ProductType; isColors: VariantsType[]; isSizes: VariantsType[]; }) => {

    const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(initialVariant!);
    const [quantity, setQuantity] = useState(1);
    const cart = useCart();

    const uniqueSizes = Array.from(new Set(productInfo?.variants?.map(v => v.size) || []));
    const uniqueColors = Array.from(new Set(productInfo?.variants?.map(v => v.color) || []));

    const handleSizeChange = (size: string) => {
        const matchingVariants = productInfo.variants.filter(variant => variant.size === size);
        setSelectedVariant(matchingVariants.length ? matchingVariants[0] : null);
        setQuantity(selectedVariant!.quantity >= 1 ? 1 : 0);
    };

    const handleColorChange = (color: string) => {
        if (selectedVariant) {
            const variant = productInfo.variants.find(v => v.size === selectedVariant.size && v.color === color);
            setSelectedVariant(variant || null);
            setQuantity(selectedVariant.quantity >= 1 ? 1 : 0);

        }
    };
    return (
        <>
            <div className={`flex mb-4 ${isSizes.length > 1 && uniqueSizes.length > 0 ? "block" : "hidden"}`}>
                {uniqueSizes.map((size, index) => (
                    <button
                        title={` click here to select ${size} size`}
                        key={index}
                        className={`border border-black text-gray-800 px-2 py-1 mr-2 rounded-md ${selectedVariant?.size === size ? "bg-black text-white" : "bg-white"}`}
                        onClick={() => handleSizeChange(size)}
                    >
                        {size}
                    </button>
                ))}
            </div>

            <div className={`flex mb-4 ${isColors.length > 1 && uniqueColors.length > 0 && selectedVariant ? "block" : "hidden"}`}>

                {uniqueColors.map((color, index) => {
                    const isAvailable = productInfo.variants.some(
                        (variant) => variant.size === selectedVariant!.size && variant.color === color && variant.quantity > 0
                    );

                    return (
                        <button
                            title={` click here to select ${color} color`}
                            key={index}
                            className={`border border-black text-gray-800 px-2 py-1 mr-2 rounded-md ${selectedVariant!.color === color ? "bg-black text-white" : "bg-white"} ${!isAvailable ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                            disabled={!isAvailable}
                            onClick={() => handleColorChange(color)}
                        >
                            {color}
                        </button>
                    );
                })}
            </div>
            <div className="text-body-medium text-gray-700  h-6">
                Variant Stock:{" "}
                {selectedVariant
                    ? selectedVariant.quantity > 0
                        ? selectedVariant.quantity < 6
                            ? <span className="text-yellow-700">Only {selectedVariant.quantity} items left</span>
                            : <span className="text-green-700">Available</span>
                        : <span className="text-red-700">Not Available</span>
                    : null}
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-base-medium text-gray-700">Quantity:</p>
                <div className="flex gap-4 items-center">
                    <MinusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    />
                    <p className="text-body-bold">{quantity}</p>
                    <PlusCircle
                        className="hover:text-red-1 cursor-pointer"
                        onClick={() => quantity < selectedVariant?.quantity! && setQuantity(quantity + 1)}
                    />
                </div>
            </div>

            <button
                title="Add to cart"
                className="min-w-[140px] outline text-base-bold py-3 disabled:cursor-not-allowed rounded-lg bg-black text-white hover:opacity-85"
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
            </button>
        </>
    )
}

export const PriceAndExpense = ({ isCard = false, baseExpense, basePrice }: { isCard?: boolean; baseExpense: number; basePrice: number }) => {
    const { currency, exchangeRate } = useRegion();
    const price = (basePrice * exchangeRate).toFixed();
    const expense = (baseExpense * exchangeRate).toFixed();

    if (isCard) {
        return (
            <div className="mt-1 min-h-[24px]">
                {currency ? (
                    <div className='flex items-center gap-1'>
                        <span className="text-small-medium mr-1">{currencyToSymbolMap[currency]}</span>{price}
                        {baseExpense > 0 && (
                            <p className="text-small-medium line-through text-gray-700">
                                {currencyToSymbolMap[currency]} {expense}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="opacity-0">
                        $ {basePrice}
                        <span className="ml-3 px-2 py-1">0% Off</span>
                        <p className="line-through">$ {baseExpense}</p>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="mb-[5px]" >
            <span className="text-small-medium mr-1">{currencyToSymbolMap[currency]}</span>{price}
            {
                baseExpense > 0 && (
                    <>
                        <span className="bg-blue-700 ml-3 text-white text-[17px] px-2 py-1 rounded-md">
                            {((baseExpense - basePrice) / baseExpense * 100).toFixed(0)}% Off
                        </span>
                        <p className="text-small-medium line-through  text-gray-700">{currencyToSymbolMap[currency]} {expense}</p>
                    </>
                )
            }
        </div >
    )
}

export const AddtoCartBtnForNonVariant = ({ productInfo }: { productInfo: ProductType }) => {
    const [quantity, setQuantity] = useState(1);
    const cart = useCart();

    return (
        <>
            <div className="flex flex-col gap-2">
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
                disabled={productInfo.stock < 1}
                onClick={() => {
                    cart.addItem({
                        item: {
                            _id: productInfo._id,
                            title: productInfo.title,
                            media: productInfo.media,
                            expense: productInfo.expense,
                            stock: productInfo.stock,
                            price: productInfo.price,
                        },
                        quantity,
                    });
                }}
            >
                {productInfo.stock < 1 ? "Not Available" : "Add to Cart"}
            </button>
        </>
    )
}