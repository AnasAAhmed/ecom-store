import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  image: {
    type: String,
    required: true,
  },
  mobImage: {
    type: String,
  },
  productCount: [
    {
      type: Number,
      default: 0,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
})
collectionSchema.index({ title: 1 });

const Collection = mongoose.models.Collection || mongoose.model("Collection", collectionSchema);

export default Collection;