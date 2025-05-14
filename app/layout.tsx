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
import { headers } from "next/headers";
import dynamic from "next/dynamic";

import { encode, decode } from "next-auth/jwt";
const IsOnline = dynamic(() => import("@/components/IsOnline"), {
  ssr: false,
});
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
        url: '/home-preview.avif',
        width: 260,
        height: 220,
        alt: 'home screenshot',
      },
      {
        url: '/home-insights.avif',
        width: 220,
        height: 250,
        alt: 'home-insights',
      },
      {
        url: '/product-seo.avif',
        width: 220,
        height: 250,
        alt: 'Product seo preview',
      },

    ],
    siteName: 'Borcelle Next.js by anas ahmed',
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

  let country = '';
  let city = ''
  let countryCode = ''
  if (process.env.NODE_ENV === 'production') {
    const ip = headers().get('x-forwarded-for') || '36.255.42.109';
    // const ip = '85.214.132.117';
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geoData = await geoRes.json();
    country = geoData.country;
    city = geoData.city;
    countryCode = geoData.countryCode;
    console.log(geoData.country, geoData.city);
  }

  return (
    <html lang="en">
      <body className={roboto.className}>
        <SessionProvider>
          <ToasterProvider />
          <UserFetcher />
          <Navbar country={country} countryCode={countryCode} />
          <Suspense fallback={<Loader />}>
            <div className="mt-28 sm:mt-12">
              {children}
            </div>
          </Suspense>
          <IsOnline />
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
