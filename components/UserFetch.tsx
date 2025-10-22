'use client';
import { useWhishListUserStore } from '@/lib/hooks/useCart';
import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

const UserFetcher = (
    // {userId}:{userId:string}
) => {
    const { data: session, status } = useSession();

    const { userWishlist, setUserWishlist, resetUserWishlist } = useWhishListUserStore();
    const hasFetched = useRef(false);
    useEffect(() => {
        if (session === undefined || !session?.user?.id || userWishlist || hasFetched.current) return;

        const fetchUserData = async () => {
            try {
                hasFetched.current = true;
                const res = await fetch('/api/wishlist?userId=' + session?.user?.id);
                const data = await res.json();
                setUserWishlist(data);
            } catch (err) {
                console.log('[wishlist_GET]', err);
                resetUserWishlist();
            }
        };

        // fetchUserData();
    }, [status,session?.user?.id]);

    return null;
};

export default UserFetcher;
