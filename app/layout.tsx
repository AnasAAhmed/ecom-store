import type { Metadata } from "next";

import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import Footer from "@/components/ui/Footer";
import { Suspense } from "react";
import UserFetcher from "@/components/UserFetch";
import { Roboto } from 'next/font/google'
import { SessionProvider } from "next-auth/react";
import ProgressBar from "@/components/ProgressBar";
import IsOnline from "@/components/IsOnline";
import Currency from "@/components/Currency";
import User from "@/components/ui/User";

const roboto = Roboto({
  weight: ['500'],
  subsets: ['latin'],
})

export const metadata: Metadata =
{
  title: `Borcelle: Online Store for Men's and Women's Clothing`,
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
    title: `Borcelle: Online Store for Men's and Women's Clothing`,
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

          {/* Toaster */}
          <ToasterProvider />

          {/* Fetches user details wishlist & sign-in history if logged in*/}
          <UserFetcher />

          {/* navbar and progress in suspense hook becuase they both use useSearchParams */}
          <Suspense fallback={''}>
            <Navbar />
            <ProgressBar />
          </Suspense>

          {/* All Pages */}
            <main>
              {children}
            </main>

          {/* Modals */}
          <Currency />
          <User />

          {/* Wifi Connection indicator */}
          <Suspense fallback={''}>
            <IsOnline />
          </Suspense>

          {/* Footer */}
          <Footer />

        </SessionProvider>
      </body>
    </html>
  );
}
