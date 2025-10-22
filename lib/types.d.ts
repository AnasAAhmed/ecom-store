type CollectionType = {
  _id: string;
  title: string;
  description: string;
  productCount: number;
  image: string;
  mobImage?: string;
};

type ProductType = {
  _id: string;
  title: string;
  description: string;
  detailDesc?: string;
  media: string[];
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
  media: string[];
  stock: number;
  price: number;
  expense: number;
}
interface Session {
  user: {
    id: string
    email: string
    image: string
    name: string
  }
}

interface AuthResult {
  type: string
  message: string
}
interface Result {
  type: string
  resultCode: string
};

type Align = "start" | "center" | "end";
type textAlign = "left" | "center" | "right";
type Size = "small" | "medium" | "large"|"extraLarge"|"full";
type Shade = {
  color?: string;
  position?: string;
};

interface IVideoSettings {
  isVideo: boolean;
  url?: string;
  poster?: string;
}

interface ILayoutSettings {
  margin?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  padding?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  borderRadius?: string;
  imagePosition?: 'top' | 'center' | 'bottom';
  backgroundColor?: string;
}

interface IImageContent {
  heading?: string;
  text?: string;
  font?: "monospace"|"sans-serif"|"serif";
  textColor?: string;
  buttonText?: string;
  buttonType?: "link"|"button";
  textAlign?: textAlign;
  link?: string;
  contentPositionV?: Align;
  contentPositionH?: Align;
}

interface ICollectionBanner {
  imgUrl: string;
  mobImgUrl?: string;
  collectionId: string;
  size?: Size;
  shade?: Shade;
  isRow?: boolean;
  video?: IVideoSettings;
  imageContent?: IImageContent;
  layout?: ILayoutSettings;
}

interface IHeroBanner {
  imgUrl: string;
  mobImgUrl?: string;
  size?: Size;
  shade?: Shade;
  video?: IVideoSettings;
  imageContent?: IImageContent;
  layout?: ILayoutSettings;
}

interface HomePage {
  seo?: {
    title?: string;
    desc?: string;
    keywords?: [string];
    url?: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  hero: IHeroBanner[];
  collections: ICollectionBanner[];
  collectionList: CollectionType[];
}

interface GridBannerProps {
  imageUrl: string;
  imageSize: number;
  collectionId: string;
  imageClass?: string;
  gridColumn?: string
  gridRow?: string
  ariaLabel?: string;
  aspectRatio?: string;
}

interface User {
  id?: string
  name?: string | null
  password?: string | null
  email?: string | null
  image?: string | null
  country: string,
  role: string,
  city: string,
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
  ] | []
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
  size?: string;
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
  isPaid: boolean;
  customerEmail: string;
  customerPhone: string;
  products: [OrderItemType]
  shippingRate: string;
  status: string;
  statusHistory: {
    status: string;
    changedAt: Date;
    _id: string;
  }[];
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
