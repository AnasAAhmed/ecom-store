'use client';

import { useWhishListUserStore } from "@/lib/hooks/useCart";
import { Heart, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface HeartFavoriteProps {
  productId: string;
  updateSignedInUser?: (updatedUser: UserType) => void;
}

const HeartFavorite = ({ productId, updateSignedInUser }: HeartFavoriteProps) => {
  const router = useRouter();
  const { userWishlist, resetUserWishlist } = useWhishListUserStore();

  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (userWishlist) {
      setIsLiked(userWishlist.wishlist.includes(productId));
    }
  }, [userWishlist, productId]);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      if (!userWishlist) {
        return router.push("/login");
      } else {
        setLoading(true);
        const res = await fetch("/api/wishlist/action", {
          method: "POST",
          body: JSON.stringify({ productId }),
        });
        const updatedUser = await res.json();
        setIsLiked(updatedUser.isLiked);  // Use the returned isLiked status

        toast.success(`${updatedUser.isLiked ? "Added to" : "Removed from"} your wishlist`);
        updateSignedInUser && updateSignedInUser(updatedUser.user);
        resetUserWishlist();
      }
    } catch (err) {
      toast.error("Error updating your wishlist");
      console.log("[wishlist_POST]", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button style={{fontSize:'24px'}} title="Click here to add on wishlist" onClick={handleLike} disabled={loading}>
      {loading ? <Loader size={'1.2rem'} className="animate-spin" /> : <Heart className="ml-[10px]" size={'1.2rem'} fill={isLiked ? "red" : "white"} />}
    </button>
  );
};

export default HeartFavorite;
