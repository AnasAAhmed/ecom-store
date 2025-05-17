'use client'
import { useState } from 'react';
import toast from 'react-hot-toast';
import StarRatings from './StarRatings';
import { calculateTimeDifference } from '@/lib/utils/functions';
import { useRouter } from 'next/navigation';
import ReviewForm from './ReviewForm';
import { Loader2, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';


interface ProductReviewsProps {
  productId: string;
  numOfReviews?: number;
  productReviews: ReviewType[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productReviews, productId, numOfReviews }) => {
  const { data:session } = useSession();
  const [isDeletingReview, setIsDeletingReview] = useState<boolean>(false);
  const router = useRouter();

  let reviews: ReviewType[] = productReviews;

  const handleDeleteReview = async (reviewId: string) => {
    setIsDeletingReview(true);
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
        throw new Error('Failed to delete review');
      }

      reviews = reviews.filter((review) => review._id !== reviewId);
      toast.success('Review deleted successfully');
      router.refresh();

    } catch (error) {
      toast.error('Error deleting review');
      console.log(error);

    } finally {
      setIsDeletingReview(false);
    }
  };


  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center">
      </div>
      <ReviewForm productId={productId} user={session?.user!} />
      <div className="md:mx-12 mt-12 max-sm:border-1 ">
        {reviews && reviews.length > 0 ? (
          <>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {reviews.map((review, index) => (
    <li
      key={index}
      className="rounded-xl border border-gray-200 bg-white/60 backdrop-blur shadow-sm hover:shadow-md transition p-3"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <img
            src={review.photo}
            alt="customer"
            className="rounded-full h-10 w-10 border object-cover"
          />
          <div>
            <p className="font-semibold text-sm">{review.name}</p>
            <div className="text-xs text-gray-500 mt-0.5">
              <StarRatings rating={review.rating} />
            </div>
          </div>
        </div>

        {review.userId === session?.user?.id && (
          <div className="flex items-center gap-2">
            <button
              title="Delete Review"
              onClick={() => handleDeleteReview(review._id)}
              className="text-red-500 hover:bg-red-100 rounded-full p-1 transition"
            >
              {isDeletingReview ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>

            <ReviewForm
              isEditing={true}
              oldComment={review.comment}
              oldRating={review.rating}
              productId={productId}
              user={session?.user}
            />
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-700 whitespace-pre-line">
        {review.comment}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-right">
        {calculateTimeDifference(review.createdAt)}
      </div>
    </li>
  ))}
</ul>

          </>
        ) : (
          <h1 className="text-3xl font-semibold mb-12 flex items-center justify-center">No reviews Yet</h1>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
