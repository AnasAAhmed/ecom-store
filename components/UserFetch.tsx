'use client';
import { useWhishListUserStore } from '@/lib/hooks/useCart';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const UserFetcher = (
    // {userId}:{userId:string}
) => {
    const { data: session,status } = useSession();

    const { userWishlist, setUserWishlist, resetUserWishlist } = useWhishListUserStore();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/wishlist', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        id: session?.user?.id
                    }),
                });
                const data = await res.json();
                setUserWishlist(data);
            } catch (err) {
                console.log('[users_GET]', err);
                resetUserWishlist();
            }
        };

        if (session?.user?.id && !userWishlist) {
            fetchUserData();
        }
    }, [session?.user?.id, userWishlist, setUserWishlist, resetUserWishlist,status,session]);

    return null;
};

export default UserFetcher;
