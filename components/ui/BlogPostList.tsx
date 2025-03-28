import type { NextPage } from "next";
import GroupComponent13 from "./BlogListCard";
import { Search } from "lucide-react";

export type BlogPostListType = {
  className?: string;
};

const BlogPostList: NextPage<BlogPostListType> = ({ className = "" }) => {
  return (
    <div
      className={`w-[77.688rem] flex flex-col md:flex-row items-start justify-start gap-[1.875rem] max-w-full text-left text-[1rem] text-darkgray font-poppins mq1150:flex-wrap ${className}`}
    >
      <div className="flex-1 flex flex-col items-start justify-start pt-[1.375rem] px-[0rem] pb-[0rem] box-border max-w-full mq800:min-w-full">
        <div className="self-stretch flex flex-col items-start justify-start gap-[3.375rem] max-w-full z-[1] mq450:gap-[1.688rem]">
          <GroupComponent13
            previewImages="/blog2.png"
            wood="Wood"
            goingAllInWithMillennialD="Going all-in with millennial design"
          />
          <GroupComponent13
            previewImages="/blog4.png"
            wood="Handmade"
            goingAllInWithMillennialD="Exploring new ways of decorating"
            propWidth="24.563rem"
            propFlex="1"
            propMinWidth="4.938rem"
            propFlex1="1"
            propMinWidth1="4.938rem"
            propMinWidth2="5.688rem"
          />
          <GroupComponent13
            previewImages="/blog5.png"
            wood="Wood"
            goingAllInWithMillennialD="Handmade pieces that took time to make"
            propWidth="unset"
            propFlex="unset"
            propMinWidth="unset"
            propFlex1="unset"
            propMinWidth1="unset"
            propMinWidth2="2.938rem"
          />
        </div>
      </div>
      <div className="w-[24.563rem] flex flex-col sm:items-start justify-start gap-[2.562rem] sm:min-w-[24.563rem] max-w-full text-[1.5rem] text-black mq450:gap-[1.25rem] mq800:min-w-full mq1150:flex-1">
        <div className="self-stretch bg-white flex flex-col items-end justify-start pt-[1.375rem] px-[2.562rem] pb-[3.812rem] box-border gap-[2.625rem] max-w-full z-[1] mq450:gap-[1.313rem] mq800:pt-[1.25rem] mq800:pb-[2.5rem] mq800:box-border">
          <div className="w-[24.563rem] h-[33.563rem] relative bg-white hidden max-w-full" />
          <div className="self-stretch rounded-3xs bg-white flex flex-row items-start justify-end py-[0.937rem] px-[0.625rem] z-[1] border-[1px] border-solid border-darkgray">
            <div className="h-[3.625rem] w-[19.438rem] relative rounded-3xs bg-white box-border hidden border-[1px] border-solid border-darkgray" />
           
            <Search className="h-[1.5rem] w-[1.5rem] relative overflow-hidden shrink-0 z-[1]"/>
          </div>
          <div className="w-[18.688rem] flex flex-row items-start justify-end py-[0rem] px-[1.5rem] box-border">
            <div className="flex-1 flex flex-col items-start justify-start gap-[2.062rem] mq450:gap-[1rem]">
              <h3 className="m-0 relative text-inherit font-medium font-inherit z-[1] mq450:text-[1.188rem]">
                Categories
              </h3>
              <div className="self-stretch flex flex-row items-start justify-between gap-[1.25rem] text-[1rem] text-darkgray">
                <div className="flex flex-col items-start justify-start gap-[2.562rem]">
                  <div className="relative inline-block min-w-[3.063rem] z-[1]">
                    Crafts
                  </div>
                  <div className="relative inline-block min-w-[3.438rem] z-[1]">
                    Design
                  </div>
                  <div className="relative inline-block min-w-[5.688rem] z-[1]">
                    Handmade
                  </div>
                </div>
                <div className="flex flex-col items-start justify-start gap-[2.562rem]">
                  <div className="relative inline-block min-w-[0.625rem] z-[1]">
                    2
                  </div>
                  <div className="relative inline-block min-w-[0.688rem] z-[1]">
                    8
                  </div>
                  <div className="relative inline-block min-w-[0.563rem] z-[1]">
                    7
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[18.688rem] flex flex-row items-start justify-end py-[0rem] px-[1.5rem] box-border text-[1rem] text-darkgray">
            <div className="flex-1 flex flex-row items-start justify-between gap-[1.25rem]">
              <div className="flex flex-col items-start justify-start gap-[2.562rem]">
                <div className="relative inline-block min-w-[3.563rem] z-[1]">
                  Interior
                </div>
                <div className="relative inline-block min-w-[2.938rem] z-[1]">
                  Wood
                </div>
              </div>
              <div className="flex flex-col items-start justify-start gap-[2.562rem]">
                <div className="relative inline-block min-w-[0.375rem] z-[1]">
                  1
                </div>
                <div className="relative inline-block min-w-[0.688rem] z-[1]">
                  6
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch bg-white flex flex-col items-start justify-start py-[1rem] pr-[4.062rem] sm:pl-[4.75rem] box-border gap-[1.625rem] max-w-full z-[1] text-[0.875rem] mq450:pl-[1.25rem] mq450:pr-[1.25rem] mq450:box-border">
          <div className="w-[24.563rem] h-[40.625rem] relative bg-white hidden max-w-full" />
          <div className="flex flex-row items-start justify-start py-[0rem] px-[0.062rem] text-[1.5rem]">
            <h3 className="m-0 relative text-inherit font-medium font-inherit z-[1] mq450:text-[1.188rem]">
              Recent Posts
            </h3>
          </div>
          <div className="w-[13.188rem] flex flex-row items-end justify-start pt-[0rem] px-[0rem] pb-[0.812rem] box-border gap-[0.75rem]">
            <img
              className="h-[5rem] w-[5rem] relative rounded-3xs object-cover z-[1]"
              loading="lazy"
              alt=""
              src="/blog5.png"
            />
            <div className="flex-1 flex flex-col items-start justify-end pt-[0rem] px-[0rem] pb-[0.437rem]">
              <div className="self-stretch flex flex-col items-start justify-start gap-[0.312rem]">
                <div className="self-stretch relative z-[1]">
                  Going all-in with millennial design
                </div>
                <div className="self-stretch relative text-[0.75rem] text-darkgray z-[1]">
                  03 Aug 2022
                </div>
              </div>
            </div>
          </div>
          <div className="w-[15.063rem] flex flex-row items-end justify-start pt-[0rem] px-[0rem] pb-[0.812rem] box-border gap-[0.75rem]">
            <img
              className="h-[5rem] w-[5rem] relative rounded-3xs object-cover z-[1]"
              loading="lazy"
              alt=""
              src="/blog3.png"
            />
            <div className="flex-1 flex flex-col items-start justify-end pt-[0rem] px-[0rem] pb-[0.437rem]">
              <div className="self-stretch flex flex-col items-start justify-start gap-[0.312rem]">
                <div className="self-stretch relative z-[1]">
                  Exploring new ways of decorating
                </div>
                <div className="w-[7.438rem] relative text-[0.75rem] text-darkgray inline-block z-[1]">
                  03 Aug 2022
                </div>
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-end justify-start pt-[0rem] px-[0rem] pb-[0.812rem] gap-[0.75rem]">
            <img
              className="h-[5rem] w-[5rem] relative rounded-3xs object-cover z-[1]"
              loading="lazy"
              alt=""
              src="/banner.avif"
            />
            <div className="flex-1 flex flex-col items-start justify-end pt-[0rem] px-[0rem] pb-[0.437rem]">
              <div className="self-stretch flex flex-col items-start justify-start gap-[0.312rem]">
                <div className="self-stretch relative z-[1]">
                  Handmade pieces that took time to make
                </div>
                <div className="w-[7.438rem] relative text-[0.75rem] text-darkgray inline-block z-[1]">
                  03 Aug 2022
                </div>
              </div>
            </div>
          </div>
          <div className="w-[13.188rem] flex flex-row items-end justify-start pt-[0rem] px-[0rem] pb-[0.812rem] box-border gap-[0.75rem]">
            <img
              className="h-[5rem] w-[5rem] relative rounded-3xs object-cover z-[1]"
              loading="lazy"
              alt=""
              src="banner2.avif"
            />
            <div className="flex-1 flex flex-col items-start justify-end pt-[0rem] px-[0rem] pb-[0.437rem]">
              <div className="self-stretch flex flex-col items-start justify-start gap-[0.312rem]">
                <div className="self-stretch relative z-[1]">
                  Modern home in Milan
                </div>
                <div className="self-stretch relative text-[0.75rem] text-darkgray z-[1]">
                  03 Aug 2022
                </div>
              </div>
            </div>
          </div>
          <div className="w-[13.188rem] flex flex-row items-end justify-start gap-[0.75rem]">
            <img
              className="h-[5rem] w-[5rem] relative rounded-3xs object-cover z-[1]"
              loading="lazy"
              alt=""
              src="/blog2.png"
            />
            <div className="flex-1 flex flex-col items-start justify-end pt-[0rem] px-[0rem] pb-[0.437rem]">
              <div className="self-stretch flex flex-col items-start justify-start gap-[0.312rem]">
                <div className="self-stretch relative z-[1]">
                  Colorful office redesign
                </div>
                <div className="self-stretch relative text-[0.75rem] text-darkgray z-[1]">
                  03 Aug 2022
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostList;