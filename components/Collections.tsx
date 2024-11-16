import { slugify, unSlugify } from "@/lib/utils/features";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Collections = async ({ collections }: { collections: CollectionType[] }) => {

  return (
    <div className="flex flex-col items-center gap-10 py-8 px-5 my-[4rem]">
      <p className="text-heading2-bold sm:text-heading1-bold">Collections</p>
      {!collections || collections.length === 0 ? (
        <p className="text-body-bold">No collections found</p>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-8">
          {collections.map((collection: CollectionType) => (
            <Link prefetch={false} href={`/collections/${slugify(collection.title)}`} key={collection._id} className="group relative">
              <Image
                key={collection._id}
                src={collection.image}
                alt={collection.title}
                width={350}
                height={200}
                className="rounded-lg cursor-pointer "
              />
              <h1 className="text-heading3-bold group-hover:left-7 duration-300 text-white absolute bottom-4 left-3">{unSlugify(collection.title)}</h1>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
