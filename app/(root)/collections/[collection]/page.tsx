import { collectionProducts } from "@/lib/actions/collection.actions";
import { unSlugify } from "@/lib/utils/features";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import ProductList from "@/components/product/ProductList";
import Loader from "@/components/ui/Loader";
import Sort from "@/components/Sort";
import PaginationControls from "@/components/PaginationControls";
import { getCachedCollectionDetails } from "@/lib/actions/cached";
import Breadcrumb from "@/components/BreadCrumb";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import Banner from "@/components/ui/Banner";
import FilterBadges from "@/components/ui/FiltersUi";

export const generateMetadata = async (props: { params: Promise<{ collection: string }> }) => {
  const params = await props.params;
  const collectionDetails = await getCachedCollectionDetails(params.collection);
  if (!collectionDetails) return {
    title: `Collection Not Found 404 | Borcelle`,
    description: 'There is no Collection at borcelle store by anas ahmed',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: `Collection Not Found 404 | Borcelle`,
      description: 'There is no Collection at borcelle store by anas ahmed',
      url: `${process.env.ECOM_STORE_URL}/collections/${params.collection}`,
      images: [
        {
          url: '/404.png',
          width: 220,
          height: 250,
          alt: '404 Not Found',
        },
      ],
      site_name: 'Borcelle',
    },
  };

  return {
    title: `${unSlugify(params.collection)} | Borcelle`,
    description: 'This is the Collection of ' + params.collection + ' at borcelle store by anas ahmed',
    keywords: [collectionDetails.title, 'borcelle collection' + collectionDetails.title, 'https://ecom-store-anas.com'],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: `${collectionDetails.title} | Borcelle`,
      description: collectionDetails.description || "Shop high-quality products at Borcelle.",
      url: `${process.env.ECOM_STORE_URL}/products/${params.collection}`,
      images: [
        {
          url: collectionDetails.image || 'fallback-banner.avif',
          width: 1280,
          height: 720,
          alt: collectionDetails.title,
        },
      ],
      site_name: 'Borcelle',
    },
  };
};
// params: { collection: string }

const CollectionDetails = async (
  props: { searchParams: Promise<any>; params: Promise<{ collection: string }> }
) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const sort = (searchParams?.order as string) || '';
  const color = (searchParams?.color as string) || '';
  const size = (searchParams?.size as string) || '';
  const sortField = (searchParams?.field as string) || '';
  let page = Number(searchParams?.page) || 1;
  const getCollectionDetailsData = unstable_cache(
    async () => {
      return await getCachedCollectionDetails(params.collection)
    },
    [`collections/${params.collection}`],
    { revalidate: 604800, tags: [`collections/${params.collection}`] } // 7 days
  );
  const collectionDetails = await getCollectionDetailsData();
  if (!collectionDetails) return notFound();

  return (
    <div className="mt-[4rem] sm:mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "CollectionPage",
            name: collectionDetails.title,
            description: collectionDetails.description,
            image: collectionDetails.image,
            // mainEntity: collectionDetails.products.map((product: ProductType) => ({
            //   "@type": "Product",
            //   name: product.title,
            //   description: product.description,
            //   sku: product._id,
            //   brand: {
            //     "@type": "Brand",
            //     name: "Borcelle"
            //   },
            //   url: `https://ecom-store-anas.vercel.app/products/${product.slug}`,
            //   image: product.media[0],
            //   offers: {
            //     "@type": "AggregateOffer",
            //     availability: product.stock > 0
            //       ? 'https://schema.org/InStock'
            //       : 'https://schema.org/OutOfStock',
            //     priceCurrency: "USD",
            //     highPrice: product.price,
            //     lowPrice: product.expense || 0,
            //     offerCount: 5,
            //     price: product.price,
            //   },
            //   review: {
            //     "@type": "Review",
            //     "reviewRating": {
            //       "@type": "Rating",
            //       "ratingValue": 4,
            //       "bestRating": 5
            //     },
            //     "author": {
            //       "@type": "Person",
            //       "name": "Anas Ahmed"
            //     }
            //   },
            //   aggregateRating: {
            //     "@type": "AggregateRating",
            //     ratingValue: product.ratings,
            //     reviewCount: product.numOfReviews,
            //   },
            //   keywords: product.tags?.join(', ') ?? '',
            // })),
          }),
        }}
      />
      <Banner
        imgUrl={collectionDetails.image}
        shade={{ color: 'black', position: "top" }}
        size="small"
        smAspectRatio="aspect-video"
        imageContent={{
          // text: collectionDetails.description,
          heading: collectionDetails.title + ` (${collectionDetails.productCount})`,
          contentPositionV: 'center',
          textColor: 'lightgray',
          font: 'monospace'
        }}
        layout={{
          padding: { left: '1rem', right: '1rem' },
          imagePosition: 'top'
        }}
      />
      <div className="min-h-[90vh] flex flex-col itemss-center">
        <Breadcrumb />
        <div className="max-sm:ml-3 px-3 sm:px-10">
          <Sort isCollectionPage />
          <FilterBadges isCollection/>
        </div>
        <Suspense fallback={<Loader />}>
          <CollectionProduct collectionId={collectionDetails._id} page={page} size={size} color={color} sort={sort} sortField={sortField} />
        </Suspense>
      </div>
    </div>
  );
};

type CPs = {
  collectionId: String;
  page: number;
  size?: string;
  color?: string;
  sort?: string;
  sortField?: string
}
type CPSR = {
  products: ProductType[], total: number, currentPage: string, totalPages: number
} | string;
async function CollectionProduct({ collectionId, page, size, color, sort, sortField }: CPs) {
  const data: CPSR = await collectionProducts({ collectionId, page, size, color, sort, sortField });
  if (typeof data === 'string') return data;
  return (
    <>
      <ProductList heading='' isViewAll={false} Products={data.products} />
      <PaginationControls totalPages={data.totalPages} currentPage={page} />
    </>
  )
}

export default CollectionDetails;


