import { Metadata } from 'next';
import Cart from '@/components/Cart';

export const metadata: Metadata = {
  title: "Borcelle | Cart",
  description: "All products that you have added in cart so far",
};


const CartPage = async () => {

  return (
    <Cart />
  );
};
async function ForYouProducts() {
  
}
export default CartPage;

