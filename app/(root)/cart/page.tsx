import { Metadata } from 'next';
import Cart from '@/components/Cart';
import { auth } from '@/auth';

export const metadata: Metadata = {
  title: "Borcelle | Cart",
  description: "All products that you have added in cart so far",
};

const CartPage = async () => {
  const session = (await auth()) as Session

  return (
    <Cart user={session ? session.user : null} />
  );
};

export default CartPage;

