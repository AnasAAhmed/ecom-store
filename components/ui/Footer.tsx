import Image from "next/image";
import SmartLink from "@/components/SmartLink";

const Footer = () => {
  return (
    <footer className="print:hidden w-full px-4 py-10 bg-white border-t border-gray-200 md:px-20">
      <div className="grid gap-10 md:grid-cols-3">
        {/* Logo & Address */}
        <div>
          <SmartLink href="/" title="Home" className="block mb-4">
            <Image src="/logo.png" alt="logo" width={130} height={100} />
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
            href="mailto:anasahmedd244"
            className="block text-sm font-medium text-black hover:underline"
          >
           anasahmedd244@gmail.com
          </a>
        </div>

        {/* Navigation SmartLinks */}
        <div>
          <h4 className="mb-4 text-lg font-semibold text-black">Quick SmartLinks</h4>
          <ul className="space-y-2 text-sm font-medium text-gray-700">
            <li><SmartLink href="/" className="hover:text-black">Home</SmartLink></li>
            <li><SmartLink href="/search" className="hover:text-black">Shop</SmartLink></li>
            <li><SmartLink href="/contact" className="hover:text-black">About</SmartLink></li>
            <li><SmartLink href="/blog" className="hover:text-black">Blog</SmartLink></li>
            <li><SmartLink href="/contact" className="hover:text-black">Contact</SmartLink></li>
          </ul>
        </div>

        {/* Newsletter & Info */}
        <div>
          <h4 className="mb-4 text-lg font-semibold text-black">Stay Updated</h4>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
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
            <p><SmartLink href="/contact" className="hover:text-black">Returns</SmartLink></p>
            <p><SmartLink href="/contact" className="hover:text-black">Privacy Policies</SmartLink></p>
            <p><SmartLink href="/contact" className="hover:text-black">Help</SmartLink></p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-200 pt-6 text-sm text-center text-gray-600">
        &copy; 2024 Ecommerce — Made by Anas Ahmed. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
