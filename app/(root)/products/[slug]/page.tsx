import { Suspense } from "react";
import Gallery from "@/components/product/Gallery";
import ProductInfo from "@/components/product/ProductInfo";
import PaginationControls from "@/components/PaginationControls";
import { notFound } from "next/navigation";
import { getProductDetails, getProductDetailsForSeo, getProductReviews, getRelatedProduct } from "@/lib/actions/actions";
import ProductReviews from "@/components/product/ProductReviews";
import ProductList from "@/components/product/ProductList";

function RelatedProductsLoadingSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[22rem] w-64 bg-gray-200 animate-pulse" />
      ))}
    </div>
  );
}

function ProductReviewsLoadingSkeleton() {
  return <div className="h-40 bg-gray-200 animate-pulse" />;
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductDetailsForSeo(params.slug);

  if (!product) notFound();

  return {
    title: `${product.title} | Borcelle`,
    description: product.description || "Shop high-quality products at Borcelle.",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: `${product.title} | Borcelle`,
      description: product.description || "Shop high-quality products at Borcelle.",
      url: `${process.env.ECOM_STORE_URL}/products/${params.slug}`,
      images: [
        {
          url: product.media[0] || 'fallback-image.jpg',
          width: 220,
          height: 250,
          alt: product.title,
        },
      ],
      site_name: 'Borcelle Next.js by anas ahmed',
    },
  };
}

export default async function ProductPage({ params, searchParams }: { params: { slug: string }, searchParams: { page: string } }) {
  const product: ProductType = await getProductDetails(params.slug);
  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-10 py-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.title,
            description: product.description,
            image: product.media[0],
            offers: {
              "@type": "AggregateOffer",
              availability: product.stock > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              priceCurrency: "USD",
              price: product.price,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: product.ratings,
              reviewCount: product.numOfReviews,
            },
          }),
        }}
      />
      <section className="flex px-5 justify-center items-start gap-16 max-lg:flex-col max-lg:items-center">
        <Gallery productMedia={product.media} />
        <ProductInfo productInfo={product} />
      </section>

      <hr />
      <Suspense fallback={<RelatedProductsLoadingSkeleton />}>
        <RelatedProducts category={product.category} collections={product.collections} productId={product._id} />
      </Suspense>

      <hr />

      <div className="space-y-5 px-5">
        <h2 className="text-2xl font-bold">Buyer Reviews</h2>
        <Suspense fallback={<ProductReviewsLoadingSkeleton />}>
          <ProductReviewsSection numOfReviews={product.numOfReviews} productId={product._id} page={Number(searchParams.page) || 1} />
        </Suspense>
      </div>

    </main>
  );
}

async function RelatedProducts({ category, collections, productId }: { category: string, collections: string[], productId: string }) {
  const relatedProducts: ProductType[] = await getRelatedProduct(productId, category, collections);

  if (!relatedProducts.length) return null;

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold px-5">Related Products</h2>
      <ProductList Products={relatedProducts} />
    </div>
  );
}

async function ProductReviewsSection({ numOfReviews, productId, page }: { numOfReviews: number, productId: string, page: number }) {
  const reviews: ReviewType[] = await getProductReviews(productId, page);

  return (
    <section className="my-5">
      <ProductReviews
        productReviews={reviews}
        productId={productId}
        numOfReviews={numOfReviews}
      />
      <PaginationControls isScrollToTop={false} totalPages={numOfReviews / 4} currentPage={page} />

    </section>
  );
}
