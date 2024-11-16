import ShippingForm from "@/components/ShippingForm"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borcelle | Shipping",
  description: "Put your shipping details to proceed order with cash on delivery method",
};
export const dynamic = 'force-static';

const ShippingPage =async () => {

  return (
    <ShippingForm />
  );
};

export default ShippingPage;
