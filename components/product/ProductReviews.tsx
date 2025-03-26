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
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review, index) => (
                <li key={index} className="border pb-4 mb-4 py-3 px-2">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row items-center gap-3">
                      <span>
                        <img src={review.photo} alt="customer" className="rounded-full h-8 w-8" />
                      </span>
                      <p>
                        <strong>{review.name}</strong>
                      </p>
                      <span className="text-md">
                        <StarRatings rating={review.rating} />
                      </span>
                    </div>
                    {review.userId === session?.user?.id && (
                      <div className="flex flex-row items-center">
                        <button
                        title='Delete Review'
                          onClick={() => handleDeleteReview(review._id)}
                          className="px-1 text-[0.7rem] sm:text-sm py-1 rounded-md"
                        >
                          {isDeletingReview ? <Loader2 className="animate-spin" /> : <Trash2 />}
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
                  <div className="flex mr-2 mt-3 flex-row justify-between">
                    <p>{review.comment}</p>
                    <p className="font-bold flex justify-end text-sm w-36">
                      {calculateTimeDifference(review.createdAt)}
                    </p>
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
