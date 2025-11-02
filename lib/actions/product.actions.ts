import Product from "../models/Product"
import { connectToDB } from "../mongoDB"
import Review from "../models/Review"
import Wishlist from "../models/Wishlist"
import { isValidObjectId } from "mongoose"



//for app/sitemap.ts
export async function getAllProducts() {
  try {
    await connectToDB();

    const products = await Product.find().select("slug media category tags");

    return JSON.parse(JSON.stringify(products))
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error((err as Error).message);
  }
};


export async function getSearchProducts(query: string, sort: string, sortField: string, page: number, category: string, color: string, size: string) {
  const limit = 12;
  const search = query ? decodeURIComponent(query) : '';
  const sortOptions: { [key: string]: 1 | -1 } = {};
  if (sort && sortField) {
    const sortOrder = sort === "asc" ? 1 : -1;
    sortOptions[sortField] = sortOrder;
  } else {
    sortOptions['createdAt'] = -1;
  }


  const filters: any = {};

  if (query) {
    filters.$text = { $search: search };
  }
  if (isValidObjectId(query)) filters._id = query;

  if (category) {
    filters.category = category;
  }

  if (color) filters.variantColors = color;
  if (size) filters.variantSizes = size;

  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments(filters);
    if (!totalProducts) {
      return JSON.parse(JSON.stringify({
      products: [],
      totalPages:0,
      totalProducts,
    }))
    }
    const totalPages = Math.ceil(totalProducts / limit);

    const searchedProducts = await Product.find(filters)
      .select("title numOfReviews stock ratings sold price expense media _id")
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

    return JSON.parse(JSON.stringify({
      products: searchedProducts,
      totalPages,
      totalProducts,
    }));
  } catch (err) {
    console.error('[search_GET]', err);
    throw new Error((err as Error).message);
  }
};

export async function getProducts() {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: -1, updatedAt: -1 })
      .select("title numOfReviews variants stock ratings sold price expense media _id")
      .limit(8);
    console.log('latest Prodcuts func hits');

    return JSON.parse(JSON.stringify(products))
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error((err as Error).message);
  }
};

export async function getBestSellingProducts() {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ sold: -1, ratings: -1 })
      .select("title numOfReviews stock ratings sold price expense media _id")
      .limit(6);

    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error((err as Error).message);

  }
};
export async function getProductDetails(slug: string): Promise<ProductType | null> {
  try {
    await connectToDB();
    const product = await Product.findOne({ slug }).select('-__v -createdAt -updatedAt -variantColors -variantSizes -searchableVariants');
    if (!product) {
      return null;
    };
    return JSON.parse(JSON.stringify(product))

  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error ' + (err as Error).message)

  }
};
export async function getRelatedProduct(productId: string, category: string, collections: string[]) {
  try {
    await connectToDB();
    const relatedProducts = await Product.find({
      $or: [
        { category: category },
        { collections: { $in: collections } }
      ],
      _id: { $ne: productId }
    }).select("title numOfReviews stock ratings sold price expense media _id");

    return JSON.parse(JSON.stringify(relatedProducts))

  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error ' + (err as Error).message)

  }
};


export async function getProductReviews(productId: string, page: number) {
  try {
    const skip = (page - 1) * 4;
    await connectToDB();
    const reviews = await Review.find({ productId }).limit(6).skip(skip);


    return JSON.parse(JSON.stringify(reviews))
  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error ' + (err as Error).message)

  }
};

export async function getWishList(userId: string) {
  try {
    await connectToDB();

    const wishlist = await Wishlist.findOne({ userId })
      .populate({
        path: "wishlist",
        model: Product,
      })
      .select("wishlist");
    return JSON.parse(JSON.stringify(wishlist));
  } catch (error) {
    const typeError = error as Error;
    console.log('something wrong' + typeError.message);
    throw new Error('something wrong' + typeError.message);
  }
};




