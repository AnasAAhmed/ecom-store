import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import Currency from "../Currency";

const Footer = () => {
  return (
    <footer className="print:hidden w-full px-4 pt-10 pb-5 bg-white border-t border-gray-200 md:px-20">
      <div className="grid gap-10 md:grid-cols-3">
        {/* Logo & Address */}
        <div>
          <SmartLink href="/" title="Home" className="block mb-4">
            <Image src="/logo.png" className="brightness-0 invert-0" alt="logo" width={130} height={100} />
          </SmartLink>
          <p className="text-sm text-gray-600 leading-relaxed">
            400 University Drive Suite 200 <br />
            Coral Gables, FL 33134 USA
          </p>
          <a
            title="Call us"
            href="tel:+84 546-6789"
            className="block mt-4 text-sm font-medium text-black hover:underline"
          >
            +(84) 546-6789
          </a>
          <a
            title="Email me"
            href="mailto:anasahmedd244@gmail.com"
            className="block text-sm font-medium text-black hover:underline"
          >
            anasahmedd244@gmail.com
          </a>
        </div>

        {/* Navigation SmartLinks */}
        <div>
          <p className="mb-4 text-lg font-semibold text-black">Quick SmartLinks</p>
          <ul className="space-y-2 text-sm font-medium text-gray-700">
            <li><SmartLink href="/" className="hover:text-black">Home</SmartLink></li>
            <li><SmartLink href="/search" prefetch={false} className="hover:text-black">Shop</SmartLink></li>
            <li><SmartLink href="/contact" className="hover:text-black">About</SmartLink></li>
            <li><SmartLink href="/blog" className="hover:text-black">Blog</SmartLink></li>
            <li><SmartLink href="/contact" className="hover:text-black">Contact</SmartLink></li>
          </ul>
        </div>

        {/* Newsletter & Info */}
        <div>
          <p className="mb-4 text-lg font-semibold text-black">Stay Updated</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              id="femail"
              name="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 text-sm border border-black rounded-md"
            />
            <button
              type="submit"
              title="Subscribe to our newsletter"
              className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-md hover:opacity-70"
            >
              SUBSCRIBE
            </button>
          </form>
          <div className="mt-6 space-y-2 text-sm text-gray-700">
            <p><strong>Payment Options:</strong> COD / Online</p>
            <div className="sm:hidden">
              {/* <Currency className="sm:hidden" /> */}
            </div>
            <p><SmartLink href="/contact" className="hover:text-black">Returns</SmartLink></p>
            <p><SmartLink href="/contact" className="hover:text-black">Privacy Policies</SmartLink></p>
            <p><SmartLink href="/contact" className="hover:text-black">Help</SmartLink></p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-5 border-t border-gray-200 pt-3 text-sm text-center text-gray-600">
        &copy; {new Date().getFullYear()} Borcelle Ecommerce Store & CMS — Made by Anas Ahmed(Full Stack Developer).
        <br />Page last update at {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        })}
      </div>
      <div className="mt-5 border-t border-gray-200 pt-2 text-sm text-center text-gray-600">
        Every Info, Products, Images and Videos in this site is not mine, this is just the Demo Project just to showcase my skills e.g Nextjs, Mern, Caching Strategies, Mongoose, CMS
      </div>
    </footer>
  );
};

export default Footer;
