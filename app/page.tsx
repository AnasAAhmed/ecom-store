import Banner from "@/components/ui/Banner";
import Collections from '@/components/Collections';
import ProductList from '@/components/product/ProductList';
import BlogSection from "@/components/ui/BlogSection";
import Social from "@/components/ui/Social";
import GroupComponent7 from "@/components/ui/Services";
import { Fragment, Suspense } from "react";
import { ffallBackHomeData, unSlugify } from "@/lib/utils/features";
import { getCollectionProducts, getCollections } from "@/lib/actions/collection.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getCachedHomePageData } from "@/lib/actions/cached";
import StoreFeatures from "@/components/ui/StoreFeatures";
import SliderList from "@/components/product/SliderList";
import Loader from "@/components/ui/Loader";
import FYProdcutList from "@/components/product/FYProdcutList";
import RecentlyViewed from "@/components/product/RecentlyViewed";


export async function generateMetadata() {
  const homeData = await getCachedHomePageData();

  if (!homeData?.seo) {
    return null;
  }
  return {
    title: homeData.seo.title || "Borcelle: Online Store for Men's and Women's Clothing",
    description: homeData.seo.desc || "Shop high-quality products at Borcelle professinaol spa website in nextjs mongodb Tcs Courier api. By Anas Ahmed Gituhb:https://github.com/AnasAAhmed",
    keywords: homeData.seo.keywords || ['Borcelle', 'Anas Ahmed', 'Ecommerce', "professional ecommerce site in nextjs", 'mongodb', 'SPA Ecommerce', 'TCS courier APIs'],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    openGraph: {
      title: homeData.seo.title || "Borcelle: Online Store for Men's and Women's Clothing",
      description: homeData.seo.desc || "Shop high-quality products at Borcelle professinaol spa website in nextjs mongodb Tcs Courier api. By Anas Ahmed Gituhb:https://github.com/AnasAAhmed",
      url: `${process.env.ECOM_STORE_URL}`,
      images: [
        {
          url: homeData.seo.url || '/home-preview.webp',
          width: homeData.seo.width || 250,
          height: homeData.seo.height || 200,
          alt: homeData.seo.alt || 'home-preview',
        },
      ],
      site_name: 'Borcelle',
    },
  };
}

export const dynamic = 'force-static';

export default async function Home() {

  const homeData = await getCachedHomePageData();
  const homePageData = homeData ?? ffallBackHomeData;

  return (
    <Fragment>

      <Banner
        isHero
        smAspectRatio="aspect-[4/6]"
        imgUrl={homePageData.hero[0].imgUrl}
        mobImgUrl={homePageData.hero[0].mobImgUrl}
        size={homePageData.hero[0].size}
        video={homePageData.hero[0].video}
        shade={homePageData.hero[0].shade}
        layout={homePageData.hero[0].layout}
        imageContent={homePageData.hero[0].imageContent}
      />

      <Collections collections={homePageData?.collectionList! || []} />

      <Suspense fallback={<div className="flex flex-col flex-wrap items-center justify-center gap-5">
        <div className='h-7 w-36 bg-gray-200 animate-pulse' />
        <div className='h-5 w-96 bg-gray-200 animate-pulse' />
        <div className="flex flex-wrap justify-center gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[22rem] w-64 bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>}>
        {/* <ProductListSection /> */}
      </Suspense>

      <section className='mt-12 '>
        <article className='w-full my-5'>
          {homePageData.collections.filter(i => i.isRow !== false).map((i, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gapd-6 items-stretch msy-8"
            >
              <div
                className={`relative w-full ${idx % 2 === 1 ? "md:order-2" : "md:order-1"
                  } aspect-[4/3] md:h-full`}
              >
                <Banner
                  imgUrl={i.imgUrl}
                  mobImgUrl={i.mobImgUrl}
                  size={i.size}
                  video={i.video}
                  layout={i.layout}
                  shade={i.shade}
                  imageContent={i.imageContent}
                />
              </div>
              <div
                className={`w-full bg-slate-50 ${idx % 2 === 1 ? "md:order-1" : "md:order-2"
                  } flex flex-col justify-center sm:px-6`}
              >
                {/* <Suspense fallback={<Loader />}>
                  <CollectionProduct
                    collectionTitle={i.imageContent!.link!.slice(13)}
                    collectionId={i.collectionId}
                  />
                </Suspense> */}
              </div>
            </div>
          ))}
        </article >
        <br />

        {/* CSR Compo */}
        <FYProdcutList />

        <br />
        {homePageData.collections.length > 0 && homePageData.collections.filter(i => i.isRow === false).map((i, idx) => (
          <Fragment key={idx}>
            <Banner
              imgUrl={i.imgUrl}
              mobImgUrl={i.mobImgUrl}
              size={i.size}
              video={i.video}
              layout={i.layout}
              shade={i.shade}
              imageContent={i.imageContent}
            />

            {/* <Suspense fallback={<Loader />}>
              <CollectionProduct collectionTitle={i.imageContent!.link!.slice(13)} collectionId={i.collectionId} />
            </Suspense> */}
          </Fragment>
        ))}
        <br />
        <RecentlyViewed />
      </section>
      <BlogSection />

      <StoreFeatures />
      <GroupComponent7
        freeDeliveryHeight="unset"
        freeDeliveryDisplay="unset"
        daysReturnHeight="unset"
        daysReturnDisplay="unset"
        securePaymentHeight="unset"
        securePaymentDisplay="unset"
      />
      <Social />

    </Fragment>
  );
};

async function CollectionProduct({ collectionTitle, collectionId }: { collectionTitle: string; collectionId: string }) {
  const products: ProductType[] | string = await getCollectionProducts(collectionId);
  if (typeof products === 'string') return products;
  return (
    <SliderList Products={products} />
  )
}

async function ProductListSection() {
  const products: ProductType[] | string = await getProducts();
  if (typeof products === 'string') return products;
  return (
    <ProductList heading="New Arrivals" text="Be the first to shop our latest drops and fresh styles." Products={products} />
  )
}


// 172800

