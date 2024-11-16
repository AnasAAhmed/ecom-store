import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerEmail: { type: String, index: true },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      color: String,
      size: String,
      variantId: String,
      quantity: Number,
    },
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    phone: String,
    country: String,
  },
  shippingRate: String, 
  totalAmount: Number,
  currency: String,
  method: String,
  status: String,
  exchangeRate: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
