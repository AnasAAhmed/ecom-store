'use client';
import { useWhishListUserStore } from '@/lib/hooks/useCart';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

const UserFetcher = () => {
    const { user: userFromClerk, isSignedIn } = useUser();
    
    const { user, setUser, resetUser } = useWhishListUserStore();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/user', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: userFromClerk!.emailAddresses[0].emailAddress,
                        name: userFromClerk?.fullName,
                        clerkId: userFromClerk?.id
                    }),
                });
                const data = await res.json();
                console.log(data);
                
                setUser(data);
            } catch (err) {
                console.log('[users_GET]', err);
                resetUser();
            }
        };

        if (isSignedIn && !user) {
            fetchUserData();
        }
    }, [isSignedIn, user, setUser, resetUser]);

    return null;
};

export default UserFetcher;
