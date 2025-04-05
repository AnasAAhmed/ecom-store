"use client";

import useCart from "@/lib/hooks/useCart";
import { CircleUserRound, Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Currency from "../Currency";
import { signOut, useSession } from "next-auth/react";
import { Session } from "@auth/core/types";

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const { data: session } = useSession();
  const cart = useCart();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = () => {
    const page = params.get("page");
    if (page) params.delete("page");
    router.push(`/search?query=${query}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query) handleSearch();
  };

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="hidden sm:flex justify-between items-center w-full bg-black text-white h-10 py-2 px-4">
        <h1 className="font-mono text-heading2-bold">50% Off</h1>
        <div className="flex gap-4 text-base-bold">
          {["watch", "hat", "shoes", "kids", "women", "men"].map((item) => (
            <Link
              title={item + " collection"}
              key={item}
              prefetch={false}
              aria-label={item}
              href={`/collections/${item}`}
              className="hover:border-white border-b-2 border-black"
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>
        <h1>Help: <a title="get help at tel:+(84) 546-6789" href="tel:+84 546-6789" >+(84) 546-6789</a>
        </h1>
      </nav>

      <nav className="sticky max-sm:fixed top-0 z-30 w-full bg-white shadow-md">
        <div className="flex justify-between items-center p-2">
          <Link title="home" aria-label="go to home" href="/">
            <Image src="/logo.png" priority alt="logo" width={130} height={130} />
          </Link>

          {/* Desktop search bar */}
          <div className="hidden sm:flex items-center gap-3 border rounded-lg px-3 py-1">
            <input
              className="outline-none w-full"
              placeholder="Search..."
              value={query}
              type="search"
              onKeyDown={onKeyDown}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button title="Confirm Search"> <Search onClick={handleSearch} className="cursor-pointer h-4 w-4 hover:text-blue-500" /></button>
          </div>

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
           <User session={session}/>
            <button title="mobile hamburger menu" aria-label="mobile hamburger menu" id="Mob-menu" onClick={toggleModal} onBlur={() => setTimeout(() => setIsOpen(false), 70)}>
              <Menu className="lg:hidden cursor-pointer" size={'1.7rem'} />
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="px-4 flex sm:hidden pb-2">
          <div className="flex sm:hidden w-full items-center border rounded-lg px-4 py-1">
            <input
              className="outline-none w-full"
              placeholder="Search..."
              value={query}
              onKeyDown={onKeyDown}
              type="search"
              onChange={(e) => setQuery(e.target.value)}
            />
            <button title="Confirm Search"> <Search onClick={handleSearch} className="cursor-pointer h-4 w-4 hover:text-blue-500" /></button>
          </div>
        </div>
        {/* Mobile Modal */}
        {isOpen && <div className="fixed flex lg:hidden right-6 top-7 items-center justify-center bg-opacity-50 z-50">
          <ul className="flex flex-col p-4 gap-3 bg-white animate-modal rounded-lg border">

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
  return (
    <div className="relative"onBlur={()=>setTimeout(()=>setOpen(false),120)}>
    {session?.user ? (
      <>
      <button title="Avatar dropdown btn"onClick={() => setOpen(!open)}>
        <img
          src={session.user.image ?? ""}
          alt="avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          
        />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-s48 bg-white shadow-lg rounded-md p-2 border border-gray-200">
            <p className="text-sm rounded-md cursor-pointer hover:bg-gray-100 p-2 py-2 text-gray-700">{session.user.email}</p>
            <button
              className="w-full text-left p-2 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </div>
        )}
      </>
    ) : (
      <Link title="Login" prefetch={false} href={`/login?redirect_url=${encodeURIComponent(pathname)}`}>
        <CircleUserRound className="w-8 h-8 cursor-pointer" />
      </Link>
    )}
  </div>
  )
}

export default Navbar;
