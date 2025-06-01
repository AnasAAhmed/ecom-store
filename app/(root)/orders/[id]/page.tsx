import { auth } from "@/auth";
import CancelOrder from "@/components/CancelOrder";
import { getSingleOrder } from "@/lib/actions/order.actions"

export const generateMetadata = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    return {
        title: `Order details of #${params.id.slice(0, 8)}... | Borcelle`,
        description: 'Your Order details of #' + params.id.slice(0, 8) + '... at borcelle store by anas ahmed',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true
            }
        },
    };
};

const SIngleOrder = async (props: { params: Promise<{ id: string }> }) => {
    const params = await props.params;
    const session = (await auth()) as Session
   if (!session||!session.user.id) {
    return 'Unauthenticated'
  }
    const order = await getSingleOrder(params.id);

    return (
        <CancelOrder order={order} />
    );
};

export default SIngleOrder;
