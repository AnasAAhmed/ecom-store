import Payment_succes from "@/components/Payment_succes";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borcelle | Payment_Successfull",
  description: "Your payment has been successfully processed",
};

export const dynamic = 'force-static';
const SuccessfulPaymentPage = () => {
  return (
    <Payment_succes/>
  );
};

export default SuccessfulPaymentPage;
