import { Metadata } from 'next';
import Cart from '@/components/Cart';

export const metadata: Metadata = {
  title: "Borcelle | Cart",
  description: "All products that you have added in cart so far",
};

export const dynamic = 'force-static'

const CartPage = async () => {

  return (
    <Cart />
  );
};

export default CartPage;

