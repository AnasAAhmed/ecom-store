import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    userId: { type: String ,index:true},
    wishlist: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
    },
});

const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;