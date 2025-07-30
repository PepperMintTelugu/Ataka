import express from "express";
import Order from "../models/Order.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import { protect, admin } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// @desc    Get order by ID
// @route   GET /api/orders/:orderId
// @access  Private
router.get("/:orderId", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.book", "title author image price")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order or is admin
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    // Calculate delivery estimate
    const deliveryEstimate = calculateDeliveryEstimate(
      order.shippingAddress.pincode,
      order.createdAt,
    );

    // Transform order for frontend
    const transformedOrder = {
      id: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentId: order.payment.razorpayPaymentId,
      amount: order.totalAmount,
      items: order.items.map((item) => ({
        id: item.book._id,
        title: item.book.title,
        author: item.book.author,
        price: item.price,
        quantity: item.quantity,
        image: item.book.image,
      })),
      shippingAddress: order.shippingAddress,
      deliveryEstimate,
      createdAt: order.createdAt,
    };

    res.json({
      success: true,
      data: {
        order: transformedOrder,
      },
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting order details",
    });
  }
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate("items.book", "title author image price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting orders",
    });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:orderId/status
// @access  Admin
router.put(
  "/:orderId/status",
  protect,
  admin,
  [
    body("status")
      .isIn([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ])
      .withMessage("Invalid status"),
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

      const { status, trackingNumber, notes } = req.body;

      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      // Update order status
      order.status = status;

      if (trackingNumber) {
        order.trackingNumber = trackingNumber;
      }

      // Add status update to timeline
      order.statusUpdates.push({
        status,
        notes: notes || `Order ${status}`,
        updatedBy: req.user.id,
        timestamp: new Date(),
      });

      // Set special timestamps
      if (status === "shipped" && !order.shippedAt) {
        order.shippedAt = new Date();
      }
      if (status === "delivered" && !order.deliveredAt) {
        order.deliveredAt = new Date();
      }

      await order.save();

      res.json({
        success: true,
        message: "Order status updated successfully",
        data: { order },
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating order status",
      });
    }
  },
);

// @desc    Cancel order
// @route   PUT /api/orders/:orderId/cancel
// @access  Private
router.put("/:orderId/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    // Check if order can be cancelled
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    // Update order status
    order.status = "cancelled";
    order.statusUpdates.push({
      status: "cancelled",
      notes: "Cancelled by customer",
      updatedBy: req.user.id,
      timestamp: new Date(),
    });

    // Restore inventory
    for (const item of order.items) {
      await Book.findByIdAndUpdate(item.book, {
        $inc: { stockCount: item.quantity },
      });
    }

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: { order },
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error cancelling order",
    });
  }
});

// @desc    Generate invoice
// @route   GET /api/orders/:orderId/invoice
// @access  Private
router.get("/:orderId/invoice", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("items.book", "title author isbn")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to download this invoice",
      });
    }

    // Generate PDF invoice (simplified version)
    const invoiceData = {
      orderNumber: order.orderNumber,
      date: order.createdAt,
      customer: {
        name: order.user.name,
        email: order.user.email,
        address: order.shippingAddress,
      },
      items: order.items,
      totals: {
        subtotal: order.subtotal,
        shipping: order.shippingCost,
        total: order.totalAmount,
      },
      payment: {
        method: order.payment.method,
        status: order.payment.status,
        id: order.payment.razorpayPaymentId,
      },
    };

    // For now, return JSON. In production, generate actual PDF
    res.json({
      success: true,
      data: { invoice: invoiceData },
    });

    // TODO: Implement actual PDF generation using libraries like puppeteer or jsPDF
  } catch (error) {
    console.error("Generate invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Server error generating invoice",
    });
  }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Admin
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.book", "title author image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    // Get order statistics
    const stats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$totalAmount" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        orders,
        stats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting orders",
    });
  }
});

// Helper function to calculate delivery estimate
function calculateDeliveryEstimate(pincode, orderDate) {
  const firstDigit = pincode.charAt(0);

  // Delivery estimates based on first digit of pincode (Indian postal zones)
  const deliveryDays = {
    1: 2, // Delhi, Haryana
    2: 3, // Punjab, Himachal
    3: 3, // Rajasthan, Gujarat
    4: 2, // Maharashtra, Goa
    5: 1, // Telangana, Andhra Pradesh
    6: 3, // Karnataka, Kerala
    7: 3, // Tamil Nadu
    8: 4, // Eastern India
    9: 5, // Northeast
    0: 3, // Others
  };

  const days = deliveryDays[firstDigit] || 3;
  const estimatedDate = new Date(orderDate);
  estimatedDate.setDate(estimatedDate.getDate() + days);

  return {
    minDays: days,
    maxDays: days + 1,
    estimatedDate: estimatedDate.toISOString(),
  };
}

export default router;
