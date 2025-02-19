import { auth } from "@/auth";
import ShippingForm from "@/components/ShippingForm"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borcelle | Shipping",
  description: "Put your shipping details to proceed order with cash on delivery method",
};

const ShippingPage =async () => {
  const session = (await auth()) as Session

  return (
    <ShippingForm user={session ? session.user : null}/>
  );
};

export default ShippingPage;
