'use client';
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageZoomProps {
  alt: string;
  allSrc: string[];
}

const ImageZoom = ({ alt, allSrc }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
  const imgRef = useRef<HTMLImageElement>(null);
  const [mainImage, setMainImage] = useState(allSrc[0]);

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imgRef.current && isZoomed) {
      const { left, top, width, height } = imgRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setBackgroundPosition(`${x}% ${y}%`);
    }
  };

  return (
    <div className="flex max-md:flex-col gap-3 w-full">
      <div className="flex md:flex-col gap-2 max-md:order-2 overflow-auto">
        {allSrc.map((image, index) => (
          <Image
            key={index}
            unoptimized
            loading="lazy"
            src={image}
            height={100}
            width={100}
            placeholder="blur"
            blurDataURL="/fallback.avif"
            alt={alt}
            className={`w-20 h-20 rounded-lg object-cover cursor-pointer transition-all duration-200 ${mainImage === image ? "border-2 border-black" : "border border-transparent"
              }`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>

      <div
        className="
          relative 
          aspect-square 
          w-[90vw]  
          sm:w-[400px] 
          md:w-[420px]
          lg:w-[500px] 
          rounded-lg 
          overflow-hidden 
          max-md:mx-auto
        "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {/* Zoom Layer */}
        {isZoomed && (
          <div
            className="absolute inset-0 rounded-lg bg-no-repeat transition-transform duration-300"
            style={{
              backgroundImage: `url(${mainImage})`,
              backgroundPosition: backgroundPosition,
              backgroundSize: "200%", // controls zoom level
            }}
          />
        )}

        {/* Base Image */}
        <Image
          ref={imgRef}
          src={mainImage}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          placeholder="blur"
          blurDataURL="/fallback.avif"
          className={`absolute top-0 left-0 w-full h-full object-cover cursor-zoom-in rounded-lg transition-opacity duration-300 ${isZoomed ? "opacity-0" : "opacity-100"
            }`}
        />
      </div>
    </div>
  );
};

export default ImageZoom;
