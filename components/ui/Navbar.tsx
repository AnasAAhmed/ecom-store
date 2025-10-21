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
  const [open2, setOpen2] = useState(false);
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
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (scrollTop > 50) {
          if (scrollTop > lastScrollY) {
            setScrolled(false); // scrolling down
          } else {
            setScrolled(true); // scrolling up
          }
        } else {
          setScrolled(false);
        }
        setLastScrollY(scrollTop);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);
  const toggleModal = () => setIsOpen(!isOpen);

  const links = ["/", "/search", "/blog", "/contact", "/wishlist", "/orders", "https://ecom-admin-panel-xcw7-gh8p.vercel.app/", "https://my-projects-metrics.vercel.app/ecom-store/lighthouse.html"];
  const linksText = ["Home", "Shop", "Blogs", "Contact", "Wishlist", "Orders", 'CMS', 'Metrics'];
  const cols = [
    { title: 'Men', link: '/collections/men' },
    { title: 'Women', link: '/collections/women' },
    { title: 'Kids', link: '/collections/kids' },
    { title: 'Shoes', link: '/collections/shoes' },
    { title: 'Accessories', link: '/collections/accessories' },
    { title: 'New Arrivals', link: '/collections/new-arrivals' },
    { title: 'Sale', link: '/collections/sale' },
    { title: 'Sportswear', link: '/collections/sportswear' },
    { title: 'Casual', link: '/collections/casual' },
    { title: 'Formal', link: '/collections/formal' },
    { title: 'Footwear', link: '/collections/footwear' },
  ];

  const pp = pathname === '/';

  return (
    <nav className={`${scrolled ?
      'top-0 fixed text-black shadow-md bg-white' :
      `${pp ?
        "text-white " :
        'bg-white'} top-0 absolute bg-transparent`} 
      duration-200 transition-all border-b hodver:bg-white
     hover:text-dblack print:hidden z-30 w-full shadow-md 
      ${pp ?
        "hover:bg-white group hover:text-black " :
        'bg-white'}`}
    >
      
      <div className="flex justify-between items-center p-2">
        <button className="lg:hidden cursor-pointer" title="mobile hamburger menu" aria-label="mobile hamburger menu" id="Mob-menu" onClick={toggleModal} onBlur={() => setTimeout(() => setIsOpen(false), 70)}>
          <Menu size={'1.7rem'} />
        </button>
        <SmartLink title="home" aria-label="go to home" href="/">
          <Image
            src="/logo.png"
            alt=" borcelle logo"
            priority
            width={120}
            height={64}
            className={`${pp ? 'group-hover:invert-0 invert' : 'invert-0'} brightness-0 `}
          />
        </SmartLink>

        <div className="hidden lg:flex gap-4">
          {links.map(
            (path, idx) => (
              <SmartLink
                title={"Go to " + linksText[idx]}
                key={idx}
                href={path}
                target={path.startsWith('https') ? '_blank' : ''}
                aria-label={path}
                className={`hover:text-blue-500 ${pathname === path && "underline stext-blue-500"}`}
              >
                {linksText[idx]}
              </SmartLink>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <Currency className="none" />
          <button title="mobile hamburger menu" aria-label="mobile hamburger menu" id="Mob-menu" onClick={() => setOpen2(!open2)}>
            <Search />
          </button>
          <SmartLink
            title="Go to Cart"
            prefetch={false}
            aria-label={'Go to cart'}
            href="/cart"
            className="relative">
            <ShoppingCart />
            <span className="absolute top-3 px-1 text-[10px] bg-black text-white rounded-full border">{cart.cartItems.length}</span>
          </SmartLink>
          <User />


        </div>
      </div>

      <div className={`${(scrolled) ? "hidden" : 'flex'} px-4 bg-black text-white max-lg:hidden border-t pt-2 text-body-medium text-center justify-center flex-wrap  gap-4 pb-2`}>
        {cols.map(
          (i, idx) => (
            <SmartLink
              title={"Go to " + i.title}
              key={idx}
              href={i.link}
              target={i.link.startsWith('https') ? '_blank' : undefined}
              aria-label={i.link}
              className={`hover:text-blue-500 undderline ${pathname === i.link && " text-blue-500"}`}
            >
              {i.title}
            </SmartLink>
          )
        )}
      </div>

      {open2 && <div className="px-4 pt-2 flex sm:hsidden pb-2">
        <form onSubmit={(e) => handleSearch(e)} className="flex sm:shidden w-full items-center border rounded-lg px-4 py-1">
          <input
            list="pp"
            className="outline-none w-full bg-transparent"
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
      </div>}
      {/* Mobile Modal */}
      {isOpen && <div className="absolute flex lg:hidden left-6 max-sm:top-10 items-center justify-center bg-opacity-50 z-50">
        <ul className="flex flex-col p-4 gap-3 w-full bg-white animate-menu rounded-lg border">

          {links.map((name, idx) => (
            <SmartLink
              key={idx}
              href={name}
              aria-label={name}
              title={"Go to " + linksText[idx]}
              target={name.startsWith('https') ? '_blank' : ''}
              className="border-b px-8 text-center"
            >
              {linksText[idx]}

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
