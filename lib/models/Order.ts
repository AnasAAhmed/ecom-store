import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerEmail: { type: String, index: true },
  sessionId: { type: String },
  customerPhone: { type: String },
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
  statusHistory: {
    type: [
      {
        status: { type: String },
        changedAt: { type: Date, default: Date.now }
      }
    ],
    default: [],  
  },
  isPaid: { type: Boolean, default: false, index: true },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'refunded', 'delivered', 'canceled'],
    default: 'pending',
    index: true,
  },
  exchangeRate: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
