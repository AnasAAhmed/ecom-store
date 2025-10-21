import { Suspense } from "react";
import ProductInfo from "@/components/product/ProductInfo";
import PaginationControls from "@/components/PaginationControls";
import { notFound } from "next/navigation";
import { getProductReviews, getRelatedProduct } from "@/lib/actions/product.actions";
import ProductList from "@/components/product/ProductList";
import { getCachedProductDetails } from "@/lib/actions/cached";
import remarkGfm from "remark-gfm";
import Breadcrumb from "@/components/BreadCrumb";
import { unSlugify } from "@/lib/utils/features";
import { ChevronDown } from "lucide-react";
import ImageZoom from "@/components/product/ImageZoom";
import ReviewForm from "@/components/product/ReviewForm";
import StarRatings from "@/components/product/StarRatings";
import DeleteReviews from "@/components/product/ProductReviews";
import { calculateTimeDifference } from "@/lib/utils/features.csr";
import { ProductSignals } from "@/components/product/ProductInteractivity";
import { unstable_cache } from "next/cache";
import MarkDown from 'react-markdown'
import SliderList from "@/components/product/SliderList";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await getCachedProductDetails(params.slug);

  if (!product) return {
    title: "Product 404 Not Found | Borcelle",
    description: "No such product exists at borcelle store by anas ahmed",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: `Product Not Found 404 | Borcelle`,
      description: 'There is no Product at borcelle store by anas ahmed',
      url: `${process.env.ECOM_STORE_URL}/products/${params.slug}`,
      images: [
        {
          url: '/404.png',
          width: 1024,
          height: 768,
          alt: '404 Not Found',
        },
      ],
      site_name: 'Borcelle',
    },
  };

  return {
    title: `${unSlugify(product.title)} | Borcelle`,
    description: product.description || "Shop high-quality products at Borcelle.",
    keywords: product.tags?.join(', ') ?? '',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: `${unSlugify(product.title)} | Borcelle`,
      description: product.description || "Shop high-quality products at Borcelle.",
      url: `${process.env.ECOM_STORE_URL}/products/${params.slug}`,
      images: [
        {
          url: product.media[0] || 'fallback-banner.avif',
          width: 1024,
          height: 768,
          alt: product.title,
        },
      ],
      site_name: 'Borcelle',
    },
  };
}

export default async function ProductPage(

  props: { params: Promise<{ slug: string }>, searchParams: Promise<{ page: string }> }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const getProductDetailsData = unstable_cache(
    async () => {
      return await getCachedProductDetails(params.slug)
    },
    [`product/${params.slug}`],
    { revalidate: 86400, tags: [`product/${params.slug}`] } // 1 days
  );

  const product: ProductType | null = await getProductDetailsData();
  if (!product) return notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.title,
            description: product.description,
            sku: product._id,
            brand: {
              "@type": "Brand",
              name: "Borcelle"
            },
            url: `https://ecom-store-anas.vercel.app/products/${product.slug}`,
            image: product.media[0],
            offers: {
              "@type": "Offer",
              priceCurrency: "USD",
              price: product.price,
              availability: product.stock > 0
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              url: `${process.env.ECOM_STORE_URL}/products/${product.slug}`,
            },
            review: {
              "@type": "Review",
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": 4,
                "bestRating": 5
              },
              "author": {
                "@type": "Person",
                "name": "Anas Ahmed"
              }
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.ratings,
              reviewCount: product.numOfReviews,
            },
            keywords: product.tags?.join(', ') ?? '',
          }),
        }}
      />
      <Breadcrumb className="sm:mt-24 mt-14" />
      <ProductSignals product={product} />
      <section className="flex mb-12 px-5 justify-center items-start gap-16 max-md:flex-col max-md:items-center">
        <div className=" md:sticky top-0 flex flex-col gap-3">
          <ImageZoom allSrc={product.media} alt={product.title} />
        </div>
        <ProductInfo productInfo={product} />
      </section>
      {product.detailDesc && (
        // <>
        <details className="w-full border-y border-gray-200 rounded overflow-hidden transition-all duration-300 open:shadow-md">
          <summary className="px-4 py-3 text-start text-base font-medium cursor-pointer select-none relative hover:bg-gray-50 transition-colors">
            Product Detail
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-open:rotate-180">
              <ChevronDown />
            </span>
          </summary>
          <div className="prose max-w-none w-full flex flex-col text-start items-start px-5 sm:px-10">
            <MarkDown
              remarkPlugins={[remarkGfm]}>
              {product.detailDesc}
            </MarkDown>
          </div>
        </details>

      )}

      <Suspense fallback={
        <div className="flex flex-col flex-wrap items-center justify-center gap-5">
          <div className='h-7 w-36 bg-gray-200 animate-pulse' />
          <div className="flex flex-wrap justify-center gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[22rem] w-64 bg-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      }>
        <hr />
        <RelatedProducts category={product.category} collections={product.collections} productId={product._id} />
      </Suspense>
      <Suspense fallback={<div className="h-40 bg-gray-200 animate-pulse" />}>
        <ProductReviewsSection numOfReviews={product.numOfReviews} productId={product._id} page={Number(searchParams.page) || 1} />
      </Suspense>

    </>
  );
}

async function RelatedProducts({ category, collections, productId }: { category: string, collections: string[], productId: string }) {

  const getCachedRelatedProduct = unstable_cache(
    async () => {
      return await getRelatedProduct(productId, category, collections);
    },
    [`related-products-${productId}-${category}-${collections.join('-')}`],
    {
      revalidate: 259200, // 3 days
      tags: [`related-products-${productId}-${category}-${collections.join('-')}`],
    }
  );


  const relatedProducts: ProductType[] = await getCachedRelatedProduct();

  if (!relatedProducts.length) return null;

  return (
    <SliderList heading="Related Products" Products={relatedProducts} />
  );
}

async function ProductReviewsSection({ numOfReviews, productId, page }: { numOfReviews: number, productId: string, page: number }) {

  let reviews: ReviewType[];

  if (page === 1) {
    // Cache only the first page
    const getCachedProductReviews = unstable_cache(
      async () => {
        return await getProductReviews(productId, page);
      },
      [`product-reviews-${productId}-page1`],
      { revalidate: 604800, tags: [`product-reviews-${productId}`] } // 7 days
    );

    reviews = await getCachedProductReviews();
  } else {
    //  Skip cache for other pages
    reviews = await getProductReviews(productId, page);
  }

  if (!reviews.length) return null;

  return (
    <section id="reviews" className="my-5"><hr />
      <div className="container mxs-auto p-4 max-ws-2xl">
        <h1 className="text-2xl font-semibold my-3 text-gray-900">
          Reviews ({numOfReviews})
        </h1>

        <div className="mb-8">
          <ReviewForm productId={productId} />
        </div>
        {reviews && reviews.length > 0 ? (
          <ul className="flex flex-col gap-6">
            {reviews.map((review, index) => (
              <li key={index} className="border-b pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={review.photo}
                    alt={review.name}
                    className="rounded-full h-10 w-10 object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{review.name}</p>
                    <StarRatings rating={review.rating} />
                  </div>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                  {review.comment}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {calculateTimeDifference(review.createdAt)}
                  </span>
                  <DeleteReviews productId={productId} reviewRating={review.rating} reviewUserId={review.userId} reviewId={review._id} reviewComment={review.comment} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-base">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>
      <PaginationControls isScrollToTop={false} totalPages={Math.ceil(numOfReviews / 6)} currentPage={page} />
    </section>
  );
}
