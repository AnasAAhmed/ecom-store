import Image from "next/image";
import Link from "next/link";
const Collections = async ({ collections }: { collections: CollectionType[] }) => {
  const gridLayout = [
    { gridColumn: "span 2 / span 2", gridRow: "span 2 / span 2", imageSize: 511, aspectRatio: "2/6" },
    { gridColumn: "span 1 / span 1", gridRow: "span 1 / span 1", imageSize: 511, aspectRatio: "9/16" },
    { gridColumn: "span 1 / span 1", gridRow: "span 2 / span 2", imageSize: 511, aspectRatio: "1/1" },
    { gridColumn: "span 1 / span 1", gridRow: "span 1 / span 1", imageSize: 511, aspectRatio: "1/1" },
    { gridColumn: "span 1 / span 1", gridRow: "span1 / span 1", imageSize: 511, aspectRatio: "1/1" },
  ];


  return (
    <div id="collections" className="flex flex-col items-center gap-10 py-8 px-5 my-[4rem]">
        <p className="text-heading2-bold sm:text-heading1-bold">Collections</p>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="grid gap-4 px-4 sm:px-14 grid-cols-2 sca md:grid-cols-3 lg:grid-cols-4">
          {collections.map((collection, index) => (
            <article
              key={collection._id || collection.title}
              style={{ gridColumn: gridLayout[index].gridColumn, gridRow: gridLayout[index].gridRow }}
              className={`relative rounded-lg overflow-hidden group`}
            >
              <Link title={'See full ' + collection.title + " Collection at Borcelle"} href={'/collections/' + collection.title} className="">
                <Image
                  loading="lazy"
                  src={collection.image}
                  unoptimized
                  placeholder="blur"
                  blurDataURL="/fallback-banner.png"
                  alt={collection.title! || 'gridBanner'}
                  width={gridLayout[index].imageSize}
                  height={gridLayout[index].imageSize}
                  className={` relative duration-300 rounded-lg bg-cover bottom-0 object-cover w-full ${index < 1 ? 'group-hover:scale-125 scale-110' : 'group-hover:scale-110'} `}
                  aria-hidden="true"
                />
                <div className="cursor-pointer absolute bottom-0 p-2 sm:p-4 z-10">
                  <button
                    className="group-howver:translate-x-2 duration-300 rounded-md mt-4 py-1 px-2 sm:px-4 inline-flex items-center text-[10px] sm:text-[14px] font-semibold bg-white "
                    title={`Shop at ${collection.title} collection now`}
                  >
                    <span className="capitalize">{collection.title}</span>
                  </button>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;