import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    productId: {
        type: String,
        required: true,
        index:true
    },
    photo: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
},
    {
        timestamps: true,
    }
)
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export default Review;