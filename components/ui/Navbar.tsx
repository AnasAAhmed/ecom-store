"use client";

import useCart from "@/lib/hooks/useCart";
import { Menu, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import SmartLink from "@/components/SmartLink";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import Currency from "../Currency";
import { useProgressStore } from "@/lib/hooks/useProgressBar";
import User from "./User";

const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const cart = useCart();


  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const start = useProgressStore((state) => state.start);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    start();
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
  const toggleModal = () => setIsOpen(!isOpen);;
  return (
    <nav className={`${scrolled ? 'top-0 fixed shadow-md bg-white' : 'top-0 lg:top-[45px] absolute bg-transparent'} reslative print:hidden z-30 w-full bg-white shadow-md`}>
      <div className="flex justify-between items-center p-2">
        <SmartLink title="home" aria-label="go to home" href="/">
          <Image src="/logo.png" alt=" borcelle logo" width={130} height={34} />
        </SmartLink>

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
          <button title="Confirm Search" type="submit"> <Search className="cursor-pointer h-4 w-4 hover:text-blue-700" /></button>
        </form>

        <div className="hidden lg:flex gap-4">
          {["/", "/search", "/contact", "/wishlist", "/orders", "https://ecom-admin-panel-xcw7-gh8p.vercel.app/","/report"].map(
            (path, idx) => (
              <SmartLink
                title={"Go to " + ["Home", "Shop", "Contact", "Wishlist", "Orders", "CMS","Metrics"][idx]}
                key={idx}
                href={path}
                target={idx === 5 ? '_blank' : ''}
                aria-label={path}
                className={`hover:text-blue-700 ${pathname === path && "text-blue-500"}`}
              >
                {["Home", "Shop", "Contact", "Wishlist", "Orders", 'CMS'][idx]}
              </SmartLink>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <Currency className="none" />
          <SmartLink title="Go to Cart" prefetch={false} aria-label={'Go to cart'} href="/cart" className="hidden md:flex items-center gap-1 border px-1 py-1 rounded-lg hover:bg-black hover:text-white">
            <ShoppingCart />
            <span>({cart.cartItems.length})</span>
          </SmartLink>
          <User />
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
      {isOpen && <div className="absolute flex lg:hidden right-6 max-sm:top-10 items-center justify-center bg-opacity-50 z-50">
        <ul className="flex flex-col p-4 gap-3 w-full bg-white animate-menu rounded-lg border">

          {["/", "/search", "/contact", "/blog", "/wishlist", "/orders", "https://ecom-admin-panel-xcw7-gh8p.vercel.app/","/report"].map((name, idx) => (
            <SmartLink
              key={idx}
              href={name}
              aria-label={name}
              target={idx === 6 ? '_blank' : ''}
              className="border-b px-8 text-center"
            >
              {["Home", "Shop", "Contact", "Blog", "Wishlist", "Orders", "CMS","Metrics"][idx]}

            </SmartLink>
          ))}
          <SmartLink title="Go to cart" prefetch={false} aria-label={'go to cart'} href="/cart" className="flex items-center gap-2 border rounded-lg px-2 py-1 hover:bg-black hover:text-white" >
            <ShoppingCart />
            <span>({cart.cartItems.length})</span>
          </SmartLink>
        </ul>
      </div>}
    </nav>
  );
};


export default Navbar;
