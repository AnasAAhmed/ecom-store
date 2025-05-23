import { ArrowLeftRight, Truck } from "lucide-react";
import type { NextPage } from "next";
import SmartLink from "@/components/SmartLink";
import { useMemo, type CSSProperties } from "react";
import { FaCcStripe, } from "react-icons/fa";
import FadeInOnView from "../FadeInView";

export type GroupComponent7Type = {
  className?: string;

  /** Style props */
  freeDeliveryHeight?: CSSProperties["height"];
  freeDeliveryDisplay?: CSSProperties["display"];
  daysReturnHeight?: CSSProperties["height"];
  daysReturnDisplay?: CSSProperties["display"];
  securePaymentHeight?: CSSProperties["height"];
  securePaymentDisplay?: CSSProperties["display"];
};

const GroupComponent7: NextPage<GroupComponent7Type> = ({
  className = "",
  freeDeliveryHeight,
  freeDeliveryDisplay,
  daysReturnHeight,
  daysReturnDisplay,
  securePaymentHeight,
  securePaymentDisplay,
}) => {
  const freeDeliveryStyle: CSSProperties = useMemo(() => {
    return {
      height: freeDeliveryHeight,
      display: freeDeliveryDisplay,
    };
  }, [freeDeliveryHeight, freeDeliveryDisplay]);

  const daysReturnStyle: CSSProperties = useMemo(() => {
    return {
      height: daysReturnHeight,
      display: daysReturnDisplay,
    };
  }, [daysReturnHeight, daysReturnDisplay]);

  const securePaymentStyle: CSSProperties = useMemo(() => {
    return {
      height: securePaymentHeight,
      display: securePaymentDisplay,
    };
  }, [securePaymentHeight, securePaymentDisplay]);

  return (
    <section
      className={`self-stretch flex flex-wrap lg:flex-row items-center justify-center py-[6rem] px-3 md:px-8 sm:px-[6.25rem] box-border gap-[2.875rem] max-w-full text-center text-[2rem] text-black font-poppins mq450:pl-[1.25rem] mq450:pr-[1.25rem] mq450:box-border mq800:gap-[1.438rem] mq800:pl-[3.125rem] mq800:pr-[3.125rem] mq800:box-border mq1350:flex-wrap mq1350:justify-center ${className}`}
    >
      <div className="hidden h-[18.75rem] w-full max-w-full relative bg-blue-50" />
      <FadeInOnView animation="animate-fadeInUp"  delay={200} threshold={0.2}>

        <div className="w-full hover:scale-105 duration-300 pb-3 sm:w-[23.5rem] flex flex-col items-center justify-center max-w-full text-center">
          <h1
            className="h-[3rem] relative text-inherit font-medium font-inherit inline-block z-[1] "
            style={freeDeliveryStyle}
          >
            <Truck />
          </h1>
          <h1
            className="h-[3rem] relative text-inherit font-medium font-inherit inline-block z-[1] "
            style={freeDeliveryStyle}
          >
            Free Delivery
          </h1>
          <p className="m-0 w-full relative text-[1.25rem] text-darkgray z-[1] mq450:text-[1rem]">
            For all orders over $50, consectetur adipiscing elit.
          </p>
        </div>
      </FadeInOnView>
      <FadeInOnView animation="animate-fadeInUp"  delay={400} threshold={0.5}>

        <div className="w-full hover:scale-105 duration-300 pb-3 sm:w-[23.5rem] flex flex-col items-center justify-center max-w-full text-center">
          <h1
            className="h-[3rem] relative text-inherit font-medium font-inherit inline-block z-[1] "
            style={daysReturnStyle}
          >
            <ArrowLeftRight />
          </h1>
          <h1
            className="h-[3rem] relative text-inherit font-medium font-inherit inline-block z-[1] mq450:text-[1.188rem] mq800:text-[1.625rem]"
            style={daysReturnStyle}
          >
            90 Days Return
          </h1>
          <p className="m-0 w-full relative text-[1.25rem] text-darkgray z-[1] mq450:text-[1rem]">
            If goods have problems, consectetur adipiscing elit.
          </p>
        </div>
      </FadeInOnView>
      <FadeInOnView animation="animate-fadeInUp"  delay={600} threshold={0.8}>

        <div className="w-full hover:scale-105 duration-300 pb-3 sm:w-[23.5rem] flex flex-col items-center justify-center max-w-full text-center">
          <SmartLink title="See more on Stripe.com" target="blank" href={'https://stripe.com'}
            className="h-[3rem] relative text-inherit font-medium font-inherit inline-block z-[1] mq450:text-[1.188rem] mq800:text-[1.625rem]"
         
          >
            <FaCcStripe />
          </SmartLink>
          <h1
            className="h-[3rem] relative text-inherit font-medium font-inherit inline-block z-[1] mq450:text-[1.188rem] mq800:text-[1.625rem]"
            style={securePaymentStyle}
          >
            Secure Payment
          </h1>
          <p className="m-0 w-full relative text-[1.25rem] text-darkgray z-[1] mq450:text-[1rem]">
            100% secure payment, consectetur adipiscing elit.
          </p>
        </div>
      </FadeInOnView>
    </section>
  );
};

export default GroupComponent7;
