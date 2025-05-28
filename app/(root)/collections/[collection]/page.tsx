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
      site_name: 'Borcelle Next.js by anas ahmed',
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
          url: collectionDetails.image || 'fallback-image.jpg',
          width: 220,
          height: 250,
          alt: collectionDetails.title,
        },
      ],
      site_name: 'Borcelle Next.js by anas ahmed',
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
  const collectionDetails = await getCachedCollectionDetails(params.collection);
  if (!collectionDetails) return notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "CollectionPage",
            name: collectionDetails.title,
            description: collectionDetails.description,
            mainEntity: collectionDetails.products.map((product: ProductType) => ({
              "@type": "Product",
              name: product.title,
              description: product.description,
              image: product.media[0],
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: product.price,
              },
            })),
          }),
        }}
      />
      <div className="sm:px-3 min-h-[90vh] pys-12 sm:py-5  flex flex-col items-center gap-2">
        {/* {collectionDetails.image && <Image
          src={collectionDetails.image}
          width={1300}
          height={1000}
          alt="collection"
          className="w-full max-h-[500px] object-cover roudnded-xl"
        />} */}
        {/* <Banner
          heading={collectionDetails.title+' Collection'}
          text={collectionDetails.description}
          imgUrl={collectionDetails.image}
          shade=""
          textColor="#ffff"
          textPositionV="end"
          textPosition="end"
          link="#products"
          buttonText="Explore"
        /> */}
        {/* <p className="text-heading3-bold text-grey-2 capitalize">{collectionDetails.title}</p>
    <p className="text-body-normal text-grey-2 text-center max-w-[900px]">{collectionDetails.description}</p> */}
              <Breadcrumb/>
    
        <Sort />
        <Suspense fallback={<Loader />}>
          <CollectionProduct collectionId={collectionDetails._id} page={page} size={size} color={color} sort={sort} sortField={sortField} />
        </Suspense>
      </div>
    </>
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
      <PaginationControls totalPages={data.totalPages} currentPage={page}/>
    </>
  )
}

export default CollectionDetails;


