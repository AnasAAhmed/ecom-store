import Banner from "@/components/ui/Banner";
import { getBestSellingProducts, getCollections, getProducts } from "@/lib/actions/actions";
import Collections from '@/components/Collections';
import ProductList from '@/components/product/ProductList';
import BlogSection from "@/components/ui/BlogSection";
import Social from "@/components/ui/Social";
import GroupComponent7 from "@/components/ui/Services";

export const dynamic = 'force-static';


export default async function Home() {
  const [collections, latestProducts, bestSellingProducts] = await Promise.all([
    getCollections(),
    getProducts(),
    getBestSellingProducts(),
  ]);

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

     <Collections collections={collections} />
      <ProductList heading="Latest Products" Products={latestProducts} />
      <Banner
        heading="Summer Collection 2024"
        text="Embrace the warmth with our stylish and comfortable summer wear"
        imgUrl={'/banner2.png'}
        shade="gray"
        textColor="white"
        link="/search?query=summer"
        buttonText="Shop Now"
      />

    <ProductList heading="Our Top Selling Products" Products={bestSellingProducts} />

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
export const revalidate = 43200;
