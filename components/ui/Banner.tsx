'use client'
import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import FadeInOnView from "../FadeInView";

type BannerProps = {
  text?: string;
  heading?: string;
  imgUrl?: string;      // make optional now
  videoUrl?: string;    // new prop
  shade?: string;
  textColor?: string;
  link: string;
  buttonText?: string;
  textPositionV?: rr;
  textPosition?: rr;
  aspectRatio?: string | number;
};
type rr = 'center' | 'end' | 'start';
const Banner = ({ aspectRatio = '16 / 8', imgUrl, videoUrl, text, heading, textColor, shade, link, buttonText, textPositionV = 'center', textPosition = 'center' }: BannerProps) => {

  return (
    <SmartLink disabled={link ? false : true} title={buttonText || 'Shop Now'} href={link} >
      <div className={`relative w-full aspect-[16/14] md:aspect-[16/8]`}>

        {videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            loop
            poster='/fallback-banner.avif'
            muted
            playsInline
          />
        ) : (
          <Image
            src={imgUrl!}
            alt={heading || 'Banner image'}
            fill
            placeholder="blur"
            blurDataURL="/fallback-banner.avif"
            sizes="100vw"
            className={`absolute transition-opacity`}
          />
        )}
        {shade && (
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: `linear-gradient(to bottom, ${shade} 0%, transparent 100%)` }}
          />
        )}

        <div
          className="relative z-10 flex flex-col h-full py-4 sm:py-12 text-scenter px-6 md:px-12 lg:px-24"
          style={{ textAlign: (textPosition as rr), color: textColor, justifyContent: textPosition, alignItems: textPositionV }}
        >
          <FadeInOnView animation="animate-fadeInUp" delay={100} >
            <h1 className="capitalize text-heading2-bold sm:text-heading1-bold underline font-extrabold mb-6 leading-tight">
              {heading}
            </h1>
          </FadeInOnView>
          <FadeInOnView animation="animate-fadeIn" delay={300}>
            <p className="capitalize text-heading4-bold sm:text-heading3-bold mb-10 max-sm:hidden">
              {text}
            </p>
          </FadeInOnView>

          {buttonText && (
            <button
              // onClick={() => window.scroll(0, 800)}
              className="bg-white text-black font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              {buttonText || 'Learn More'}
            </button>
          )}
        </div>

      </div>
    </SmartLink>
  );
};

export default Banner;
