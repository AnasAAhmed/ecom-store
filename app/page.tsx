import Banner from "@/components/ui/Banner";
import { getBestSellingProducts, getCollections, getProducts } from "@/lib/actions/actions";
import Collections from '@/components/Collections';
import ProductList from '@/components/product/ProductList';
import BlogSection from "@/components/ui/BlogSection";
import Social from "@/components/ui/Social";
import GroupComponent7 from "@/components/ui/Services";
import { Suspense } from "react";


//Rendering with SSR Streeaming

function ProductsLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <h3 className="text-heading3-bold sm:text-heading2-bold">Loading Products...</h3>
      <div className="flex flex-wrap justify-center gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[22rem] w-64 bg-gray-200 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function CollectionsSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center mb-8 gap-8">
      <p className="text-heading2-bold sm:text-heading1-bold">Collections</p>
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="h-[150px] w-[250px] bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-[150px] w-[250px] bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-[150px] w-[250px] bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-[150px] w-[250px] bg-gray-200 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};


export default async function Home() {

  return (
    <>
      <Banner
        heading="Elevate Your Style"
        text=" Discover the latest trends in fashion with our new collection."
        imgUrl={'/banner2.avif'}
        shade=""
        textColor="#3d3c38"
        link="/search"
        buttonText="Shop"
      />

      <Suspense fallback={<CollectionsSkeleton />}>
        <CollectionsList />
      </Suspense>

      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <LatestProductsList />
      </Suspense>

      <Banner
        heading="Summer Collection 2024"
        text="Embrace the warmth with our stylish and comfortable summer wear"
        imgUrl={'/banner2.png'}
        shade="gray"
        textColor="white"
        link="/search?query=summer"
        buttonText="Shop Now"
      />

      <Suspense fallback={<ProductsLoadingSkeleton />}>
        <BestSellingProducts />
      </Suspense>

      <BlogSection />

      <Social />

      <GroupComponent7
        freeDeliveryHeight="unset"
        freeDeliveryDisplay="unset"
        daysReturnHeight="unset"
        daysReturnDisplay="unset"
        securePaymentHeight="unset"
        securePaymentDisplay="unset"
      />
    </>
  );
}

async function CollectionsList() {
  const collections: CollectionType[] = await getCollections();

  if (!collections.length) return null;

  return (
    <Collections collections={collections} />

  );
};

async function LatestProductsList() {
  const latestProducts: ProductType[] = await getProducts();

  if (!latestProducts.length) return null;

  return (
    <ProductList heading="Latest Products" Products={latestProducts} />
  );
};

async function BestSellingProducts() {
  const bestSellingProducts: ProductType[] = await getBestSellingProducts();

  if (!bestSellingProducts.length) return null;

  return (
    <ProductList heading="Our Top Selling Products" Products={bestSellingProducts} />
  );
};