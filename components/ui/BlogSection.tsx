'use client'
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import FadeInOnView from "../FadeInView";

const BlogSection = () => {
  return (
    <section className="flex flex-col items-center justify-center pt-14 px-5 pb-13 gap-16 max-w-full text-left text-2xl text-black font-poppins">
      <div className="w-full flex flex-col items-center justify-center text-center gap-3">
        <h1 className="text-3xl font-medium">Our Blogs</h1>
        <p className="text-gray-500">Find a bright idea to suit your taste with our great selection</p>
      </div>
      <div className="w-full flex flex-wrap items-start justify-center gap-8">
        <GroupComponent3 key={1} blogCardImage="/blog1.png" index={0.1} />
        <GroupComponent3 key={2} blogCardImage="/blog2.png" index={0.2} />
        <GroupComponent3 key={3} blogCardImage="/blog3.png" index={0.4} />
      </div>
      <div className="flex flex-col items-center">
        <SmartLink title="Veiw all blogs" href="/blog" className="text-lg font-medium">View All Posts</SmartLink>
        <div className="border-t-2 border-black w-16 mt-2"></div>
      </div>
    </section>
  );
};

export type GroupComponent3Type = {
  blogCardImage: string;
  index: number;
};

const GroupComponent3 = ({ blogCardImage, index }: GroupComponent3Type) => {
  return (
    <FadeInOnView delay={300} threshold={0.3+index} animation="animate-fadeIn">
      <div className="flex flex-col items-start justify-start gap-3 sm:gap-8  max-w-full text-left text-lg text-black font-poppins">
        <Image
          className="self-stretch h-96 relative rounded-md max-w-full object-cover"
          alt="Blog"
          width={400}
          height={222}
          src={blogCardImage}
        />
        <div className="self-stretch flex flex-col items-start justify-start p-4 box-border max-w-full">
          <div className="text-xl">Going all-in with millennial design</div>
          <SmartLink title={"Read more on our blog page " + blogCardImage.slice(4, 6)} href='/blog' className="text-2xl font-medium" >Read More</SmartLink>
          <div className="flex items-center justify-between w-full mt-4">
            <div className="flex items-center gap-2">
              <Clock />
              <span className="font-light">5 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar />
              <span className="font-light">12<sup>th</sup> Oct 2022</span>
            </div>
          </div>
        </div>
      </div>
    </FadeInOnView>
  );
};


export default BlogSection