import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import { ChevronRightIcon } from "lucide-react";

const Collections = ({ collections }: { collections: CollectionType[] }) => {
  const sizeClasses = [
    "col-span-2 sm:row-span-2",
    "sm:row-span-2",
    "row-span-1",
    "max-sm:col-span-2 row-span-1",
    "row-span-1",
  ];
  return (
    <div
      id="collections"
      className="flex flex-col items-center pb-8 sm:px-5 my-[3rem] overflow-hidden relative"
    >
      <h1 className="text-heading3-bold sm:text-heading1-bold">Discover Collections</h1>
      <p className="max-md:mx-2 sm:text-body-semibold text-gray-600 text-center mt-2 mb-8 text-small-medium capitalize">
        From trending picks to timeless essentials, shop collections designed for every occasion.</p>

      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="grid gap-4 px-4 grid-rows-3 sm:grid-rows-2 sm:px-14 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

          {collections.map((collection, index) => (
            <div
              key={index}
              className={`relative rounded-lg overflow-hidden group ${sizeClasses[index]}`}
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
                  alt={collection.title + "collection image"}
                  width={511}
                  unoptimized
                  height={511}
                  className="object-cover w-full h-full duration-300 group-hover:scale-105 transition-transform"
                />
                <div className="group absolute bottom-0 sm:m-2 py-1 px-4 z-10 bg-black/40 text-white rounded-md">
                  <button
                    className="flex sm:min-h-14 sm:min-w-14 items-center font-semibold capitalize text-[12px] sm:text-[14px] px-3 sm:py-2 rounded-md"
                    title={`Shop at ${collection.title} collection now`}
                  >
                    {collection.title}<ChevronRightIcon size={'1rem'} className="group-hover:translate-x-2 duration-300" />
                  </button>
                </div>
              </SmartLink>
            </div>
          ))}
          {/* <div
            className="relative border rounded-lg overflow-hidden group p-6 flex flex-col justify-between bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
            style={{
              gridColumn: 'span 1 /span 1',
              gridRow: 'span 1 /span 1'
            }}
          >
            <SmartLink className="group" title="See full Collection" href="/collections/">
              <div className="flex flex-col items-start gap-3">
                <h1 className="flex items-center text-lg sm:text-xl font-bold capitalize">
                  All Collections <ChevronRightIcon className="group-hover:translate-x-2 duration-300" />
                </h1>
                <p className="text-sm max-sm:text-[10px] sm:text-base text-gray-300">
                  Browse through curated categories and discover more.
                </p>
              </div>
            </SmartLink>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default Collections;
