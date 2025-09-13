import { Suspense } from "react";
import ProductInfo from "@/components/product/ProductInfo";
import PaginationControls from "@/components/PaginationControls";
import { notFound } from "next/navigation";
import { getProductReviews, getRelatedProduct } from "@/lib/actions/product.actions";
import ProductList from "@/components/product/ProductList";
import { getCachedProductDetails } from "@/lib/actions/cached";
import Breadcrumb from "@/components/BreadCrumb";
import { unSlugify } from "@/lib/utils/features";
import { ChevronDown } from "lucide-react";
import ImageZoom from "@/components/product/ImageZoom";
import Image from "next/image";
import ReviewForm from "@/components/product/ReviewForm";
import StarRatings from "@/components/product/StarRatings";
import DeleteReviews from "@/components/product/ProductReviews";
import { calculateTimeDifference } from "@/lib/utils/features.csr";


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
          width: 220,
          height: 250,
          alt: '404 Not Found',
        },
      ],
      site_name: 'Borcelle Next.js by anas ahmed',
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
          width: 220,
          height: 250,
          alt: product.title,
        },
      ],
      site_name: 'Borcelle Next.js by anas ahmed',
    },
  };
}

export default async function ProductPage(

  props: { params: Promise<{ slug: string }>, searchParams: Promise<{ page: string }> }
) {
  const searchParams = await props.searchParams;

  const params = await props.params;
  const product: ProductType = await getCachedProductDetails(params.slug);
  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-7xl py-s5">
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
              "@type": "AggregateOffer",
              availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              priceCurrency: "USD",
              highPrice: product.price,
              lowPrice: product.expense || 0,
              offerCount: 5,
              price: product.price,
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
      <Breadcrumb />

      <section className="flex mb-12 px-5 justify-center items-start gap-16 max-md:flex-col max-md:items-center">
        <div className=" md:sticky top-0 flex flex-col gap-3">
          <Image
            placeholder="blur"
            blurDataURL="/fallback.avif"
            src={product.media[0]}
            alt={product.title}
            width={500}
            height={500}
            className="w-full rounded-lg md:hidden md:h-[500px] h-[300px] object-cover" />
          <ImageZoom allSrc={product.media} alt={product.title} />
        </div>
        <ProductInfo productInfo={product} />
      </section>
      {product.detailDesc && (
        <>
          <details className="w-full max-w-2xl border-y border-gray-200 rounded overflow-hidden transition-all duration-300 open:shadow-md">
            <summary className="px-4 py-3 text-start text-base font-medium cursor-pointer select-none relative hover:bg-gray-50 transition-colors">
              Product Detail
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-open:rotate-180">
                <ChevronDown />
              </span>
            </summary>
            <div
              className="px-4 py-3 text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.detailDesc }}
            />
          </details>
          <hr />
        </>
      )}

      <Suspense fallback={
        <div className="flex flex-wrap justify-center gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[22rem] w-64 bg-gray-200 animate-pulse" />
          ))}
        </div>
      }>
        <hr />
        <RelatedProducts category={product.category} collections={product.collections} productId={product._id} />
      </Suspense>
      <Suspense fallback={<div className="h-40 bg-gray-200 animate-pulse" />}>
        <ProductReviewsSection numOfReviews={product.numOfReviews} productId={product._id} page={Number(searchParams.page) || 1} />
      </Suspense>

    </main>
  );
}

async function RelatedProducts({ category, collections, productId }: { category: string, collections: string[], productId: string }) {
  const relatedProducts: ProductType[] = await getRelatedProduct(productId, category, collections);

  if (!relatedProducts.length) return null;

  return (
    <section className="space-y-5 my-12">
      <h1 className="text-2xl font-bold px-5">Related Products</h1>
      <ProductList Products={relatedProducts} />
    </section>

  );
}

async function ProductReviewsSection({ numOfReviews, productId, page }: { numOfReviews: number, productId: string, page: number }) {
  const reviews: ReviewType[] = await getProductReviews(productId, page);

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
