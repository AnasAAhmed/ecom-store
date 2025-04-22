import { revalidatePath } from "next/cache"
import Collection from "../models/Collection"
import Order from "../models/Order"
import Product from "../models/Product"
import { connectToDB } from "../mongoDB"
import Review from "../models/Review"
import Customer from "../models/Customer"
import { extractNameFromEmail, ResultCode } from "../utils/features"
import Wishlist from "../models/Wishlist"

//for app/sitemap.ts
export async function getAllCollections() {
  try {

    const collections = await Collection.find().select("image title");

    return JSON.parse(JSON.stringify(collections))

  } catch (err) {
    console.log("[collections_GET]", err)
    throw new Error('Internal Server Error' + (err as Error).message)
  }
};

//for app/sitemap.ts
export async function getAllProducts() {
  try {
    await connectToDB();

    const products = await Product.find()
      .select("slug media category tags");

    return JSON.parse(JSON.stringify(products))
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error('Internal Server Error 500');
  }
};

export async function getCollections() {
  try {

    const collections = await Collection.find().sort({ createdAt: "desc" }).select("image title").limit(6);

    return JSON.parse(JSON.stringify(collections))

  } catch (err) {
    console.log("[collections_GET]", err)
    throw new Error('Internal Server Error' + (err as Error).message)
  }
};

export async function getCollectionDetails(title: string) {
  try {
    await connectToDB();

    const collection = await Collection.findOne({ title }).populate({ path: "products", model: Product });

    if (!collection) {
      return null
    }
    return JSON.parse(JSON.stringify(collection))
  } catch (err) {
    console.log("[collectionId_GET]", err);
    throw new Error('Internal Server Error' + (err as Error).message)
  }
};

export async function getCollectionDetailsForSeo(title: string) {
  try {
    await connectToDB();

    const collection = await Collection.findOne({ title }).select(' title image description');

    if (!collection) {
      return null
    }
    return JSON.parse(JSON.stringify(collection))
  } catch (err) {
    console.log("[collectionId_GET]", err);
    throw new Error('Internal Server Error' + (err as Error).message)
  }
};

export async function getSearchProducts(query: string, sort: string, sortField: string, page: number) {
  const limit = 12;
  const search = query ? decodeURIComponent(query) : '';
  const sortOptions: { [key: string]: 1 | -1 } = {};
  if (sort && sortField) {
    const sortOrder = sort === "asc" ? 1 : -1;
    sortOptions[sortField] = sortOrder;
  } else {
    sortOptions['createdAt'] = -1; // Default sort by createdAt descending
  }
  try {
    await connectToDB();

    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments({
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ],
    });
    if (!totalProducts) {
      return JSON.parse(JSON.stringify({
        totalProducts
      }))
    }
    const totalPages = Math.ceil(totalProducts / limit);

    const searchedProducts = await Product.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } },
      ],
    })
      .select('-category -description -timestamps')
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
    throw new Error('Internal Server Error 500');
  }
};

export async function getProducts() {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .select("-category -description -timestamps")
      .limit(8);

    return JSON.parse(JSON.stringify(products))
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error('Internal Server Error 500');
  }
};

export async function getBestSellingProducts() {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ sold: -1, ratings: -1, createdAt: "desc" })
      .select("-category -description -timestamps")
      .limit(4);

    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.log("[products_GET]", err);
    throw new Error('Internal Server Error 500');

  }
};
export async function getProductDetails(slug: string) {
  try {
    await connectToDB();
    const product = await Product.findOne({ slug });
    if (!product) {
      return null;
    };
    return JSON.parse(JSON.stringify(product))

  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error' + (err as Error).message)

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
    }).select("-description -category -timestamps");
    return JSON.parse(JSON.stringify(relatedProducts))

  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error' + (err as Error).message)

  }
};
export async function getProductDetailsForSeo(slug: string) {
  try {
    await connectToDB();
    const regexPattern = slug.replace(/-/g, " ");
    const product = await Product.findOne({
      $or: [
        { title: { $regex: regexPattern, $options: 'i' } },  // Search by title with spaces
        { slug: { $regex: slug, $options: 'i' } }            // Search by exact or similar slug
      ]
    });
    if (!product) {
      return null;
    };
    return JSON.parse(JSON.stringify(product))
  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error' + (err as Error).message)

  }
};

export async function getProductReviews(productId: string, page: number) {
  try {
    const skip = (page - 1) * 4;
    await connectToDB();
    const reviews = await Review.find({ productId }).limit(4).skip(skip);


    return JSON.parse(JSON.stringify(reviews))
  } catch (err) {
    console.log("[productId_GET]", err);
    throw new Error('Internal Server Error' + (err as Error).message)

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

export async function getOrders(customerEmail: string, page: number) {
  try {
    await connectToDB();
    const limit = 6
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments({ customerEmail });
    if (!totalOrders) {
      return JSON.parse(JSON.stringify({
        totalOrders
      }))
    }
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await Order.find({
      customerEmail
    }).populate({ path: "products.product", model: Product }).sort({ createdAt: 'desc' }).limit(limit).skip(skip);

    return JSON.parse(JSON.stringify({
      orders,
      totalPages,
      totalOrders
    }))

  } catch (err) {
    console.log("[customerId_GET", err);
    throw new Error('Internal Server Error' + (err as Error).message)

  };
};


//for COD form & stripe webhook
export const stockReduce = async (products: OrderProductCOD[]) => {
  await connectToDB();
  for (let i = 0; i < products.length; i++) {
    const order = products[i];
    const product = await Product.findById(order.product);
    if (!product) throw new Error("Product Not Found");

    // Reduce the general product stock
    if (product.stock >= order.quantity) {
      product.stock -= order.quantity;
      product.sold += order.quantity;
    } else {
      console.error(`Not enough stock for product: ${order.product}`);
      throw new Error("Not enough stock for this Product");
    }

    // Find the matching variant
    if (order.size || order.color && order.variantId) {
      const variant = product.variants.find((v: Variant) => v._id!.toString() === order.variantId);
      if (!variant) throw new Error(`Variant not ${order.variantId} found for product: ${order.product}, size: ${order.size}, color: ${order.color}`);

      // Reduce the variant stock
      if (variant.quantity! >= order.quantity) {
        variant.quantity! -= order.quantity;
      } else {
        console.error(`Not enough stock for variant: ${order.product}, size: ${order.size}, color: ${order.color}`);
        throw new Error("Not enough stock for this variant");
      }
    }
    await product.save();

    revalidatePath('/');
    revalidatePath(`/products/${order.product}`);
  };
};

export async function getUser({
  email,
  provider,
  ip,
  userAgent,
  country,
  city,
  browser,
  device,
  os,
  isSigningUpUserWithCredientials = false,
}: {
  email: string
  provider: 'google' | 'github' | 'credentials' | 'none'
  ip: string
  userAgent: string
  country: string
  city: string
  browser: string
  device: string
  os: string
  isSigningUpUserWithCredientials?: boolean
}) {
  try {
    await connectToDB();
    const user = await Customer.findOne({ email });

    if (!user) {
      return null;
    }

    const providerMatches =
      (provider === 'google' && user.googleId) ||
      (provider === 'credentials' && user.password);
    //|| (provider === 'github' && user.githubid);


    if (isSigningUpUserWithCredientials) {
      if (providerMatches) {
        return user as User;
      }
      throw new Error('A user with this email already exists with another sign-in method');
    }

    if (!providerMatches) {
      throw new Error('Email already exists with a different sign-in method');
    }
    user.signInHistory.unshift({
      country,
      city,
      ip,
      browser,
      os,
      device,
      userAgent: userAgent || '',
      signedInAt: new Date(),
    });

    user.signInHistory = user.signInHistory.slice(0, 3);
    if (user.country?.trim().toLowerCase() === 'unknown' || user.country?.trim().toLowerCase() === 'localhost') {
      user.country = country;
    };
    if (user.city?.trim().toLowerCase() === 'unknown' || user.city?.trim().toLowerCase() === 'localhost') {
      user.city = city;
    };

    await user.save();

    return user as User;
  } catch (error) {
    const err = error as Error
    throw new Error(err.message)
  }
}

export async function createUser({ email,
  ip,
  hashedPassword,
  userAgent,
  country,
  city,
  browser,
  device,
  os,
  isSigningUpUserWithCredientials = false
}: {
  email: string,
  hashedPassword: string,
  ip: string,
  userAgent: string,
  country: string,
  city: string,
  browser: string,
  device: string,
  os: string,
  isSigningUpUserWithCredientials?: boolean
}) {
  try {

    const existingUser = await getUser({ email, provider: 'credentials', browser, city, country, ip, userAgent, os, device });


    if (existingUser) {
      return null;
    } else {
      const name = extractNameFromEmail(email);
      const user = await Customer.create({
        name: name,
        email: email,
        country: country.toLowerCase(),
        city: city.toLowerCase(),
        password: hashedPassword,
        image: `https://ui-avatars.com/api/?name=${name}`,
      })
      return user as User;
    }
  } catch (error) {
    console.log('creating User: ' + (error as Error).message);
    throw new Error('creating User: ' + (error as Error).message);
  }
}

