import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String },
  password: { type: String, default: null },
  googleId: { type: String, default: null },
  image: { type: String },//avatar
  email: { type: String, index: true },
  orders: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }]
  },
  reset_token: { type: String },
  token_expires: { type: String },
  country: { type: String, index: true },
  city: { type: String, index: true },
  signInHistory: {
    type: [
      {
        country: String,
        city: String,
        ip: String,
        userAgent: String,
        os: String,
        device: String,
        browser: String,
        signedInAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  },
  ordersCount: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;