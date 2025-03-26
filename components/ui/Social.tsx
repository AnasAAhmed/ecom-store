import Image from 'next/image'
import React from 'react'

const Social = () => {
  return (
    <div
    className={`self-stretch mt-8 flex flex-col items-center justify-start py-[7.75rem] px-[1.25rem] box-border relative gap-[1.125rem] max-w-full z-[7] text-left text-[3.75rem] text-black font-poppins mq450:pt-[5.063rem] mq450:pb-[5.063rem] mq450:box-border `}
  >
    <Image
      className="w-full h-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] max-w-full overflow-hidden max-h-full object-cover"
      alt="insta"
      width={1300}
      height={1300}
      src="/social.png"
    />
    <div className="flex flex-col items-start justify-center max-w-full">
      <h1 className="mx-auto relative text-heading2-bold sm:text-heading1-bold text-inherit font-bold font-inherit">
        Our Instagram
      </h1>
      <div className="flex text-center justify-center p-[0.45rem] pl-[3rem] text-body-semibold">
       
          Follow our store on Instagram
      </div>
    </div>
    <div className="w-[28.375rem] flex flex-row items-start justify-center py-[0rem] pr-[0.062rem] pl-[0rem] box-border max-w-full">
      <a title='Follow us on Instagram' href="https://instagram.com" target="blank" className="[border:none] py-[1.062rem] px-[1.25rem] rounded-full hover:opacity-45 w-[15.938rem] shadow-[0px_20px_20px_rgba(0,_0,_0,_0.1)] rounded-31xl flex flex-row items-start justify-center box-border whitespace-nowrap z-[1] hover:bg-gainsboro-100">
        <div className="h-[4rem] w-[15.938rem] relative rounded-31xl bg-snow-100 hidden" />
        <div className="h-[1.875rem] relative text-[1.25rem] font-poppins text-black text-left inline-block z-[1]">
          Follow Us
        </div>
      </a>
    </div>
  </div>
  )
}

export default Social
