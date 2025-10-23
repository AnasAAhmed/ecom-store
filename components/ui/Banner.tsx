// 'use client'
// import Image from "next/image";
// import SmartLink from "@/components/SmartLink";
// import FadeInOnView from "../FadeInView";

// type BannerProps = {
//   text?: string;
//   heading?: string;
//   imgUrl?: string;      // make optional now
//   videoUrl?: string;    // new prop
//   shade?: string;
//   textColor?: string;
//   link: string;
//   buttonText?: string;
//   mobImgUrl?: string;
//   textPositionV?: rr;
//   textPosition?: rr;
//   aspectRatio?: string | number;
// };
// type rr = 'center' | 'end' | 'start';
// const Banner = ({ aspectRatio = '16 / 8', mobImgUrl, imgUrl, videoUrl, text, heading, textColor, shade, link, buttonText, textPositionV = 'center', textPosition = 'center' }: BannerProps) => {

//   return (
//     <SmartLink disabled={link ? false : true} title={buttonText || 'Shop Now'} href={link} >
//       <div className={`relative w-full aspect-[4/4] md:aspect-[16/8]`}>

//         {videoUrl ? (
//           <video
//             className="absolute inset-0 w-full h-full object-cover"
//             src={videoUrl}
//             autoPlay
//             loop
//             poster='/fallback-banner.avif'
//             muted
//             playsInline
//           />
//         ) : (
//           <>
//             <Image
//               src={imgUrl!}
//               alt={heading || 'Banner image'}
//               fill
//               placeholder="blur"
//               blurDataURL="/fallback-banner.avif"
//               sizes="100vw"
//               className={`absolute max-sm:hidden transition-opacity`}
//             />
//             <Image
//               src={mobImgUrl! || imgUrl!}
//               alt={(heading || 'Banner image') + 'mob_image'}
//               fill
//               placeholder="blur"
//               blurDataURL="/fallback-banner.avif"
//               sizes="100vw"
//               className={`absolute sm:hidden transition-opacity`}
//             />
//           </>
//         )}
//         {shade && (
//           <div
//             className="absolute inset-0 opacity-60"
//             style={{ background: `linear-gradient(to bottom, ${shade} 0%, transparent 100%)` }}
//           />
//         )}

//         <div
//           className="relative z-10 flex flex-col h-full py-4 sm:py-12 text-scenter px-6 md:px-12 lg:px-24"
//           style={{ textAlign: (textPosition as rr), color: textColor, justifyContent: textPosition, alignItems: textPositionV }}
//         >
//           <FadeInOnView animation="animate-fadeInUp" delay={100} >
//             <h1 className="capitalize text-heading2-bold sm:text-heading1-bold underline font-extrabold mb-6 leading-tight">
//               {heading}
//             </h1>
//           </FadeInOnView>
//           <FadeInOnView animation="animate-fadeIn" delay={300}>
//             <p className="capitalize text-heading4-bold sm:text-heading3-bold mb-10 max-sm:hidden">
//               {text}
//             </p>
//           </FadeInOnView>

//           {buttonText && (
//             <button
//               // onClick={() => window.scroll(0, 800)}
//               className="bg-white text-black font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
//             >
//               {buttonText || 'Learn More'}
//             </button>
//           )}
//         </div>

//       </div>
//     </SmartLink>
//   );
// };

// export default Banner;
'use client';
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
          placeholder="blur"
          blurDataURL="/fallback-banner.avif"
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
          placeholder="blur"
          blurDataURL="/fallback-banner.avif"
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
