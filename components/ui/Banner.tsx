import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import FadeInOnView from "../FadeInView";
import React from "react";



interface BannerProps {
  className?: string;
  smAspectRatio?: string;
  imgUrl?: string;
  isHero?: boolean;
  mobImgUrl?: string;
  shade?: Shade;
  size?: Size;
  video?: {
    isVideo: boolean;
    url?: string;
    poster?: string;
  };
  layout?: {
    margin?: { top?: string; bottom?: string; left?: string; right?: string };
    padding?: { top?: string; bottom?: string; left?: string; right?: string };
    borderRadius?: string;
    imagePosition?: 'top' | 'center' | 'bottom';
    backgroundColor?: string;
  };
  imageContent?: IImageContent;
}

const Banner: React.FC<BannerProps> = ({
  className = '',
  smAspectRatio = 'aspect-[4/5.2]',
  isHero = false,
  imgUrl,
  mobImgUrl,
  shade,
  size = "medium",
  video,
  layout,
  imageContent
}) => {
  const { heading, text, textColor, buttonText, link, font, buttonType, contentPositionV = "center", textAlign = "center", contentPositionH = "center" } = imageContent || {};
  const heightClass = {
    'small': "sm:aspect-[16/4]",
    'medium': "sm:aspect-[16/6]",
    'large': "sm:aspect-[16/8]",
    'extraLarge': "sm:aspect-[16/10]",
    'full': "sm:h-full",
  }


  const layoutStyleForContainer: React.CSSProperties = {
    paddingTop: layout?.margin?.top,
    paddingBottom: layout?.margin?.bottom,
    paddingLeft: layout?.margin?.left,
    paddingRight: layout?.margin?.right,
    // paddingTop: layout?.padding?.top,
    // paddingBottom: layout?.padding?.bottom,
    // paddingLeft: layout?.padding?.left,
    // paddingRight: layout?.padding?.right,
    borderRadius: layout?.borderRadius,
    backgroundColor: layout?.backgroundColor,
    objectPosition: 'bottom',
  };
  const layoutStyleForImageContent: React.CSSProperties = {
    marginTop: layout?.padding?.top,
    marginBottom: layout?.padding?.bottom,
    marginLeft: layout?.padding?.left,
    marginRight: layout?.padding?.right,
  };

  return (
    <SmartLink disabled={!link} href={link || "#"} title={buttonText || "Explore"}>
      <div
        className={`relative w-full ${smAspectRatio} aspect-[4/5.2]  ${heightClass[size]} overflow-hidden`}
        style={layoutStyleForContainer}
      >
        <div className="shimmer" />
        <Image
          src={video?.poster || imgUrl || "/fallback-banner.avif"}
          alt={heading || "Banner image"}
          fill
          sizes="100vw"
          priority
          className="absolute object-cover w-full h-full max-sm:hidden"
          style={{
            objectPosition: layout?.imagePosition || "center",
            transition: "opacity 0.3s ease",
          }}
          // placeholder="blur"
          // blurDataURL="/fallback-banner.avif"
        />
        <Image
          src={video?.poster || mobImgUrl || imgUrl || "/fallback-banner.avif"}
          alt={(heading || "Banner image") + "_mobile"}
          fill
          sizes="100vw"
          priority
          className="absolute w-full h-full object-cover sm:hidden"
          style={{
            objectPosition: layout?.imagePosition || "center",
            transition: "opacity 0.3s ease",
          }}
          // placeholder="blur"
          // blurDataURL="/fallback-banner.avif"
        />

        {video?.isVideo && video?.url && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={video.url}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          />
        )}
        {/* Overlay shade */}
        {shade && shade.color && (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to ${shade.position || 'top'}, ${shade.color} 0%, transparent 100%)`,
              opacity: 0.6,
            }}
          />
        )}

        {/* Content */}
        <div
          className={`relative z-10 flex flex-col h-full `}
          style={{
            justifyContent: contentPositionV,
            alignItems: contentPositionH,
            color: textColor,
            textAlign: textAlign,
            ...layoutStyleForImageContent
          }}
        >

          {heading && (
            <FadeInOnView animation="animate-fadeInUp" delay={100}>
              <h1 style={{ fontFamily: font }} className={`capitalize font-sans text-[40px] leading-[100%] sm:text-[60px] font-medium mb-3`}>
                {heading}
              </h1>
            </FadeInOnView>
          )}

          {text && (
            <FadeInOnView animation="animate-fadeInUp" delay={300}>
              <p style={{ fontFamily: font }} className={`capitalize font-sans text-[20px] md:max-w-[66rem] sm:text-[28px] font-medium mb-6 leading-[100%]`}>
                {text}
              </p>
            </FadeInOnView>
          )}

          {(buttonText || link) && (
            <FadeInOnView animation="animate-fadeInUp" className={`font-medium`} delay={500}>
              {buttonType === "link" ? (
                <span style={{ fontFamily: font }} className="underline text-body-medium cursor-pointer hover:opacity-80 hover:text-blue-500 transition">
                  {buttonText || link}
                </span>
              ) : (
                <button style={{ fontFamily: font }} className="bg-white text-black py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
                  {buttonText || link}
                </button>
              )}
            </FadeInOnView>
          )}
        </div>
      </div>
    </SmartLink>
  );
};

export default Banner;
