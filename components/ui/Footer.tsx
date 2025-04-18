import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full px-4 py-10 bg-white border-t border-gray-200 md:px-20">
      <div className="grid gap-10 md:grid-cols-3">
        {/* Logo & Address */}
        <div>
          <Link href="/" title="Home" className="block mb-4">
            <Image src="/logo.png" alt="logo" width={130} height={100} />
          </Link>
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

        {/* Navigation Links */}
        <div>
          <h4 className="mb-4 text-lg font-semibold text-black">Quick Links</h4>
          <ul className="space-y-2 text-sm font-medium text-gray-700">
            <li><Link href="/" className="hover:text-black">Home</Link></li>
            <li><Link href="/search" className="hover:text-black">Shop</Link></li>
            <li><Link href="/contact" className="hover:text-black">About</Link></li>
            <li><Link href="/blog" className="hover:text-black">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-black">Contact</Link></li>
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
            <p><Link href="/contact" className="hover:text-black">Returns</Link></p>
            <p><Link href="/contact" className="hover:text-black">Privacy Policies</Link></p>
            <p><Link href="/contact" className="hover:text-black">Help</Link></p>
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
