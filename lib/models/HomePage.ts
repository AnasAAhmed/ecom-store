import mongoose from "mongoose";
export interface IHomePage extends mongoose.Document {
    seo: {
        title?: string;
        desc?: string;
        keywords?: [string];
        url?: string;
        width?: number;
        height?: number;
        alt?: string;
    },
    hero: {
        heading?: string;
        text?: string;
        imgUrl: string
        shade?: string;
        textColor?: string;
        link: string;
        textPosition?: string;
        textPositionV?: string;
        buttonText?: string;
        isVideo: boolean;
    },
    collections: [
        {
            heading?: string;
            text?: string;
            imgUrl: string;
            shade?: string;
            textColor?: string;
            link: string;
            textPosition?: string;
            textPositionV?: string;
            buttonText?: string;
            collection: string;
            isVideo: boolean;
        }
    ]
}

const homePageSchema = new mongoose.Schema({
    seo: {
        title: { type: String },
        desc: { type: String },
        keywords: { type: [String] },
        url: { type: String },
        width: { type: Number },
        height: { type: Number },
        alt: { type: String },
    },
    hero: {
        heading: { type: String },
        text: { type: String },
        imgUrl: { type: String, required: true },
        shade: { type: String },
        textColor: { type: String },
        textPosition: { type: String },
        textPositionV: { type: String },
        link: { type: String, required: true },
        buttonText: { type: String },
        isVideo: { type: Boolean, default: false }
    },
    collections: [
        {
            heading: { type: String },
            text: { type: String },
            imgUrl: { type: String, required: true },
            shade: { type: String },
            textColor: { type: String },
            textPosition: { type: String },
            textPositionV: { type: String },
            link: { type: String, required: true },
            buttonText: { type: String },
            collectionName: { type: String },
            isVideo: { type: Boolean, default: false }
        }
    ]
}, { timestamps: true });


const HomePage = mongoose.models.HomePage || mongoose.model("HomePage", homePageSchema);

export default HomePage;