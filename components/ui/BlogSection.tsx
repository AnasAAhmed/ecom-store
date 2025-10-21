'use client'
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import FadeInOnView from "../FadeInView";
import { blogs } from "@/lib/utils/features";

const BlogSection = () => {
  return (
    <section className="flex flex-col items-center justify-center pt-14 px-5 pb-13 gap-16 max-w-full text-left text-2xl text-black font-poppins">
      <div className="w-full flex flex-col items-center justify-center text-center gap-3">
        <h1 className="text-heading4-bold sm:text-heading2-bold font-medium">Our Blogs</h1>
        <p className="text-gray-500">Find a bright idea to suit your taste with our great selection</p>
      </div>
      <div className="w-full flex flex-wrap items-start justify-center gap-8">
        {blogs.map((i, _) => (
          <GroupComponent3
            key={_}
            previewImages={i.image}
            title={i.title}
            slug={i.slug}
            author={i.author}
            index={_+1}
            timeAgo={i.timeAgo}
            tags={i.tags}
            stringData={i.stringDate}
          />
        ))}
      </div>
      <div className="flex flex-col items-center">
        <SmartLink title="Veiw all blogs" href="/blog" className="text-lg font-medium">View All Posts</SmartLink>
        <div className="border-t-2 border-black w-16 mt-2"></div>
      </div>
    </section>
  );
};

export type GroupComponent3Type = {
  className?: string;
  previewImages: string;
  slug: string;
  title?: string;
  stringData: string;
  author: string;
  timeAgo: string;
  tags?: string[];
  index: number;
};

const GroupComponent3 = ({ className = "",
  previewImages,
  slug,
  stringData,
  title,
  timeAgo,
  author,
  tags,
  index
}: GroupComponent3Type) => {
  return (
    <FadeInOnView delay={200 * index} threshold={0.3} animation="animate-fadeInUp">
      <div className="flex flex-col items-start justify-start gap-3 sm:gap-8  max-w-full text-left text-lg text-black font-poppins">
        <Image
          className="self-stretch h-96 relative rounded-md max-w-full object-cover"
          alt="Blog"
          width={400}
          height={222}
          src={previewImages}
        />
        <div className="self-stretch flex flex-col items-start justify-start p-4 box-border max-w-full">
          <div className="text-body-semibold">{title}</div>
          <SmartLink title={"Read more on our blog page " + title} href={'/blog/' + slug} className="text-body-medium underline font-medium" >Read more </SmartLink>
          <div className="flex items-center justify-between w-full mt-4">
            <div className="flex items-center gap-2">
              <Clock />
              <span className="font-light">{timeAgo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar />
              <span className="font-light">{stringData}</span>
            </div>
          </div>
        </div>
      </div>
    </FadeInOnView>
  );
};


export default BlogSection