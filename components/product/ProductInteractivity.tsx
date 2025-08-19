'use client'
import useCart, { useRegion } from '@/lib/hooks/useCart';
import { currencyToSymbolMap } from '@/lib/utils/features.csr';
import { MinusCircle, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'

type VariantsType = [{
    _id: string;
    size: string;
    color: string;
    quantity: number;
}]

export const SizesAndColors = ({ productInfo }: { productInfo: ProductType }) => {
    const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(null);
    const [quantity, setQuantity] = useState(1);
    const cart = useCart();
    // const { currency, exchangeRate } = useRegion();
    // const price = (price * exchangeRate).toFixed();
    // const expense = (expense * exchangeRate).toFixed();

    const uniqueSizes = Array.from(new Set(productInfo.variants.map(variant => variant.size)));
    const uniqueColors = Array.from(new Set(productInfo.variants.map(variant => variant.color)));
    const isColors = productInfo.variants.filter(i => i.color !== '')
    const isSizes = productInfo.variants.filter(i => i.size !== '')

    useEffect(() => {
        const availableVariant = productInfo.variants.find(variant => variant.quantity > 0);
        if (availableVariant) setSelectedVariant(availableVariant);
    }, [productInfo.variants]);

    const handleSizeChange = (size: string) => {
        const matchingVariants = productInfo.variants.filter(variant => variant.size === size);
        setSelectedVariant(matchingVariants.length ? matchingVariants[0] : null);
    };

    const handleColorChange = (color: string) => {
        if (selectedVariant) {
            const variant = productInfo.variants.find(v => v.size === selectedVariant.size && v.color === color);
            setSelectedVariant(variant || null);
        }
    };
    return (
        <>
            {isSizes.length > 1 && uniqueSizes.length > 0 && (
                <div className="flex mb-4">
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
            )}

            {isColors.length > 1 && uniqueColors.length > 0 && selectedVariant && (
                <div className="flex mb-4">
                    {uniqueColors.map((color, index) => {
                        const isAvailable = productInfo.variants.some(
                            (variant) => variant.size === selectedVariant.size && variant.color === color && variant.quantity > 0
                        );

                        return (
                            <button
                                title={` click here to select ${color} color`}
                                key={index}
                                className={`border border-black text-gray-800 px-2 py-1 mr-2 rounded-md ${selectedVariant.color === color ? "bg-black text-white" : "bg-white"} ${!isAvailable ? "opacity-50 cursor-not-allowed line-through" : ""}`}
                                disabled={!isAvailable}
                                onClick={() => handleColorChange(color)}
                            >
                                {color}
                            </button>
                        );
                    })}
                </div>
            )}
            {selectedVariant && (
                <div className="text-body-medium text-grey-2">
                    Variant Stock:{" "}
                    {selectedVariant.quantity > 0 ? (
                        selectedVariant.quantity < 6 ? (
                            <span className="text-red-500">Only {selectedVariant.quantity} items left</span>
                        ) : (
                            <span className="text-green-500">Available</span>
                        )
                    ) : (
                        <span className="text-red-500">Not Available</span>
                    )}
                </div>
            )}
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
        return (<div className="flex gap-2 items-center">
            <p className="text-small-medium sm:text-body-medium font-bold text-gray-900">
                <small>{currencyToSymbolMap[currency]}</small>  {price}
            </p>
            {expense > price && (
                <p className="text-small-medium max-sm:hidden line-through text-gray-500">
                    <small>{currencyToSymbolMap[currency]}</small> {expense}
                </p>
            )}
        </div>)
    }

    return (
        <div className="mt-[2spx]" >
            <span className="text-small-medium mr-1">{currencyToSymbolMap[currency]}</span>{price}
            {
                baseExpense > 0 && (
                    <>
                        <span className="bg-red-600 ml-3 text-white text-[17px] px-2 py-1 rounded-md">
                            {((baseExpense - basePrice) / baseExpense * 100).toFixed(0)}% Off
                        </span>
                        <p className="text-small-medium line-through  text-red-1">{currencyToSymbolMap[currency]} {expense}</p>
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