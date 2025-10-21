import { connectToDB } from "../mongoDB";
import Product from "../models/Product";
import Collection from "../models/Collection";

export async function getCollectionProducts(collectionId: string): Promise<ProductType[] | string> {
  try {
    await connectToDB();
    const collectionProducts = await Product.find({ collections: collectionId })
      .sort({ updateAt: -1 })
      .limit(6)
      .select("title numOfReviews ratings stock sold price expense media _id");

    if (!collectionProducts) return 'Collection Products Not Found';
    console.log('collectionProducts func hits');

    return JSON.parse(JSON.stringify(collectionProducts))
  } catch (err) {
    console.log("[products_GET]", err);
    return ((err as Error).message);
  }
}
export async function collectionProducts({
  collectionId, page, size, color, sort, sortField }:
  { collectionId: String; page: number; size?: string; color?: string; sort?: string; sortField?: string }
): Promise<{ products: ProductType[], total: number, currentPage: string, totalPages: number } | string> {
  try {
    await connectToDB();

    const limit = 12;
    const skip = (page - 1) * limit;
    const sortOptions: { [key: string]: 1 | -1 } = {};
    if (sort && sortField) {
      const sortOrder = sort === "asc" ? 1 : -1;
      sortOptions[sortField] = sortOrder;
    } else {
      sortOptions['createdAt'] = -1;
    }


    const filters: any = { collections: collectionId };

    if (color) filters.variantColors = color;
    if (size) filters.variantSizes = size;

    const products = await Product.find(filters)
      .select("title numOfReviews ratings stock sold price expense media _id")
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

    const total = await Product.countDocuments({
      collections: collectionId,
    });

    return JSON.parse(JSON.stringify({
      products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    }))
  } catch (err) {
    console.log("[products_GET]", err);
    return ((err as Error).message);
  }
}

export async function getCollections() {
  try {

    const collections = await Collection.find().sort({ createdAt: -1 }).select("image mobImage productCount title").limit(8);
    return JSON.parse(JSON.stringify(collections))

  } catch (err) {
    console.log("[collections_GET]", err)
    throw new Error('Internal Server Error ' + (err as Error).message)
  }
};

export async function getCollectionDetails(title: string) {
  try {
    await connectToDB();

    const collection = await Collection.findOne({ title });
    // .populate({
    //   path: 'products',
    //   options: { limit: 2 },
    //   select: "title numOfReviews stock ratings sold price expense media _id",
    // });

    if (!collection) {
      return null
    }
    return JSON.parse(JSON.stringify(collection))
  } catch (err) {
    console.log("[collectionId_GET]", err);
    throw new Error('Internal Server Error ' + (err as Error).message)
  }
};

//for app/sitemap.ts
export async function getAllCollections() {
  try {

    const collections = await Collection.find().select("image title");

    return JSON.parse(JSON.stringify(collections))

  } catch (err) {
    console.log("[collections_GET]", err)
    throw new Error('Internal Server Error ' + (err as Error).message)
  }
};