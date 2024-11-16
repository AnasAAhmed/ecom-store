import Loader from "@/components/ui/Loader";
import { SignIn } from "@clerk/nextjs";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Borcelle | Sign-In",
  description: "Borcelle Ecommerce Store Authentication",
};
export default function Page() {
  return (
    <div className="sm:mt-8 mt-24 min-h-[80vh] flex justify-center items-center">
      <Suspense fallback={<Loader />}>
        <SignIn />
      </Suspense>
    </div>
  );
}
