import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  item: CartProductType;
  quantity: number;
  color?: string;
  size?: string;
  variantId?: string;
}

interface CartStore {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (idToRemove: string, varaintId?: string) => void;
  increaseQuantity: (idToIncrease: string, varaintId?: string) => void;
  decreaseQuantity: (idToDecrease: string, varaintId?: string) => void;
  clearCart: () => void;
  updateStock: () => Promise<void>;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (data: CartItem) => {
        const { item, quantity, color, size, variantId } = data;
        const currentItems = get().cartItems;

        // cart limit (10 items)
        if (currentItems.length >= 10) {
          toast.error("Cart limit reached (max 10 items)");
          return;
        }

        // find existing item
        const isExisting = currentItems.find(
          (cartItem) =>
            cartItem.item._id === item._id &&
            (cartItem.variantId ? cartItem.variantId === variantId : !variantId)
        );

        let newCartItems: CartItem[];

        if (isExisting) {
          // update quantity if same product + same variant
          newCartItems = currentItems.map((cartItem) =>
            cartItem.item._id === item._id &&
              (cartItem.variantId ? cartItem.variantId === variantId : !variantId)
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          );
        } else {
          // add as new line item
          newCartItems = [
            ...currentItems,
            { item, quantity: 45, color, size, variantId: variantId || undefined },
          ];
        }

        set({ cartItems: newCartItems });
        if (item) {
          const variantLabel = variantId
            ? ` (${color || ""} - ${size || ""})`
            : "";

          toast.success(item.title + variantLabel + " (Added to cart)");
        }
      },

      removeItem: (idToRemove: string, variantId?: string) => {
        let newCartItems: CartItem[] | undefined;

        if (variantId) {
          // for if there is varaintId it means we nreed to handle it 
          // with varaintId there is varaints in product
          newCartItems = get().cartItems.filter(
            (cartItem) => cartItem.variantId !== variantId
          );
        } else {
          // for if there is no varaintId we can handle it with only product.Id(item._id)
          newCartItems = get().cartItems.filter(
            (cartItem) => cartItem.item._id !== idToRemove
          );
        }

        const removedCartItem = get().cartItems.find(
          (cartItem) => (variantId
            ? (cartItem.item._id === idToRemove && cartItem.variantId === variantId)
            : (cartItem.item._id === idToRemove))
        );
        set({ cartItems: newCartItems });

        if (removedCartItem) {
          const variantLabel = removedCartItem.variantId
            ? ` (${removedCartItem.color || ""} - ${removedCartItem.size || ""})`
            : "";

          toast.success(removedCartItem.item.title + variantLabel + " (Removed from cart)");
        }
      },
      increaseQuantity: async (idToIncrease: string, variantId?: string) => {
        const newCartItems = get().cartItems.map((cartItem) => {
          // if there is varaint then handle by variantId
          if (variantId && cartItem.variantId === variantId) {
            if (cartItem.quantity < cartItem.item.stock) {
              return { ...cartItem, quantity: cartItem.quantity + 1 };
            } else {
              const variantLabel = cartItem.variantId
                ? ` (${cartItem.color || ""} - ${cartItem.size || ""})`
                : "";
              toast.error("Cannot add more, stock limit reached for variant " + variantLabel);
            }
          }
          // if there is no varaint then handle by _id
          if (cartItem.item._id === idToIncrease && !variantId) {
            if (cartItem.quantity < cartItem.item.stock) {
              return { ...cartItem, quantity: cartItem.quantity + 1 };
            } else {
              toast.error("Cannot add more, stock limit reached");
            }
          }
          return cartItem;
        });
        set({ cartItems: newCartItems });
      },
      decreaseQuantity: (idToDecrease: string, variantId?: string) => {
        const newCartItems = get().cartItems.map((cartItem) => {
          // if there is varaint then handle by variantId
          if (variantId && cartItem.variantId === variantId) {
            if (cartItem.quantity > 1) {
              return { ...cartItem, quantity: cartItem.quantity - 1 };
            }
          }
          // if there is no varaint then handle by _id
          if (cartItem.item._id === idToDecrease && !variantId) {
            if (cartItem.quantity > 1) {
              return { ...cartItem, quantity: cartItem.quantity - 1 };
            }
          }
          return cartItem;
        });
        set({ cartItems: newCartItems });
      },
      updateStock: async () => {
        const currentItems = get().cartItems;
        const productIds = currentItems.map((cartItem) => cartItem.item._id);

        const response = await fetch('/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Product-IDs': JSON.stringify(productIds),
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products stock');
        }

        const updatedProducts: ProductType[] = await response.json();

        const updatedCartItems = currentItems
          .map((cartItem) => {
            // Case 1: simple product (no variants)
            const updatedProduct = updatedProducts.find(
              (p) => !p.variants && p._id === cartItem.item._id
            );

            // Case 2: variant product
            const updatedVariantProduct = updatedProducts.find((p) =>
              p.variants?.some((v) => v._id === cartItem.variantId)
            );

            // --- handle simple product ---
            if (updatedProduct) {
              return {
                ...cartItem,
                // reset quantity if stock got reduced
                quantity: Math.min(cartItem.quantity, updatedProduct.stock),
                item: {
                  ...cartItem.item,
                  stock: updatedProduct.stock,
                },
              };
            }

            // --- handle variant product ---
            if (updatedVariantProduct && cartItem.variantId) {
              const updatedVariant = updatedVariantProduct.variants.find(
                (v) => v._id === cartItem.variantId
              );

              if (updatedVariant) {
                return {
                  ...cartItem,
                  quantity: Math.min(cartItem.quantity, updatedVariant.quantity),
                  item: {
                    ...cartItem.item,
                    stock: updatedVariant.quantity,
                  },
                };
              } else {
                toast.error(
                  `This ${cartItem.size! + "/" + cartItem.color!} variant of ${cartItem.item.title
                  } has been changed or removed`
                );
                return null;
              }
            }

            // --- product not found at all ---
            toast.error(`The product ${cartItem.item.title} has been changed or removed`);
            return null;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        set({ cartItems: updatedCartItems });
      },

      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);


interface RegionStore {
  country: string;
  currency: string;
  exchangeRate: number;
  lastFetched: number | null;
  isHydrated: boolean;
  setCountry: (country: string) => void;
  setCurrency: (currency: string) => void;
  clearcur: () => void;
  clearcon: () => void;
}

export const useRegion = create<RegionStore>()(
  persist(
    (set, get) => ({
      country: '',
      currency: 'USD', // default to 'USD'
      exchangeRate: 1, // default to 1 for USD
      lastFetched: null,
      isHydrated: false,

      setCountry: (country) => set({ country }),

      setCurrency: async (currency) => {
        if (currency === 'USD') set({ exchangeRate: 1 });
        if (currency === 'PKR') set({ exchangeRate: 200 });
        const currentTime = Date.now();
        const threeDays = 3 * 24 * 3600 * 1000; // 3 days in milliseconds
        const shouldFetch =
          currency !== 'USD' && currency !== 'PKR' &&// Only fetch if the currency is not USD or PKR
          (currency !== get().currency || !get().lastFetched || currentTime - get().lastFetched! > threeDays);
        if (shouldFetch) {
          let exchangeRate;
          try {
            const response = await fetch(
              `https://api.currencyapi.com/v3/latest?apikey=${process.env.NEXT_PUBLIC_CURRENCY_API}&base_currency=USD&currencies=${currency}`
            );
            const data = await response.json();
            console.log('currency-api:success');
            exchangeRate = data.data?.[currency.toUpperCase()]?.value || 1;

          } catch (error) {
            const typeError = error as Error;
            console.log('currency-api:Failed:' + typeError.message);
          }

          // Access the correct exchange rate from the response
          set({ currency, exchangeRate, lastFetched: currentTime });
        } else {
          set({ currency });
        }
      },

      clearcur: () => set({ currency: 'USD', exchangeRate: 1 }), // reset to default USD
      clearcon: () => set({ country: '', currency: 'USD', exchangeRate: 1 }),
    }),
    {
      name: "region-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state) => {
          state && state.isHydrated === false && setTimeout(() => {
            useRegion.setState({ isHydrated: true });
          }, 0);
        };
      },
    }
  )
);
interface UserState {
  userWishlist: {
    userId: string;
    wishlist: [string];
    signInHistory: [
      {
        country: string,
        city: string,
        ip: string,
        userAgent: string,
        os: string,
        device: string,
        browser: string,
        signedInAt: Date
      }
    ] | [];
    country: string;
    city: string;
  } | null;
  setUserWishlist: (userWishlist: any) => void;
  resetUserWishlist: () => void;
}

export const useWhishListUserStore = create<UserState>((set) => ({
  userWishlist: null,
  setUserWishlist: (userWishlist) => set({ userWishlist }),
  resetUserWishlist: () => set({ userWishlist: null }),
}));
export default useCart;




