"use client"

import Image from "next/image";
import React, { useState } from "react";

const Gallery = ({ productMedia }: { productMedia: string[] }) => {
  const [mainImage, setMainImage] = useState(productMedia[0]);
  return (
    <div className="flex flex-col gap-3 ">
      {/* <ImageZoom src={mainImage} alt={"product"} /> */}
      <Image
        unoptimized={mainImage !== productMedia[0]}
        src={mainImage}
        placeholder="blur"
        blurDataURL="/fallback-banner.png"
        alt={'product'}
        width={500}
        height={500}
        className="rounded-lg h-[270px] xsm:h-[380px] sm:h-[420px] md:h-[450px] object-cover duration-300 transition-opacity" />
      <div className="flex gap-2 overflow-auto tailwind-scrollbar-hide">
        {productMedia.map((image, index) => (
          <Image
            key={index}
            // unoptimized
            loading="lazy"
            src={image}
            height={200}
            width={200}
            placeholder="blur"
            blurDataURL="/fallback-banner.png"
            alt="product"
            className={`w-20 h-20 rounded-lg object-cover cursor-pointer ${mainImage === image ? "border-2 border-black" : ""}`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
