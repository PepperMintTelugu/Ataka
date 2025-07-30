import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { protect } from "../middleware/auth.js";
import Order from "../models/Order.js";
import Book from "../models/Book.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
router.post(
  "/create-order",
  protect,
  [
    body("amount")
      .isNumeric()
      .isFloat({ min: 1 })
      .withMessage("Amount must be a positive number"),
    body("currency").optional().isLength({ min: 3, max: 3 }),
    body("items").isArray({ min: 1 }).withMessage("Items array is required"),
    body("shippingAddress")
      .isObject()
      .withMessage("Shipping address is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const { amount, currency = "INR", items, shippingAddress } = req.body;

      // Validate items and calculate total
      let calculatedTotal = 0;
      const orderItems = [];

      for (const item of items) {
        const book = await Book.findById(item.bookId);
        if (!book) {
          return res.status(400).json({
            success: false,
            message: `Book with ID ${item.bookId} not found`,
          });
        }

        if (!book.inStock || book.stockCount < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${book.title}`,
          });
        }

        const itemTotal = book.price * item.quantity;
        calculatedTotal += itemTotal;

        orderItems.push({
          book: book._id,
          quantity: item.quantity,
          price: book.price,
          title: book.title,
          author: book.author,
          image: book.image,
        });
      }

      // Verify amount matches calculated total
      if (Math.abs(amount - calculatedTotal) > 0.01) {
        return res.status(400).json({
          success: false,
          message: "Amount mismatch. Please refresh and try again.",
        });
      }

      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: `order_${Date.now()}_${req.user.id}`,
        notes: {
          userId: req.user.id.toString(),
          userEmail: req.user.email,
        },
      });

      // Create order in database
      const order = await Order.create({
        user: req.user.id,
        items: orderItems,
        shippingAddress,
        billingAddress: shippingAddress, // Use same address for billing
        orderSummary: {
          subtotal: calculatedTotal,
          shippingCost: 0, // Free shipping
          tax: 0,
          discount: 0,
          total: calculatedTotal,
        },
        paymentDetails: {
          method: "razorpay",
          razorpayOrderId: razorpayOrder.id,
          status: "pending",
        },
        timeline: [
          {
            status: "pending",
            message: "Order created, awaiting payment",
            timestamp: new Date(),
          },
        ],
      });

      res.json({
        success: true,
        message: "Order created successfully",
        data: {
          order: {
            id: order._id,
            orderNumber: order.orderNumber,
            total: order.orderSummary.total,
          },
          razorpayOrder: {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
          },
          razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        },
      });
    } catch (error) {
      console.error("Create order error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create order",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
router.post(
  "/verify",
  protect,
  [
    body("razorpay_order_id")
      .notEmpty()
      .withMessage("Razorpay order ID is required"),
    body("razorpay_payment_id")
      .notEmpty()
      .withMessage("Razorpay payment ID is required"),
    body("razorpay_signature")
      .notEmpty()
      .withMessage("Razorpay signature is required"),
    body("orderId").notEmpty().withMessage("Order ID is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        orderId,
      } = req.body;

      // Find order
      const order = await Order.findById(orderId).populate("items.book");

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Verify Razorpay signature
      const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
      hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature !== razorpay_signature) {
        // Payment verification failed
        order.paymentDetails.status = "failed";
        order.paymentDetails.failureReason = "Invalid signature";
        order.timeline.push({
          status: "failed",
          message: "Payment verification failed",
          timestamp: new Date(),
        });
        await order.save();

        return res.status(400).json({
          success: false,
          message: "Payment verification failed",
        });
      }

      // Payment verified successfully
      order.paymentDetails.status = "paid";
      order.paymentDetails.paymentId = razorpay_payment_id;
      order.paymentDetails.razorpaySignature = razorpay_signature;
      order.paymentDetails.paidAt = new Date();
      order.orderStatus = "confirmed";
      order.timeline.push({
        status: "confirmed",
        message: "Payment confirmed, order processing",
        timestamp: new Date(),
      });

      await order.save();

      // Update book stock
      for (const item of order.items) {
        await Book.findByIdAndUpdate(item.book._id, {
          $inc: {
            stockCount: -item.quantity,
            salesCount: item.quantity,
          },
        });

        // Update inStock status if needed
        const book = await Book.findById(item.book._id);
        if (book.stockCount <= 0) {
          book.inStock = false;
          await book.save();
        }
      }

      // TODO: Send order confirmation email
      // TODO: Create shipment with ShipRocket

      res.json({
        success: true,
        message: "Payment verified successfully",
        data: {
          order: {
            id: order._id,
            orderNumber: order.orderNumber,
            status: order.orderStatus,
            total: order.orderSummary.total,
            paidAt: order.paymentDetails.paidAt,
          },
        },
      });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({
        success: false,
        message: "Payment verification failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Handle payment failure
// @route   POST /api/payments/failure
// @access  Private
router.post(
  "/failure",
  protect,
  [
    body("orderId").notEmpty().withMessage("Order ID is required"),
    body("error").optional().isObject(),
  ],
  async (req, res) => {
    try {
      const { orderId, error } = req.body;

      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      if (order.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Update order status
      order.paymentDetails.status = "failed";
      order.paymentDetails.failureReason =
        error?.description || "Payment failed";
      order.timeline.push({
        status: "failed",
        message: `Payment failed: ${error?.description || "Unknown error"}`,
        timestamp: new Date(),
      });

      await order.save();

      res.json({
        success: true,
        message: "Payment failure recorded",
        data: {
          order: {
            id: order._id,
            orderNumber: order.orderNumber,
            status: order.orderStatus,
          },
        },
      });
    } catch (error) {
      console.error("Payment failure handling error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to handle payment failure",
      });
    }
  },
);

// @desc    Get Razorpay key for frontend
// @route   GET /api/payments/config
// @access  Public
router.get("/config", (req, res) => {
  res.json({
    success: true,
    data: {
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    },
  });
});

// @desc    Webhook for Razorpay events
// @route   POST /api/payments/webhook
// @access  Public (but verified with webhook secret)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const webhookSignature = req.headers["x-razorpay-signature"];
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

      if (webhookSecret) {
        // Verify webhook signature
        const hmac = crypto.createHmac("sha256", webhookSecret);
        hmac.update(req.body);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== webhookSignature) {
          return res.status(400).json({
            success: false,
            message: "Invalid webhook signature",
          });
        }
      }

      const event = JSON.parse(req.body);

      switch (event.event) {
        case "payment.captured":
          // Handle successful payment
          console.log("Payment captured:", event.payload.payment.entity);
          break;

        case "payment.failed":
          // Handle failed payment
          console.log("Payment failed:", event.payload.payment.entity);
          break;

        case "order.paid":
          // Handle order paid event
          console.log("Order paid:", event.payload.order.entity);
          break;

        default:
          console.log("Unhandled webhook event:", event.event);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({
        success: false,
        message: "Webhook processing failed",
      });
    }
  },
);

export default router;
