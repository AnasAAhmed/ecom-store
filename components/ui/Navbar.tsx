"use client";

import useCart, { useWhishListUserStore } from "@/lib/hooks/useCart";
import { CircleUserRound, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Currency from "../Currency";
import { signOut, useSession } from "next-auth/react";
import { Session } from "@auth/core/types";
import Modal from "./Modal";

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useCart();


  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const page = params.get("page");
    if (page) params.delete("page");
    router.push(`/search?query=${query}`);
  };

  const f = params.get('query') || ''
  useEffect(() => {
    setQuery(f)
  }, [f]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 50) {
        // setScrolled(true);
        if (scrollTop > lastScrollY) {
          setScrolled(false); // Scroll down
        } else {
          setScrolled(true); // Scroll up
        }
        setLastScrollY(scrollTop);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);
  const toggleModal = () => setIsOpen(!isOpen);
  const text = [
    { id: 1, text: "Free Shipping around the world over $120  " },
    { id: 2, text: "Easter Summer sale 50% off " },
    { id: 3, text: "Free Shipping  all over Pakistan over Rs 2000 " },
  ];
  return (
    <>
      <div className="overflow-hidden text-white py-2 bg-black border-b border-gray-300">
        <div className="relative w-full">
          <div className="flex gap-24 animate-marquee2 w-max">
            {[...text, ...text].map((i, _) => (
              <div key={`${i.id}-${_ + i.id}`} id={`${i.id}-${_ + i.id}`} className="flex items-center justify-center min-w-[120px]">
                <p>&nbsp;{i.text}&nbsp;•</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <nav className="py-2 px-4 hidden lg:flex justify-between text-sm sm:text-base font-medium text-gray-800 bg-gradient-to-r from-white via-gray-50 to-white border-y border-gray-200">

        <h1 className="text-red-600 font-bold px-4">🔥 50% Off Summer Sale</h1>

        <div className="flex gap-6 items-center">
          {['men', 'women', 'kids', 'footwear', 'accessories'].map((item) => (
            <Link
              title={`${item} collection`}
              key={item}
              prefetch={false}
              aria-label={item}
              href={`/collections/${item}`}
              className="hover:text-black text-gray-600 transition-colors duration-200 border-b-2 border-transparent hover:border-black"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
        <h1 className="text-blue-600 px-4 max-md:hidden">
          📞 Help: <a title="Call us" href="tel:+845466789">+84 546-6789</a>
        </h1>
      </nav>

      <nav className={`${scrolled ? 'top-0 fixed shadow-md bg-white' : 'top-13 lg:top-[85px] absolute bg-transparent'} z-30 w-full bg-white shadow-md`}>
        <div className="flex justify-between items-center p-2">
          <Link title="home" aria-label="go to home" href="/">
            <Image src="/logo.png" alt=" borcelle logo" width={130} height={34} className="h-[35px]" />
          </Link>

          {/* Desktop search bar */}
          <form onSubmit={(e) => handleSearch(e)} className="hidden sm:flex items-center gap-3 border rounded-lg px-3 py-1">
            <input
              className="outline-none w-full"
              placeholder="Search..."
              value={query}
              type="search"
              list="pp"
              onChange={(e) => setQuery(e.target.value)}
            />
            <datalist id="pp">
              <option value="Gray sneakers with dense surface">Gray sneakers with dense surface</option>
              <option value="Casual dark gray tshirt">Casual dark gray tshirt</option>
              <option value="Casual white T shirt">Casual white T shirt</option>
              <option value="Sony PS5 Console">Sony PS5 Console</option>
              <option value="Trendycasual sneaker-Light weight fashion sheos white">Trendycasual sneaker-Light weight fashion sheos white</option>
              <option value="Rain Jacket Women Windbreaker Striped Climbing">Rain Jacket Women Windbreaker Striped Climbing</option>
              <option value="BIYLACLESEN Women 3 in 1 Snowboard Jacket Winter Coats">BIYLACLESEN Women 3 in 1 Snowboard Jacket Winter Coats</option>
            </datalist>
            <button title="Confirm Search" type="submit"> <Search className="cursor-pointer h-4 w-4 hover:text-blue-500" /></button>
          </form>

          <div className="hidden lg:flex gap-4">
            {["/", "/search", "/contact", "/wishlist", "/orders"].map(
              (path, idx) => (
                <Link
                  title={"Go to " + ["Home", "Shop", "Contact", "Wishlist", "Orders"][idx]}
                  key={idx}
                  href={path}
                  prefetch={false}
                  aria-label={path}
                  className={`hover:text-blue-500 ${pathname === path && "text-blue-500"}`}
                >
                  {["Home", "Shop", "Contact", "Wishlist", "Orders"][idx]}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <Currency className="none" />
            <Link title="Go to Cart" aria-label={'Go to cart'} href="/cart" className="hidden md:flex items-center gap-1 border px-1 py-1 rounded-lg hover:bg-black hover:text-white">
              <ShoppingCart />
              <span>({cart.cartItems.length})</span>
            </Link>
            <User session={session} />
            <button title="mobile hamburger menu" aria-label="mobile hamburger menu" id="Mob-menu" onClick={toggleModal} onBlur={() => setTimeout(() => setIsOpen(false), 70)}>
              <Menu className="lg:hidden cursor-pointer" size={'1.7rem'} />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="px-4 flex sm:hidden pb-2">
          <form onSubmit={(e) => handleSearch(e)} className="flex sm:hidden w-full items-center border rounded-lg px-4 py-1">
            <input
              list="pp"
              className="outline-none w-full"
              placeholder="Search..."
              value={query}
              type="search"
              onChange={(e) => setQuery(e.target.value)}
            />
            <datalist id="pp">
              <option value="Gray sneakers with dense surface">Gray sneakers with dense surface</option>
              <option value="Casual dark gray tshirt">Casual dark gray tshirt</option>
              <option value="Casual white T shirt">Casual white T shirt</option>
              <option value="Sony PS5 Console">Sony PS5 Console</option>
              <option value="Trendycasual sneaker-Light weight fashion sheos white">Trendycasual sneaker-Light weight fashion sheos white</option>
              <option value="Rain Jacket Women Windbreaker Striped Climbing">Rain Jacket Women Windbreaker Striped Climbing</option>
              <option value="BIYLACLESEN Women 3 in 1 Snowboard Jacket Winter Coats">BIYLACLESEN Women 3 in 1 Snowboard Jacket Winter Coats</option>
            </datalist>
            <button title="Confirm Search" type="submit"><Search className="cursor-pointer h-4 w-4 hover:text-blue-500" /></button>
          </form>
        </div>
        {/* Mobile Modal */}
        {isOpen && <div className="fixed flex lg:hidden right-6 max-sm:top-20 items-center justify-center bg-opacity-50 z-50">
          <ul className="flex flex-col p-4 gap-3 bg-white animate-menu rounded-lg border">

            {["/", "/search", "/contact", "/blog", "/wishlist", "/orders"].map((name, idx) => (
              <Link
                key={idx}
                href={name}
                aria-label={name}
                className="border-b px-8 text-center"
                prefetch={false}
              >
                {["Home", "Shop", "Contact", "Blog", "Wishlist", "Orders"][idx]}

              </Link>
            ))}
            <Link title="Go to cart" aria-label={'go to cart'} href="/cart" className="flex items-center gap-2 border rounded-lg px-2 py-1 hover:bg-black hover:text-white" >
              <ShoppingCart />
              <span>({cart.cartItems.length})</span>
            </Link>
          </ul>
        </div>}
      </nav>
    </>
  );
};
const User = ({ session }: { session: Session | null }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { userWishlist } = useWhishListUserStore();
  const closeModal = () => setOpen(false);

  return (
    <div className="relative">
      {session?.user ? (
        <>
          <button
            title="Avatar dropdown"
            onClick={() => setOpen(!open)}
            className="rounded-full hover:opacity-80 transition-opacity"
          >
            <Image
              src={session.user.image ?? "/default-avatar.png"}
              alt="avatar"
              width={32}
              height={32}
              className="w-8 h-8 mt-1 rounded-full object-cover"
            />
          </button>

          <Modal isOpen={open} onClose={closeModal} overLay>
            <div className="animate-modal bg-white shadow-xl rounded-lg border border-gray-200 p-4 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-heading4-bold font-semibold text-gray-800">Account Details</h4>
                <button
                  title="Close modal"
                  onClick={closeModal}
                  className="text-gray-600 hover:text-black text-heading3-base font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Name:</strong> {session.user.name}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p className="capitalize"><strong>Origin Country:</strong> {userWishlist?.country || "N/A"}</p>
                <p className="capitalize"><strong>Origin City:</strong> {userWishlist?.city || "N/A"}</p>
              </div>

              <div className="mt-4">
                <h5 className="font-medium text-gray-800 mb-2">Sign-in History (last 3):</h5>
                {userWishlist?.signInHistory?.length ? (
                  <ul className="space-y-2 max-h-48 overflow-y-auto text-sm text-gray-700">
                    {userWishlist.signInHistory.map((entry, index) => (
                      <li key={index} className="bg-gray-100 rounded-md p-3 border">
                        <p><strong>Date:</strong> {new Date(entry.signedInAt).toLocaleString()}</p>
                        <p><strong>Location:</strong> {entry.city}, {entry.country}</p>
                        <p><strong>Device:</strong> {entry.device} ({entry.os})</p>
                        <p><strong>Browser:</strong> {entry.browser}</p>
                        <p><strong>IP:</strong> {entry.ip}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">No sign-in history available.</p>
                )}
              </div>

              <button
                onClick={() => signOut()}
                title="Sign out"
                className="w-full mt-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </Modal>
        </>
      ) : (
        <Link
          title="Login"
          prefetch={false}
          href={`/login?redirect_url=${encodeURIComponent(pathname)}`}
        >
          <CircleUserRound className="w-8 h-8 text-gray-700 hover:text-black transition-colors cursor-pointer" />
        </Link>
      )}
    </div>
  )
}

export default Navbar;
