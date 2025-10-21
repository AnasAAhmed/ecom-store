import mongoose, { Model } from "mongoose";

const layoutSettingsSchema = new mongoose.Schema({
  margin: {
    top: String,
    bottom: String,
    left: String,
    right: String,
  },
  padding: {
    top: String,
    bottom: String,
    left: String,
    right: String,
  },
  borderRadius: String,
  imagePosition: {
    type: String,
    enum: ["top", "center", "bottom"],
  },
  backgroundColor: String,
}, { _id: false });

const videoSettingsSchema = new mongoose.Schema({
  isVideo: { type: Boolean, default: false },
  url: String,
  poster: String,
}, { _id: false });

const shadeSchema = new mongoose.Schema({
  color: String,
  position: String,
}, { _id: false });

const imageContentSchema = new mongoose.Schema({
  heading: String,
  text: String,
  textColor: String,
  font: {
    type: String,
    enum: ["monospace", "sans-serif", "serif"],
  },
  buttonText: String,
  buttonType: {
    type: String,
    enum: ["link", "button"],
  },
  textAlign: {
    type: String,
    enum: ["left", "center", "right"],
  },
  link: String,
  contentPositionV: {
    type: String,
    enum: ["start", "center", "end"],
  },
  contentPositionH: {
    type: String,
    enum: ["start", "center", "end"],
  },
}, { _id: false });

const heroBannerSchema = new mongoose.Schema({
  imgUrl: { type: String, required: true },
  mobImgUrl: String,
  size: { type: String, enum: ["small", "medium", "large", "extraLarge", "full"] },
  shade: shadeSchema,
  video: videoSettingsSchema,
  imageContent: imageContentSchema,
  layout: layoutSettingsSchema,
}, { _id: false });

const collectionBannerSchema = new mongoose.Schema({
  imgUrl: { type: String, required: true },
  mobImgUrl: String,
  collectionId: { type: String, required: true },
  size: { type: String, enum: ["small", "medium", "large", "extraLarge", "full"] },
  shade: shadeSchema,
  isRow: { type: Boolean, default: false },
  video: videoSettingsSchema,
  imageContent: imageContentSchema,
  layout: layoutSettingsSchema,
}, { _id: false });

const collectionListSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  mobImage: { type: String },
  productCount: { type: Number, default: 0 },
}, { _id: false });

const homePageSchema = new mongoose.Schema({
  seo: {
    title: String,
    desc: String,
    keywords: [String],
    url: String,
    width: Number,
    height: Number,
    alt: String,
  },
  collectionList: [collectionListSchema],
  hero: [heroBannerSchema],
  collections: [collectionBannerSchema],
}, { timestamps: true });

const HomePage: Model<IHomePage> =
  mongoose.models.HomePage || mongoose.model("HomePage", homePageSchema);

export default HomePage;

export interface IHomePage extends mongoose.Document {
  seo?: {
    title?: string;
    desc?: string;
    keywords?: [string];
    url?: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  hero: typeof heroBannerSchema[];
  collections: typeof collectionBannerSchema[];
}
