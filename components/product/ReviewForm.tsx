'use client'
import { FormEvent, useState } from "react";
import { Edit, Loader2, X } from 'lucide-react';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FocusLock from "react-focus-lock";
import { useFocusWithin } from "@react-aria/interactions";

type ReviewFormProps = {
    isEditing?: boolean;
    oldRating?: number;
    oldComment?: string;
    productId: string;
};

const ReviewForm = ({ isEditing, productId, oldRating, oldComment }: ReviewFormProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [rating, setRating] = useState(oldRating);
    const [comment, setComment] = useState(oldComment);
    const [modalOpen, setModalOpen] = useState(false);
    const [isCreatingReview, setIsCreatingReview] = useState(false);

    const { focusWithinProps } = useFocusWithin({
        onBlurWithin: () => {
            if (modalOpen) {
                const modalElement = document.getElementById("modal");
                modalElement?.focus();
            }
        },
    });
    
    if (!session || !session?.user) {
        return null;
    }

    const handleCreateReview = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsCreatingReview(true);
        toast.loading('Submitting Review...')

        const reviewData = {
            rating,
            photo: session.user?.image,
            comment,
            email: session.user?.email,
            name: session.user?.name,
            userId: session.user?.id,
        }
        try {
            const res = await fetch(`/api/products/reviews?productId=${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });


            const data = await res.json();

            if (res.ok) {
                toast.dismiss();
                toast.success('Review submitted successfully');
                router.refresh();
                setModalOpen(false);
            } else {
                throw new Error('Error creating review: ' + data.message);
            }
        } catch (error) {
            console.error('Error creating review:', error);
            toast.dismiss();
            toast.error((error as Error).message);
        } finally {
            setIsCreatingReview(false);
        }
    };

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <div>
            <div className='flex flex-col items-center'>
                {isEditing ? (
                    <button title="Edit Review" className="text-[0.7rem] sm:text-sm px-1 py-1 rounded-md" onClick={openModal}>
                        <Edit />
                    </button>
                ) : (
                    <button title="Add Review for demo purposes" onClick={openModal} className="bg-blue-700 text-white px-2 py-1 rounded-full mb-1">
                        Add Review for demo purposes
                    </button>
                )}
            </div>
            {modalOpen && (
            <div
                className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50`}
                onClick={() => closeModal()}
            >
                <FocusLock className="w-full">
                    <div
                        className="w-full"
                        id="modal"
                        tabIndex={-1}
                        {...focusWithinProps}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white mx-auto w-full sm:w-[40%] animate-modal p-4 rounded-md">

                            <div className="flex flex-row justify-between gap-3 items-start mb-6">
                                <div className="flex flex-col items-start">
                                    <h2 className="text-[15px] font-medium sm:text-heading4-bold">Submit Review</h2>
                                    <p className=" text-[10px] sm:text-small-medium">In production enviroment this button/form will be removed, and only customers who bought this product can review this product.</p>
                                </div>
                                <button title='Close form' onClick={closeModal} className="rounded-md">
                                    <X size={'1rem'} />
                                </button>
                            </div>
                            <form className="space-y-4" onSubmit={handleCreateReview}>
                                <div>
                                    <label htmlFor="rating" className="block text-md mb-3 font-medium">Rating</label>
                                    <input
                                        id="rating"
                                        type="number"
                                        max={5}
                                        className="border px-1 rounded-md w-full"
                                        placeholder="Rating"
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="comment" className="block text-md mb-3 font-medium">Comment</label>
                                    <textarea
                                        id="comment"
                                        rows={3}
                                        className="border px-1 rounded-md w-full"
                                        placeholder="Comment"
                                        value={comment}
                                        maxLength={200}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                    />
                                </div>
                                <button title="Click here to submit review" type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={isCreatingReview}>
                                    {isCreatingReview ? <Loader2 className='animate-spin text-heading3-bold mx-3' /> : "Add Review"}
                                </button>
                            </form>
                        </div>
                    </div>
                </FocusLock>
            </div>
            )}
        </div>
    );
};

export default ReviewForm;
