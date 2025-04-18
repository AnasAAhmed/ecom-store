import { getCollectionDetails, getCollectionDetailsForSeo } from "@/lib/actions/actions";
import { unSlugify } from "@/lib/utils/features";
import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";
import ProductList from "@/components/product/ProductList";

export const generateMetadata = async ({ params }: { params: { collection: string } }) => {
  const collectionDetails = await getCollectionDetailsForSeo(params.collection);
  if (!collectionDetails) return {
    title: `Borcelle | Collection Not Found 404`,
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
      title: `Borcelle | Collection Not Found 404`,
      description: 'There is no Collection at borcelle store by anas ahmed',
      url: `${process.env.ECOM_STORE_URL}/collections/${params.collection}`,
      images: [
        {
          url: '/logo.png',
          width: 220,
          height: 250,
          alt: '/logo.png',
        },
      ],
      site_name: 'Borcelle Next.js by anas ahmed',
    },
  };

  return {
    title: `Borcelle | ${unSlugify(params.collection)} `,
    description: 'This is the Collection of ' + params.collection+' at borcelle store by anas ahmed',
    keywords: [collectionDetails.title,'borcelle collection'+collectionDetails.title,'https://ecom-store-anas.com'],
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

const CollectionDetails = async ({
  params
}: {
  params: { collection: string }
}) => {
  const collectionDetails = await getCollectionDetails(params.collection);
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
      <div className="px-3 min-h-[90vh] py-12 sm:py-5  flex flex-col items-center gap-8">
        {collectionDetails.image && <Image
          src={collectionDetails.image}
          width={1300}
          height={1000}
          alt="collection"
          className="w-full object-cover rounded-xl"
        />}
        <p className="text-heading3-bold text-grey-2">{collectionDetails.title}</p>
        {collectionDetails.image && <p className="text-body-normal text-grey-2 text-center max-w-[900px]">{collectionDetails.description}</p>}       
        <div className="flex flex-wrap justify-center gap-16">
        <ProductList isViewAll={false} heading="Our Top Selling Products" Products={collectionDetails.products} />

      </div>
      </div>
    </>
  );
};

export default CollectionDetails;

export const dynamic = "force-dynamic";

