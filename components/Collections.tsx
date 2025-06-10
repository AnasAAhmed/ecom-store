'use client';

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import { useRef } from "react";

const Collections = ({ collections }: { collections: CollectionType[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id="collections" className="flex flex-col items-center gap-10 py-8 px-5 my-[4rem] overflow-hidden relative">
      <p className="text-heading2-bold sm:text-heading1-bold">Collections</p>

      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="relative w-full">
          <button
            aria-label="Scroll Left"
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar px-4 sm:px-14 snap-x snap-mandatory scroll-smooth"
          >
            {collections.map((collection, index) => (
              <div
                key={collection._id || collection.title}
                className="relative snap-start shrink-0 rounded-lg overflow-hidden group"
                style={{
                  width: 'min(300px, 80vw)',
                  aspectRatio: '16/11',
                  flex: '0 0 auto',
                }}
              >
                <SmartLink
                  title={`See full ${collection.title} Collection at Borcelle`}
                  href={`/collections/${collection.title}`}
                >
                  <Image
                    loading="lazy"
                    src={collection.image}
                    // unoptimized
                    placeholder="blur"
                    blurDataURL="/fallback-banner.avif"
                    alt={collection.title || 'collection image'}
                    fill
                    className="object-cover w-full h-full duration-300 group-hover:scale-110 transition-transform"
                    sizes="(max-width: 768px) 80vw, 300px"
                  />
                  <div className="absolute bottom-0 p-2 sm:p-4 z-10 bg-white/80 backdrop-blur-sm rounded-md">
                    <button
                      className="text-[12px] sm:text-[14px] font-semibold capitalize"
                      title={`Shop at ${collection.title} collection now`}
                    >
                      {collection.title}
                    </button>
                  </div>
                </SmartLink>
              </div>
            ))}
          </div>

          <button
            aria-label="Scroll Right"
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 shadow rounded-full hover:bg-gray-100"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default Collections;
