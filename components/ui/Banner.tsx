'use client'
import Link from "next/link";

type BannerProps = {
  text?: string;
  heading?: string;
  imgUrl?: string;      // make optional now
  videoUrl?: string;    // new prop
  shade?: string;
  textColor?: string;
  link: string;
  buttonText?: string;
  scrollDown?: boolean;
  textPosition?: string;
  textPositionV?: string;
};

const Banner = ({ imgUrl, videoUrl, text, heading, textColor, shade, link, buttonText, scrollDown, textPositionV = 'center', textPosition = 'center' }: BannerProps) => {
  return (
    <Link title={buttonText || 'Shop Now'} href={link} className="pyd-6 md:mt-0 x-6">
      <div className="relative w-full h-[200px] sm:h-[450px] md:h-[600px] roudnded-xl overflow-hidden">

        {videoUrl ? (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={videoUrl}
            autoPlay
            loop
            poster='/banner2.avif'
            muted
            playsInline
          />
        ) : (
          <div
            className="absolute inset-0 w-full h-full bg-center"
            style={{ backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover' }}
          />
        )}

        {shade && (
          <div
            className="absolute inset-0 opacity-60"
            style={{ background: `linear-gradient(to bottom, ${shade} 0%, transparent 100%)` }}
          />
        )}

        <div
          className="relative z-10 flex flex-col h-full py-4 sm:py-12 text-center px-6 md:px-12 lg:px-24"
          style={{ color: textColor, justifyContent: textPosition, alignItems: textPositionV }}
        >
          <h1 className="capitalize text-heading2-bold sm:text-heading1-bold underline font-extrabold mb-6 leading-tight">
            {heading}
          </h1>
          <p className="capitalize text-heading4-bold sm:text-heading3-bold mb-10 max-sm:hidden">
            {text}
          </p>

          {scrollDown && (
            <button
              onClick={() => window.scroll(0, 800)}
              className="bg-white text-black font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
            >
              {buttonText || 'Learn More'}
            </button>
          ) }
        </div>

    </div>
      </Link>
  );
};

export default Banner;
