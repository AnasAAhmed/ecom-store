import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import ToasterProvider from "@/lib/providers/ToasterProvider";
import Footer from "@/components/ui/Footer";
import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import UserFetcher from "@/components/UserFetch";

import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: ['500'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Borcelle Store",
  description: "Borcelle Ecommerce Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ClerkProvider>
          <ToasterProvider />
          <UserFetcher />

          <Navbar />
          <Suspense fallback={<Loader />}>
          <div className="max-sm:mt-20">

            {children}
          </div>
          </Suspense>
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
