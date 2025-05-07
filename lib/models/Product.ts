import mongoose from "mongoose";
import { slugify } from "../utils/features";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  media: {
    type: [String],
    validate: {
      validator: function (value: string[]) {
        return value.length <= 5;
      },
      message: 'You can specify maximum 5 medias only.',
    },
  },
  searchableVariants: {
    type: String,
    default: "",
  },
  detailDesc: String,
  category: String,
  slug: { type: String, unique: true },
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags: {
    type: [String],
    validate: {
      validator: function (value: string[]) {
        return value.length <= 5;
      },
      message: 'You can specify maximum 5 tags only.',
    },
  },
  variants: [{
    size: { type: String },
    color: { type: String },
    quantity: { type: Number },
  }],
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  weight: {
    type: Number,
    default: 0.3,
  },
  dimensions: {
    width: { type: Number },
    length: { type: Number },
    height: { type: Number },
  },
  stock: { type: Number },
  variantColors: [String],
  variantSizes: [String],
  sold: { type: Number, default: 0 },
  price: { type: Number, min: 3 },
  expense: { type: Number, min: 3 },

}, { toJSON: { getters: true }, timestamps: true });

ProductSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("variants")) {

    this.variantColors = [
      ...new Set(
        this.variants
          .map(v => v.color?.toLowerCase())
          .filter((color): color is string => Boolean(color))
      ),
    ];
    this.variantSizes = [
      ...new Set(
        this.variants
          .map(v => v.size?.toLowerCase())
          .filter((size): size is string => Boolean(size))
      ),
    ];
  }



  next();
});

ProductSchema.index({ title: 'text', tags: 'text' });
ProductSchema.index({ slug: 1, category: 1, variantColors: 1, variantSizes: 1 });


const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
