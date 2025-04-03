'use client'
import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogSection = () => {
  return (
    <section className="flex flex-col items-center justify-center pt-14 px-5 pb-13 gap-16 max-w-full text-left text-2xl text-black font-poppins">
      <div className="w-full flex flex-col items-center justify-center text-center gap-3">
        <h1 className="text-3xl font-medium">Our Blogs</h1>
        <p className="text-gray-500">Find a bright idea to suit your taste with our great selection</p>
      </div>
      <div className="w-full flex flex-wrap items-start justify-center gap-8">
        <GroupComponent3 blogCardImage="/blog1.png" />
        <GroupComponent3 blogCardImage="/blog2.png" />
        <GroupComponent3 blogCardImage="/blog3.png" />
      </div>
      <div className="flex flex-col items-center">
        <Link title="Veiw all blogs" href="/blog" className="text-lg font-medium">View All Posts</Link>
        <div className="border-t-2 border-black w-16 mt-2"></div>
      </div>
    </section>
  );
};

export type GroupComponent3Type = {
  blogCardImage: string;
};

const GroupComponent3 = ({ blogCardImage }: GroupComponent3Type) => {
  return (
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
        <Link title={"Read more on our blog page "+blogCardImage.slice(4,6)} href='/blog' className="text-2xl font-medium" >Read More</Link>
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
  );
};


export default BlogSection