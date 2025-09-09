import Banner from "@/components/ui/Banner";
import Collections from '@/components/Collections';
import ProductList from '@/components/product/ProductList';
import BlogSection from "@/components/ui/BlogSection";
import Social from "@/components/ui/Social";
import GroupComponent7 from "@/components/ui/Services";
import { Fragment, Suspense } from "react";
import { fallbackHomeData, unSlugify } from "@/lib/utils/features";
import { getCollectionProducts, getCollections } from "@/lib/actions/collection.actions";
import { getBestSellingProducts, getProducts } from "@/lib/actions/product.actions";
import { getCachedHomePageData } from "@/lib/actions/cached";
import StoreFeatures from "@/components/ui/StoreFeatures";
import SliderList from "@/components/product/SliderList";
import Loader from "@/components/ui/Loader";
import Image from "next/image";

export const dynamic = 'force-static';

export async function generateMetadata() {
  const homeData = await getCachedHomePageData();
  console.log('generateMetadata func hits', homeData?.hero.imgUrl);

  if (!homeData?.seo) {
    return null;
  }
  return {
    title: homeData.seo.title || 'Borcelle store',
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
      title: homeData.seo.title || 'Borcelle store',
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
      site_name: 'Borcelle Next.js by anas ahmed',
    },
  };
}

export default async function Home() {

  const [collections, products, bestSelling, homePage] = await Promise.all([
    getCollections(),
    getProducts(),
    getBestSellingProducts(),
    getCachedHomePageData()
  ]);
  const homePageData = homePage ?? fallbackHomeData;
  return (
    <Fragment>
      <Banner
        heading={homePageData.hero.heading!}
        text={homePageData.hero.text!}
        imgUrl={homePageData.hero.isVideo ? '' : homePageData.hero.imgUrl}
        videoUrl={homePageData.hero.isVideo ? homePageData.hero.imgUrl : ''}
        shade={homePageData.hero.shade!}
        textColor={homePageData.hero.textColor!}
        link={homePageData.hero.link}
        buttonText={homePageData.hero.buttonText}
      />

      <Collections collections={collections} />

      <SliderList heading="New Arrivals" text="Be the first to shop our latest drops and fresh styles." Products={products} />

      {/* <ProductList heading="Latest Products" Products={products} /> */}
      <section className='mt-12 '>
        <article className='w-full my-5'>
          {homePageData.collections.slice(0, 2).map((i, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-2 gapd-6 items-stretch msy-8"
            >
              <div
                className={`relative w-full ${idx % 2 === 1 ? "md:order-2" : "md:order-1"
                  } aspect-[4/3] md:h-full`}
              >
                <Image
                  src={i.imgUrl}
                  alt={i.heading || i.link.slice(13) + " Collection"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div
                className={`w-full bg-slate-50 ${idx % 2 === 1 ? "md:order-1" : "md:order-2"
                  } flex flex-col justify-center sm:px-6`}
              >
                <Suspense fallback={<Loader />}>
                  <CollectionProduct
                    collectionTitle={i.link.slice(13)}
                    collectionId={i.collectionId}
                  />
                </Suspense>
              </div>
            </div>
          ))}
        </article >
        <br />

        <SliderList heading="Don’t Miss Out" text="These trending products are flying off the shelves. Get yours before they’re gone!" Products={bestSelling} />

        <br />
        {homePageData.collections.length > 2 && homePageData.collections.slice(2).map((i, idx) => (
          <Fragment key={idx}>
            <Banner
              heading={i.heading}
              text={i.text}
              imgUrl={i.isVideo ? '' : i.imgUrl}
              videoUrl={i.isVideo ? i.imgUrl : ''}
              shade={i.shade}
              textColor={i.textColor}
              textPositionV={i.textPosition || 'end'}
              link={i.link}
              buttonText={i.buttonText}
            />

            <Suspense fallback={<Loader />}>
              <CollectionProduct collectionTitle={i.link.slice(13)} collectionId={i.collectionId} />
            </Suspense>
          </Fragment>
        ))}
      </section>
      <BlogSection />

      <StoreFeatures />

      <Social />

      <GroupComponent7
        freeDeliveryHeight="unset"
        freeDeliveryDisplay="unset"
        daysReturnHeight="unset"
        daysReturnDisplay="unset"
        securePaymentHeight="unset"
        securePaymentDisplay="unset"
      />

    </Fragment>
  );
};

async function CollectionProduct({ collectionTitle, collectionId }: { collectionTitle: string; collectionId: string }) {
  const products: ProductType[] | string = await getCollectionProducts(collectionId);
  if (typeof products === 'string') return products;
  return (
    <SliderList heading={unSlugify(collectionTitle) + ' Collection'} Products={products} />
  )
}

// 172800

