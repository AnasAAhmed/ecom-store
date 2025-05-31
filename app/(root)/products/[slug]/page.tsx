import { Suspense } from "react";
import Gallery from "@/components/product/Gallery";
import ProductInfo from "@/components/product/ProductInfo";
import PaginationControls from "@/components/PaginationControls";
import { notFound } from "next/navigation";
import { getProductReviews, getRelatedProduct } from "@/lib/actions/product.actions";
import ProductReviews from "@/components/product/ProductReviews";
import ProductList from "@/components/product/ProductList";
import { getCachedProductDetails } from "@/lib/actions/cached";
import Breadcrumb from "@/components/BreadCrumb";
import { unSlugify } from "@/lib/utils/features";
import { ChevronDown } from "lucide-react";


export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await getCachedProductDetails(params.slug);
console.log('prefetch is fetching data please stop it ......');

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

export default async function ProductPage(
  
  props: { params: Promise<{ slug: string }>, searchParams: Promise<{ page: string }> }
) {
  const searchParams = await props.searchParams;
console.log('prefetch is fetching data please stop it ......');

  const params = await props.params;
  const product: ProductType = await getCachedProductDetails(params.slug);
  if (!product) return notFound();

  return (
    <main className="mx-auto max-w-7xl space-y-3 py-s5">
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
              price: product.price,
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

      <section className="flex px-5 justify-center items-start gap-16 max-lg:flex-col max-lg:items-center">
        <Gallery productMedia={product.media} />

        <ProductInfo productInfo={product} />
      </section>
      {product.detailDesc && (
        <details className="w-full max-wd-2xl border-y border-gray-200 rounded overflow-hidden transition-all duration-300 open:shadow-md">
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
      )}

      {/* <hr /> */}
      <Suspense fallback={<div className="flex flex-wrap justify-center gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[22rem] w-64 bg-gray-200 animate-pulse" />
        ))}
      </div>}>
        <RelatedProducts category={product.category} collections={product.collections} productId={product._id} />
      </Suspense>
      <div className="space-y-5 px-5">
        <h2 className="text-2xl font-bold">Buyer Reviews</h2>
        <Suspense fallback={<div className="h-40 bg-gray-200 animate-pulse" />}>
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
    <>
      <div className="space-y-5">
        <h2 className="text-2xl font-bold px-5">Related Products</h2>
        <ProductList Products={relatedProducts} />
      </div>
      <hr />
    </>
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
      <PaginationControls isScrollToTop={false} totalPages={Math.ceil(numOfReviews / 6)} currentPage={page} />

    </section>
  );
}
