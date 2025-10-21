
import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import { ChevronRightIcon } from "lucide-react";
import clsx from "clsx";

interface CollectionsProps {
  collections: CollectionType[];
  layout?: "bento" | "grid";
}

const Collections = ({ collections, layout = "bento" }: CollectionsProps) => {
  if (!collections || collections.length === 0) return null;

  const limit = layout === "bento" ? 4 : 6;

  const layoutGridClasses = {
    bento: "grid gap-2 sm:gap-3 px-2 sm:px-14 grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    grid: "grid gap-2 px-2 sm:px-14 grid-cols-2 md:grid-cols-3",
  };


  const bentoSizeClasses = [
    "max-sm:max-h-[180px] col-span-2 sm:row-span-2",
    "sm:row-span-2",
    "row-span-1",
    "max-sm:max-h-[180px] max-sm:col-span-2 row-span-1",
    "row-span-1",
  ];
  return (
    <section
      id="collections"
      className="flex flex-col items-center py-4 sm:px-5 my-[2rem] overflow-hidden relative"
    >
      <h1 className="text-heading3-bold sm:text-heading1-bold">
        Discover Collections
      </h1>
      <p className="max-md:mx-2 sm:text-body-semibold text-gray-600 text-center mt-2 mb-8 text-small-medium capitalize">
        From trending picks to timeless essentials, shop collections designed for every occasion.
      </p>

      <div className={layoutGridClasses[layout]}>
        {collections.slice(0,limit).map((collection, index) => {
          const sizeClass =
            layout === "bento" ? bentoSizeClasses[index % bentoSizeClasses.length] : "";

          const cardWrapperClass = clsx(
            "relative overflow-hidden max-sm:h-[200px] group break-inside-avoid",
            sizeClass
          );

          return (
            <div key={collection.title + index} className={cardWrapperClass}>
              <SmartLink
                prefetch={index === 0 ? true : undefined}
                title={`See full ${collection.title} Collection`}
                href={`/collections/${collection.title}`}
              >
                <Image
                  loading="lazy"
                  src={collection.image}
                  placeholder="blur"
                  blurDataURL="/fallback-banner.avif"
                  alt={`${collection.title} collection image`}
                  width={511}
                  height={511}
                  className={clsx(
                    "object-cover w-full h-full duration-300 transition-transform",
                    "group-hover:scale-105"
                  )}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, black 0%, transparent 20%)`,
                    opacity: 0.6,
                  }}
                />
                <button
                  className="flex w-full font-mono absolute text-white justify-between bottom-0 sm:min-h-14 sm:min-w-14 items-center font-medium capitalize text-[16px] sm:text-[22px] px-3 sm:py-2 rounded-md"
                  title={`Shop at ${collection.title} collection now`}
                >
                  {collection.title}({collection.productCount})
                  <ChevronRightIcon className="size-[1rem] sm:size-[2rem] group-hover:translate-x-2 duration-300" />
                </button>
              </SmartLink>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Collections;
