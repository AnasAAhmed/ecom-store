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
import { auth } from "@/auth";
import { headers } from "next/headers";
import IsOnline from "@/components/IsOnline";

const roboto = Roboto({
  weight: ['500'],
  subsets: ['latin'],
})

export const metadata: Metadata =
{
  title: ` Borcelle`,
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
    title: `Borcelle`,
    description: "Shop high-quality products at Borcelle professinaol spa website in nextjs mongodb Tcs Courier api. By Anas Ahmed Gituhb:https://github.com/AnasAAhmed",
    url: `${process.env.ECOM_STORE_URL}`,
    images: [
      {
        url: '/home-preview.avif',
        width: 220,
        height: 250,
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
  const ip = headers().get('x-forwarded-for') || '36.255.42.109';
  const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
  const geoData = await geoRes.json();
 console.log(geoData.country,geoData.city);
 

  return (
    <html lang="en">
      <body className={roboto.className}>
        <SessionProvider>
          <ToasterProvider />
          <UserFetcher />
          <Navbar city={geoData.country||''} country={geoData.country||''} countryCode={geoData.countryCode||''}/>
          <Suspense fallback={<Loader />}>
            <div className="mt-28 sm:mt-12">
              {children}
            </div>
          </Suspense>
          <IsOnline/>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
