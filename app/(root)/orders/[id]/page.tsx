import { auth } from "@/auth";
import CancelOrder from "@/components/CancelOrder";
import { getSingleOrder } from "@/lib/actions/order.actions"
import { redirect } from 'next/navigation'

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
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

const SIngleOrder = async ({ params }: { params: { id: string } }) => {
    const session = (await auth()) as Session
    if (!session || !params.id) {
        return redirect('/login');
    };
    const order = await getSingleOrder(params.id);

    return (
        <CancelOrder order={order} />
    );
};

export default SIngleOrder;
