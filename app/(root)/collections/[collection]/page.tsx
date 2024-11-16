import ProductCard from "@/components/product/ProductCard";
import { getCollectionDetails } from "@/lib/actions/actions";
import { unSlugify } from "@/lib/utils/features";
import { notFound } from "next/navigation";
import React from "react";
import Image from "next/image";

export const generateMetadata = async ({ params }: { params: { collection: string } }) => {
  return {
    title: `Borcelle | ${unSlugify(params.collection)} `,
    productId: 'This is the Collection of ' + params.collection,
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
      <div className="px-3 sm:px-10 py-5 flex flex-col items-center gap-8">
        {collectionDetails.image && <Image
          src={collectionDetails.image}
          width={1300}
          height={1000}
          alt="collection"
          className="w-full object-cover rounded-xl"
        />}
        <p className="text-heading3-bold text-grey-2">{collectionDetails.title}</p>
        {collectionDetails.image && <p className="text-body-normal text-grey-2 text-center max-w-[900px]">{collectionDetails.description}</p>}        <div className="flex flex-wrap gap-16 justify-center  min-h-[90vh]">
          {collectionDetails.products.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default CollectionDetails;

export const dynamic = "force-dynamic";

