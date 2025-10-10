import { Metadata } from 'next';
import Cart from '@/components/Cart';
import FYProdcutList from '@/components/product/FYProdcutList';
import RecentlyViewed from '@/components/product/RecentlyViewed';

export const metadata: Metadata = {
  title: "Borcelle | Cart",
  description: "All products that you have added in cart so far",
};


const CartPage = async () => {

  return (
    <>
      <Cart />
      <FYProdcutList />
      <RecentlyViewed/>
    </>
  );
};

export default CartPage;

