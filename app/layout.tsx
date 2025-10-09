import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import Footer from "@/components/ui/Footer";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import UserFetcher from "@/components/UserFetch";
import { Roboto } from 'next/font/google'
import { SessionProvider } from "next-auth/react";
import ProgressBar from "@/components/ProgressBar";
import IsOnline from "@/components/IsOnline";
import SmartLink from "@/components/SmartLink";

const roboto = Roboto({
  weight: ['500'],
  subsets: ['latin'],
})

export const metadata: Metadata =
{
  title: `Borcelle store`,
  description: "Shop high-quality products at Borcelle professinaol spa website in nextjs mongodb Tcs Courier api. By Anas Ahmed Gituhb:https://github.com/AnasAAhmed",
  keywords: ['Borcelle', 'Anas Ahmed', 'Ecommerce', "professional ecommerce site in nextjs", 'mongodb', 'SPA Ecommerce', 'TCS courier APIs'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true
    }
  },
  openGraph: {
    title: `Borcelle store`,
    description: "Shop high-quality products at Borcelle professinaol spa website in nextjs mongodb Tcs Courier api. By Anas Ahmed Gituhb:https://github.com/AnasAAhmed",
    url: `${process.env.ECOM_STORE_URL}`,
    images: [
      {
        url: '/ecom-store.jpg',
        width: 1024,
        height: 1024,
        alt: 'Project Showcase',
      },
      {
        url: '/home-preview.webp',
        width: 1280,
        height: 750,
        alt: 'home-preview',
      },
      {
        url: '/home-insights.webp',
        width: 1280,
        height: 750,
        alt: 'home-insights',
      },
      {
        url: '/product-seo.avif',
        width: 1280,
        height: 750,
        alt: 'Product seo preview',
      },

    ],
    siteName: 'Borcelle',
  },
  other: {
    "google-site-verification": "OG4--pwhuorqRhEHtEXwiAIdavrU1KXFAi1sRUu38EY",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en">
      <body className={roboto.className}>
        <SessionProvider>
          <ToasterProvider />
          <UserFetcher />
          <Suspense fallback={''}>
            <nav className="print:hidden py-2 px-4 hidden lg:flex justify-between text-sm sm:text-base font-medium text-gray-800 bg-gradient-to-r from-red-50 via-gray-100 to-blue-100 border-y border-gray-200">

              <p className="text-red-600 font-bold px-4">🔥 50% Off Summer Sale</p>

              <div className="flex gap-6 items-center">
                {['men', 'women', 'kids', 'footwear', 'accessories'].map((item) => (
                  <SmartLink
                    title={`${item} collection`}
                    key={item}
                    prefetch={false}
                    aria-label={item}
                    href={`/collections/${item}`}
                    className="hover:text-black text-gray-700 transition-colors duration-200 border-b-2 border-transparent hover:border-black"
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </SmartLink>
                ))}
                {["/", "/search", "/contact", "/blog", "/wishlist", "/orders", "https://ecom-admin-panel-xcw7-gh8p.vercel.app/"].map((item, idx) => (
                  <a
                    title={`${item} page at Borcelle`}
                    key={item}
                    aria-label={item}
                    href={item}
                    className="hover:text-black sr-only text-gray-600 transition-colors duration-200 border-b-2 border-transparent hover:border-black"
                  >
                    {["Home", "Shop", "Contact", "Blog", "Wishlist", "Orders", "CMS"][idx]}
                  </a>
                ))}
              </div>
              <p className="text-blue-600 px-4 max-md:hidden">
                📞 Help: <a title="Call us" href="tel:+845466789">+84 546-6789</a>
              </p>
            </nav>
            <Navbar />
            <ProgressBar />
          </Suspense>
          <main className="mt-24 sm:mt-12">
            {children}
          </main>
          <Suspense fallback={''}>
            {/* <Suspense fallback={<Loader height={80} />}> */}
            <IsOnline />
          </Suspense>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
