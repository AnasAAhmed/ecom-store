'use client'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import ReviewForm from './ReviewForm';
import { Loader2, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';


interface ProductReviewsProps {
  reviewUserId: string;
  reviewId: string;
  reviewComment: string;
  reviewRating: number;
  productId: string;
}

const DeleteReviews: React.FC<ProductReviewsProps> = ({ reviewComment, reviewRating, reviewId, reviewUserId, productId }) => {
  const { data: session } = useSession();
  const [isDeletingReview, setIsDeletingReview] = useState<boolean>(false);
  const router = useRouter();


  const handleDeleteReview = async (reviewId: string) => {
    setIsDeletingReview(true);
    toast.loading('Deleting Review...')
    try {
      const response = await fetch(`/api/products/reviews?reviewId=${reviewId}&userId=${session?.user?.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'reviewId': reviewId,
          'userId': session?.user?.id || '',
          'productId': productId,
        }
      });

      if (!response.ok) {
        throw new Error(response.statusText || await response.json());
      }

      toast.dismiss();
      toast.success('Review deleted successfully');
      router.refresh();

    } catch (error) {
      toast.dismiss();
      toast.error((error as Error).message + ' Error deleting review');
      console.log(error);

    } finally {
      setIsDeletingReview(false);
    }
  };


  return reviewUserId === session?.user?.id && (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleDeleteReview(reviewId)}
        title='Delete Review'
        className="px-2 py-1 text-xs hover:bg-red-100 text-red-700 rounded-md flex items-center gap-1"
      >
        {isDeletingReview ? (
          <Loader2 className="animate-spin h-3 w-3" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
        Delete
      </button>

      <ReviewForm
        isEditing={true}
        oldComment={reviewComment}
        oldRating={reviewRating}
        productId={productId}
      />
    </div>
  )
};

export default DeleteReviews;
