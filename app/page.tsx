import Banner from "@/components/ui/Banner";
import Collections from '@/components/Collections';
import ProductList from '@/components/product/ProductList';
import BlogSection from "@/components/ui/BlogSection";
import Social from "@/components/ui/Social";
import GroupComponent7 from "@/components/ui/Services";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import { brands, fallbackHomeData } from "@/lib/utils/features";
import { getCollectionProducts, getCollections } from "@/lib/actions/collection.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getCachedHomePageData } from "@/lib/actions/cached";
import Image from "next/image";
import FadeInOnView from "@/components/FadeInView";
export const dynamic = 'force-static';


export async function generateMetadata() {
  const homeData = await getCachedHomePageData();
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
          url: homeData.seo.url || '/home-preview.avif',
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

  const [collections, products, homeData] = await Promise.all([
    getCollections(),
    getProducts(),
    getCachedHomePageData()
  ]);
  const homePageData = homeData ?? fallbackHomeData;
  return (
    <>

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
      <div className="overflow-hidden rotate-2 mt-12 mx-1 gap-6 py-2 bg-white border-y border-gray-200">
        <div className="relative w-full">
          <div className="flex gap-12 animate-marquee w-max">
            {[...brands, ...brands].map((i, _) => (
              <div key={`${i.id}-${_ + i.id}`} className="flex items-center justify-center min-w-[120px]">
                <img
                  src={i.src}
                  alt={`Brand ${i.id}`}
                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Collections collections={collections} />

      <div className="overflow-hidden mx-1 gap-6 -rotate-2 py-2 border-y border-gray-200 bg-white">
        <div className="relative w-full">
          <div className="flex gap-12 animate-marquee2 w-max">
            {[...brands, ...brands].map((i, _) => (
              <div
                key={`${i.id}-${_ + i.id}`}
                className="flex items-center justify-center min-w-[120px] "
              >
                <img
                  src={i.src}
                  alt={`Brand ${i.id}`}
                  className="w-16 h-16 sm:w-24 sm:h-24 object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <ProductList heading="Latest Products" Products={products} />
      {homePageData.collections.map((i, _) => (

        <>
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
            <CollectionProduct collectionId={i.collectionId} />
          </Suspense>
        </>
      ))}

      <BlogSection />

      <section className="relative my-10 bg-[#f9f9f9] text-gray-900 px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-xl space-y-6">
          <FadeInOnView delay={100} animation="animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Crafted by Anas Ahmed
            </h1>
          </FadeInOnView>
          <FadeInOnView delay={200} threshold={0.4} animation="animate-fadeInUp">
            <p className="text-lg text-gray-700">
              Explore a range of freelance services—from fully responsive web apps to blazing-fast backend logic.
            </p>
          </FadeInOnView>
          <FadeInOnView delay={400} threshold={0.5} animation="animate-fadeIn">
            <p className="text-base text-gray-600">
              ✨ Full-stack Web Development • SEO Optimization & Best Practices • Fast Page Loads with Optimized DB Queries • Custom Admin Dashboards & API Integrations
            </p>
          </FadeInOnView>
          <FadeInOnView delay={200} threshold={0.4} animation="animate-fadeInUp">

            <a
              target="_blank"
              title="Hire me"
              href="https://www.fiverr.com/anas_ahmed_24"
              className="inline-block bg-black text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-gray-800 transition"
            >
              Hire Me on Fiverr
            </a>
          </FadeInOnView>

          <FadeInOnView delay={400} threshold={0.5} animation="animate-fadeIn">

            <p className="text-base text-gray-600">
              ✨ Dynamic SEO • Fast Page Loads • Scalable Architecture • Optimized Search Logic
            </p>
          </FadeInOnView>

          <FadeInOnView delay={500} threshold={0.5} animation="animate-fadeInUp">

            <p className="text-sm text-gray-500 pt-s">
              🛠️ Tech Stack: Next.js • React • TypeScript • Tailwind CSS • Node.js • MongoDB • Prisma • Clerk / NextAuth
            </p>
          </FadeInOnView>
          <FadeInOnView delay={600} threshold={0.6} animation="animate-fadeIn">
            <a
              target="_blank"
              title="Get yours too"
              href="https://www.fiverr.com/anas_ahmed_24/create-ecommerce-store-with-nextjs-and-mongodb-database"
              className="inline-block bg-black text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-gray-800 transition"
            >
              Get Your Store
            </a>
          </FadeInOnView>

        </div>
        <FadeInOnView delay={700} threshold={0.9} animation="animate-fadeInUp">
          <a
            target="_blank"
            title="Get yours too"
            href="https://www.fiverr.com/anas_ahmed_24/create-ecommerce-store-with-nextjs-and-mongodb-database"
            className="w-full md:w-1/2">
            <Image
              src="/promotion.png"
              alt="Fashion Model"
              width={600}
              height={600}
              className="rounded-2xl shadow-lg object-cover"
            />
          </a>
        </FadeInOnView>

      </section>
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
};

async function CollectionProduct({ collectionId }: { collectionId: string }) {
  const products: ProductType[] | string = await getCollectionProducts(collectionId);
  if (typeof products === 'string') return products;
  return (
    <ProductList Products={products} />

  )
}

export const revalidate = 172800;

