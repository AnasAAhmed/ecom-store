'use client'
import Image from "next/image";
import { useRef, useState } from "react";

interface ImageZoomProps {
  alt: string;
  allSrc: string[]
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

  // const formattedSrc = src.replace(/\\/g, '/');

  return (
    <div className="flex max-md:flex-col gap-2">
      <Image
        placeholder="blur"
        blurDataURL="/fallback.avif"
        src={mainImage}
        alt={alt}
        width={500}
        height={500}
        className="w-full rounded-lg sm:hidden md:h-[500px] h-[300px] object-cover" />
      <div className="flex md:flex-col gap-2 max-md:order-2  overflow-auto">
        {allSrc.map((image, index) => (
          <Image
            key={index}
            unoptimized
            loading="lazy"
            src={image}
            height={200}
            width={200}
            placeholder="blur"
            blurDataURL="/fallback.avif"
            alt={alt}
            className={`w-20 h-20 rounded-lg object-cover cursor-pointer ${mainImage === image ? "border-2 border-black" : ""}`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
      <div className="aspect-[1/1] w-96 md:w-[430px] lg:w-[500px] relative max-sm:hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {isZoomed && (
          <div
            className={`rounded-lg top-0 left-0 w-full h-full bg-no-repeat transition-transform duration-300`}
            style={{
              backgroundImage: `url(${mainImage})`,
              backgroundPosition: backgroundPosition,
              backgroundSize: '200%', // Adjust this value to control the zoom level
            }}
          />
        )}
        <Image
          ref={imgRef}
          src={mainImage}
          // width={1000}
          // height={1000}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          placeholder="blur"
          blurDataURL="/fallback.avif"
          alt={alt}
          className={`cursor-zoom-in  absolute rounded-lg top-0 left-0 s transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>

    </div>
  );
};

export default ImageZoom;