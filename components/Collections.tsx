import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import { ChevronRightIcon } from "lucide-react";

const Collections = ({ collections }: { collections: CollectionType[] }) => {
  const sizeClasses = [
    {
      imageSize: 511,
      gridColumn: "span 2 / span 2",
      gridRow: "span 2 / span 2",
    },
    {
      imageSize: 511,
      gridColumn: "span 1 / span 1",
      gridRow: "span 1 / span 1",
    },
    {
      imageSize: 511,
      gridColumn: "span 1 / span 1",
      gridRow: "span 1 / span 1",
    },
    {
      imageSize: 511,
      gridColumn: "span 1 / span 1",
      gridRow: "span 1 / span 1",
    },
    {
      imageSize: 511,
      gridColumn: "span 1 / span 1",
      gridRow: "span 1 / span 1",
    },
    {
      imageSize: 511,
      gridColumn: "span 1 / span 1",
      gridRow: "span 1 / span 1",
    },
    {
      imageSize: 511,
      gridColumn: "span 1 / span 1",
      gridRow: "span 1 / span 1",
    },
    {
      imageSize: 511,
      gridColumn: "span 1 / span 1",
      gridRow: "span 1 / span 1",
    },
    {
      imageSize: 511,
      gridColumn: "span 1 / span 1",
      gridRow: "span 1 / span 1",
    },
  ];
  return (
    <div
      id="collections"
      className="flex flex-col items-center py-8 sm:px-5 my-[4rem] overflow-hidden relative"
    >
      <h1 className="text-heading2-bold sm:text-heading1-bold">Discover Collections</h1>
      <p className="text-body-semibold mb-10 mt-2 text-gray-600 text-center sm:text-base-medium capitalize">From trending picks to timeless essentials, shop collections designed for every occasion.</p>

      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="grid gap-4 px-4 grid-rows-2 sm:px-14 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {collections.map((collection, index) => (
            <div
              key={index}
              // key={collection._id || collection.title}
              className={`relative rounded-lg overflow-hidden group `}
              style={{
                gridColumn: sizeClasses[index].gridColumn,
                gridRow: sizeClasses[index].gridRow
              }}
            >
              <SmartLink
                title={`See full ${collection.title} Collection`}
                href={`/collections/${collection.title}`}
              >
                <Image
                  loading="lazy"
                  src={collection.image}
                  placeholder="blur"
                  blurDataURL="/fallback-banner.avif"
                  alt={collection.title || "collection image"}
                  width={sizeClasses[index].imageSize}
                  height={sizeClasses[index].imageSize}
                  className="object-cover w-full h-full duration-300 group-hover:scale-110 transition-transform"
                  sizes="(max-width: 768px) 80vw, 300px"
                />
                <div className="group absolute bottom-0 sm:m-2 py-1 px-4 z-10 bg-black/40 text-white backdrop-blur-sm rounded-md">
                  <button
                    className="flex items-center text-[12px] sm:text-[14px] font-semibold capitalize"
                    title={`Shop at ${collection.title} collection now`}
                  >
                    {collection.title}<ChevronRightIcon size={'1rem'} className="group-hover:translate-x-2 duration-300" />
                  </button>
                </div>
              </SmartLink>
            </div>
          ))}
          <div
            className="relative border rounded-lg overflow-hidden group p-6 flex flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
            style={{
              gridColumn: 'span 1 /span 1',
              gridRow: 'span 1 /span 1'
            }}
          >
            <SmartLink title="See full Collection" href="/collections/">
              <div className="flex flex-col items-start gap-3">
                <h3 className="text-lg sm:text-xl font-bold capitalize">
                  All Collections
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Browse through curated categories and discover more.
                </p>
              </div>

              <div className="absolute bottom-0 py-1 px-4 sm:m-2 z-10 bg-black/60 text-white backdrop-blur-sm rounded-md">
                <button
                  className="flex items-center text-[12px] sm:text-[14px] font-semibold capitalize"
                  title="Shop at collection now"
                >
                  Explore <ChevronRightIcon className="group-hover:translate-x-2 duration-300" />
                </button>
              </div>
            </SmartLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
