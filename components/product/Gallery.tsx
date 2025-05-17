"use client"

import Image from "next/image";
import React, { useState } from "react";

const Gallery = ({ productMedia }: { productMedia: string[] }) => {
  const [mainImage, setMainImage] = useState(productMedia[0]);
  return (
    <div className="flex flex-col gap-3 ">
      {/* <ImageZoom src={mainImage} alt={"product"} /> */}
      <Image
        // unoptimized
        src={mainImage}
        loading="lazy"
        // placeholder="blur"
        // blurDataURL="/fallback-banner.png"
        alt={'product'}
        width={500}
        height={500}
        className="rounded-lg md:h-[500px] object-cover transition-opacity" />

      <div className="flex gap-2 overflow-auto tailwind-scrollbar-hide">
        {productMedia.map((image, index) => (
          <Image
            key={index}
            unoptimized
            loading="lazy"
            src={image}
            height={200}
            width={200}
            placeholder="blur"
            blurDataURL="/fallback-banner.png"
            alt="product"
            className = {`w-20 h-20 rounded-lg object-cover cursor-pointer ${mainImage === image ? "border-2 border-black" : ""}`}
        onClick={() => setMainImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
