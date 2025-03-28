import { Calendar, Tag, User2 } from "lucide-react";
import type { NextPage } from "next";
import Image from "next/image";
import { useMemo, type CSSProperties } from "react";

export type GroupComponent13Type = {
  className?: string;
  previewImages?: string;
  wood?: string;
  goingAllInWithMillennialD?: string;

  /** Style props */
  propWidth?: CSSProperties["width"];
  propFlex?: CSSProperties["flex"];
  propMinWidth?: CSSProperties["minWidth"];
  propFlex1?: CSSProperties["flex"];
  propMinWidth1?: CSSProperties["minWidth"];
  propMinWidth2?: CSSProperties["minWidth"];
};

const GroupComponent13: NextPage<GroupComponent13Type> = ({
  className = "",
  previewImages,
  wood,
  goingAllInWithMillennialD,
  propWidth,
  propFlex,
  propMinWidth,
  propFlex1,
  propMinWidth1,
  propMinWidth2,
}) => {
  const postCategoriesStyle: CSSProperties = useMemo(() => {
    return {
      width: propWidth,
    };
  }, [propWidth]);

  const dateIconsStyle: CSSProperties = useMemo(() => {
    return {
      flex: propFlex,
      minWidth: propMinWidth,
    };
  }, [propFlex, propMinWidth]);

  const tagIconsStyle: CSSProperties = useMemo(() => {
    return {
      flex: propFlex1,
      minWidth: propMinWidth1,
    };
  }, [propFlex1, propMinWidth1]);

  const woodStyle: CSSProperties = useMemo(() => {
    return {
      minWidth: propMinWidth2,
    };
  }, [propMinWidth2]);

  return (
    <div
      className={`self-stretch flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[4.125rem] box-border gap-[1.062rem] max-w-full text-left text-[1rem] text-darkgray font-poppins mq450:h-auto mq450:pb-[1.75rem] mq450:box-border mq1150:pb-[2.688rem] mq1150:box-border ${className}`}
    >
      <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pr-[0rem] pl-[0.187rem] box-border max-w-full">
        <Image
          className="h-[31.25rem] flex-1 relative rounded-md max-w-full overflow-hidden object-cover"
          alt="blog"
          width={500}
          height={500}
          src={previewImages!}
        />
      </div>
      <div className="self-stretch flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0.812rem] box-border gap-[0.75rem] max-w-full shrink-0">
        <div className="flex flex-col items-start justify-start gap-[0.937rem] max-w-full">
          <div
            className="flex flex-row items-start justify-start gap-[2.187rem] max-w-full mq450:gap-[1.063rem]"
            style={postCategoriesStyle}
          >
            <div className="flex flex-row items-start justify-start gap-[0.437rem]">
              <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                <User2 className="w-[1.25rem] h-[1.25rem] relative overflow-hidden shrink-0" />
              </div>
              <div className="relative inline-block min-w-[3.313rem]">
                Admin
              </div>
            </div>
            <div
              className="flex flex-row items-start justify-start gap-[0.687rem]"
              style={dateIconsStyle}
            >
             
              <Calendar className="w-[1.25rem] h-[1.25rem] relative overflow-hidden shrink-0"/>
              <div className="relative inline-block min-w-[5.625rem]">
                14 Oct 2022
              </div>
            </div>
            <div
              className="flex flex-row items-start justify-start gap-[0.437rem]"
              style={tagIconsStyle}
            >
             <Tag className="h-[1.5rem] w-[1.5rem] relative overflow-hidden shrink-0 min-h-[1.5rem]"/>
              <div
                className="relative inline-block min-w-[2.938rem]"
                style={woodStyle}
              >
                {wood}
              </div>
            </div>
          </div>
          <div className="flex flex-row items-start justify-start py-[0rem] pr-[0rem] pl-[0.187rem] text-[1.875rem] text-black">
            <h2 className="m-0 relative text-inherit font-medium font-inherit mq450:text-[1.125rem] mq800:text-[1.5rem]">
              {goingAllInWithMillennialD}
            </h2>
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pr-[0rem] pl-[0.187rem] box-border max-w-full text-justify text-[0.938rem]">
          <div className="flex-1 relative leading-[150%] inline-block max-w-full">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Mus
            mauris vitae ultricies leo integer malesuada nunc. In nulla posuere
            sollicitudin aliquam ultrices. Morbi blandit cursus risus at
            ultrices mi tempus imperdiet. Libero enim sed faucibus turpis in.
            Cursus mattis molestie a iaculis at erat. Nibh cras pulvinar mattis
            nunc sed blandit libero. Pellentesque elit ullamcorper dignissim
            cras tincidunt. Pharetra et ultrices neque ornare aenean euismod
            elementum.
          </div>
        </div>
      </div>
      <div className="w-[5.938rem] flex flex-row items-start justify-start py-[0rem] px-[0.187rem] box-border text-justify text-black">
        <div className="flex-1 flex flex-col items-start justify-start gap-[0.75rem]">
          <div className="relative inline-block min-w-[5.563rem]">
            Read more
          </div>
          <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pr-[0.312rem] pl-[0.375rem]">
            <div className="h-[0.063rem] flex-1 relative box-border border-t-[1px] border-solid border-black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupComponent13;