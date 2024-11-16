type CollectionType = {
  _id: string;
  title: string;
  products: number;
  image: string;
};

type ProductType = {
  _id: string;
  title: string;
  description: string;
  media: [string];
  category: string;
  slug: string;
  collections: string[];
  tags: [string];
  variants: [{
    _id: string;
    size: string;
    color: string;
    quantity: number
  }];
  stock: number;
  numOfReviews: number;
  sold: number;
  ratings: number;
  price: number;
  expense: number;
  createdAt: Date;
  updatedAt: Date;
}
type CartProductType = {
  _id: string;
  title: string;
  media: [string];
  stock: number;
  price: number;
  expense: number;
}

type OrderProductCOD = {

  product: string,//it is product._id
  color: string,
  size: string,
  variantId?: string,
  quantity: number

}

type OrderProducts = {
  // product: string,//it is productId
  item: { _id: string; },//it is also productId
  color: string,
  size: string,
  variantId?: string,
  quantity: number
}
type Variant = {
  color: string,
  size: string,
  _id: string,
  quantity: number
}

type ReviewType = {
  _id: string;
  userId: string;
  name: string;
  photo: string;
  rating: number;
  comment: string;
  productId: string;
  createdAt: number;
  updatedAt: number;
}

type VariantType = {
  _id?: string;
  size?: string ;
  color?: string;
  quantity: number
}

type UserType = {
  clerkId: string;
  wishlist: [string];
  createdAt: string;
  updatedAt: string;
};

type OrderType = {
  shippingAddress: {
    street: string;
    postalCode: string;
    state: string;
    city: string;
    phone: string,
    country: string
  };
  _id: string;
  customerEmail: string;
  products: [OrderItemType]
  shippingRate: string;
  status: string;
  method: string;
  exchangeRate: number;
  currency: string;
  totalAmount: number
  createdAt: string;
}

type OrderItemType = {
  product: ProductType;
  color: string;
  size: string;
  quantity: number;
  _id: string;
}
interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string; // ? means optional
  size?: string; // ? means optional
}
