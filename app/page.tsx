import Banner from "@/components/ui/Banner";
import { getBestSellingProducts, getCollections, getProducts } from "@/lib/actions/actions";
import Collections from '@/components/Collections';
import ProductList from '@/components/product/ProductList';
import BlogSection from "@/components/ui/BlogSection";
import Social from "@/components/ui/Social";
import GroupComponent7 from "@/components/ui/Services";

//Rendering with SSG & ISG
export const dynamic = 'force-static';

//for dynamin pages:- 
//export const dynamicParams = true
//export async function generateStaticParams() {
//   const posts: Post[] = await fetch('https://api.vercel.app/blog').then((res) =>
//     res.json()
//   )
//   return posts.map((post) => ({
//     id: String(post.id),
//   }))
// }
const brands = [
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHCZClMNdR82a7kjOZBjnH9nuNq50hKa2kRg&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWhCKfrK3dxWoaGmyrrwmaOijVv8NbKuc7WA&s",
  "https://www.junaidjamshed.com/media/logo/stores/1/new_logo.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrRRjFf56niBWtgzHcuLK1dC1iCVRNlPONiw&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC9gxPThsTRepB3JiNYlFfPvR5oXBvj05IAQ&s",
  "https://zaraye.co/images/uploaded/756d7d89902ff6517250e574acf3e4b7b7ef7764-alkaramlogo21.jpeg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIo5J2RXZWsYV-njuemjGatLusjgt28AwJNg&s",
];
export default async function Home() {
  const [collections, products, bestSellingProducts] = await Promise.all([
    getCollections(),
    getProducts(),
    getBestSellingProducts()
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
      <div className="overflow-hidden py-2 bg-white border-y border-gray-200">
        <div className="relative w-full">
          <div className="flex gap-12 animate-marquee w-max">
            {[...brands, ...brands].map((src, i) => (
              <div key={i} className="flex items-center justify-center min-w-[120px]">
                <img
                  src={src}
                  alt={`Brand ${i}`}
                  className="w-24 h-24 object-contain grayscale hover:grayscale-0 transition duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Collections collections={collections} />

      <ProductList heading="Latest Products" Products={products} />

      <Banner
        heading="Summer Collection 2024"
        text="Embrace the warmth with our stylish and comfortable summer wear"
        imgUrl={'/banner3.avif'}
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
};

export const revalidate = 86400;

