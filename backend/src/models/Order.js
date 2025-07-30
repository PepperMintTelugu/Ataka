import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be negative"],
  },
  title: String, // Store book title for historical purposes
  author: String, // Store author for historical purposes
  image: String, // Store image URL for historical purposes
});

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },
    billingAddress: shippingAddressSchema,
    orderSummary: {
      subtotal: { type: Number, required: true },
      shippingCost: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      total: { type: Number, required: true },
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ["razorpay", "cod"],
        required: true,
      },
      paymentId: String, // Razorpay payment ID
      razorpayOrderId: String,
      razorpaySignature: String,
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
      },
      paidAt: Date,
      failureReason: String,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out-for-delivery",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "pending",
    },
    shippingDetails: {
      provider: { type: String, default: "ShipRocket" },
      trackingId: String,
      awbCode: String,
      shipmentId: String,
      estimatedDelivery: Date,
      actualDelivery: Date,
      shippingCost: { type: Number, default: 0 },
    },
    timeline: [
      {
        status: String,
        message: String,
        timestamp: { type: Date, default: Date.now },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    customerNotes: String,
    adminNotes: String,
    isGift: { type: Boolean, default: false },
    giftMessage: String,
    giftRecipient: {
      name: String,
      email: String,
      phone: String,
    },
    cancellationReason: String,
    cancelledAt: Date,
    refundDetails: {
      amount: Number,
      reason: String,
      status: {
        type: String,
        enum: ["pending", "processed", "failed"],
      },
      refundId: String,
      processedAt: Date,
    },
    reviewRequested: { type: Boolean, default: false },
    reviewReminderSent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ "paymentDetails.status": 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ "shippingDetails.trackingId": 1 });

// Generate order number
orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `TB${Date.now().toString().slice(-6)}${(count + 1)
      .toString()
      .padStart(4, "0")}`;
  }
  next();
});

// Add timeline entry when status changes
orderSchema.pre("save", function (next) {
  if (this.isModified("orderStatus") && !this.isNew) {
    this.timeline.push({
      status: this.orderStatus,
      message: `Order status updated to ${this.orderStatus}`,
      timestamp: new Date(),
    });
  }
  next();
});

// Calculate order totals
orderSchema.methods.calculateTotals = function () {
  const subtotal = this.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  this.orderSummary.subtotal = subtotal;
  this.orderSummary.total =
    subtotal +
    this.orderSummary.shippingCost +
    this.orderSummary.tax -
    this.orderSummary.discount;

  return this;
};

// Update order status with timeline
orderSchema.methods.updateStatus = function (newStatus, message, updatedBy) {
  this.orderStatus = newStatus;
  this.timeline.push({
    status: newStatus,
    message: message || `Order status updated to ${newStatus}`,
    timestamp: new Date(),
    updatedBy: updatedBy,
  });
  return this.save();
};

const Order = mongoose.model("Order", orderSchema);

export default Order;
