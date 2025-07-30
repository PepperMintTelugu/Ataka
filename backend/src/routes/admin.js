import express from "express";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";
import Settings from "../models/Settings.js";
import { protect, admin } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
router.get("/stats", protect, admin, async (req, res) => {
  try {
    // Get date ranges
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    // Basic counts
    const totalBooks = await Book.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();

    // Revenue calculations
    const totalRevenue = await Order.aggregate([
      { $match: { "paymentDetails.status": "paid" } },
      { $group: { _id: null, total: { $sum: "$orderSummary.total" } } },
    ]);

    const thisMonthRevenue = await Order.aggregate([
      {
        $match: {
          "paymentDetails.status": "paid",
          createdAt: { $gte: thisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$orderSummary.total" } } },
    ]);

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          "paymentDetails.status": "paid",
          createdAt: { $gte: lastMonth, $lt: thisMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$orderSummary.total" } } },
    ]);

    // Order status breakdown
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top selling books
    const topBooks = await Book.find({ isActive: true })
      .sort({ salesCount: -1 })
      .limit(5)
      .select("title author salesCount price");

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderNumber user orderSummary.total orderStatus createdAt");

    // Monthly sales data (last 12 months)
    const monthlySales = await Order.aggregate([
      {
        $match: {
          "paymentDetails.status": "paid",
          createdAt: {
            $gte: new Date(today.getFullYear() - 1, today.getMonth(), 1),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$orderSummary.total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Growth calculations
    const revenueGrowth =
      lastMonthRevenue[0]?.total > 0
        ? (((thisMonthRevenue[0]?.total || 0) - lastMonthRevenue[0].total) /
            lastMonthRevenue[0].total) *
          100
        : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalBooks,
          totalUsers,
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          thisMonthRevenue: thisMonthRevenue[0]?.total || 0,
          revenueGrowth: Math.round(revenueGrowth * 100) / 100,
        },
        ordersByStatus,
        topBooks,
        recentOrders,
        monthlySales,
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin statistics",
    });
  }
});

// @desc    Get users list
// @route   GET /api/admin/users
// @access  Admin
router.get("/users", protect, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ];
    }

    if (req.query.role) {
      filter.role = req.query.role;
    }

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .select("-password");

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalUsers: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
router.put("/users/:id/role", protect, admin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "User role updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user role",
    });
  }
});

// @desc    Deactivate/activate user
// @route   PUT /api/admin/users/:id/status
// @access  Admin
router.put("/users/:id/status", protect, admin, async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: { user },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
});

// @desc    Get signin settings
// @route   GET /api/admin/signin-settings
// @access  Admin
router.get("/signin-settings", protect, admin, async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      settings: {
        enableGoogle: settings.signIn?.enableGoogle ?? true,
        enableWhatsAppOTP: settings.signIn?.enableWhatsAppOTP ?? true,
        enableMobileOTP: settings.signIn?.enableMobileOTP ?? true,
        enableEmailPassword: settings.signIn?.enableEmailPassword ?? true,
        primaryMethod: settings.signIn?.primaryMethod ?? "google",
        whatsappNumber: settings.signIn?.whatsappNumber ?? "+91 98765 43210",
        otpLength: settings.signIn?.otpLength ?? 6,
        otpValidityMinutes: settings.signIn?.otpValidityMinutes ?? 5,
        maxOtpAttempts: settings.signIn?.maxOtpAttempts ?? 3,
        otpRateLimit: settings.signIn?.otpRateLimit ?? 1,
      },
    });
  } catch (error) {
    console.error("Get signin settings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting signin settings",
    });
  }
});

// @desc    Update signin settings
// @route   PUT /api/admin/signin-settings
// @access  Admin
router.put(
  "/signin-settings",
  protect,
  admin,
  [
    body("settings.enableGoogle").optional().isBoolean(),
    body("settings.enableWhatsAppOTP").optional().isBoolean(),
    body("settings.enableMobileOTP").optional().isBoolean(),
    body("settings.enableEmailPassword").optional().isBoolean(),
    body("settings.primaryMethod")
      .optional()
      .isIn(["google", "whatsapp", "mobile", "email"]),
    body("settings.whatsappNumber").optional().isMobilePhone(),
    body("settings.otpLength").optional().isInt({ min: 4, max: 8 }),
    body("settings.otpValidityMinutes").optional().isInt({ min: 1, max: 30 }),
    body("settings.maxOtpAttempts").optional().isInt({ min: 1, max: 10 }),
    body("settings.otpRateLimit").optional().isInt({ min: 1, max: 10 }),
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

      const { settings: newSignInSettings } = req.body;

      // Validate that at least one sign-in method is enabled
      const hasEnabledMethod =
        newSignInSettings.enableGoogle ||
        newSignInSettings.enableWhatsAppOTP ||
        newSignInSettings.enableMobileOTP ||
        newSignInSettings.enableEmailPassword;

      if (!hasEnabledMethod) {
        return res.status(400).json({
          success: false,
          message: "At least one sign-in method must be enabled",
        });
      }

      // Update settings
      const currentSettings = await Settings.getSettings();
      currentSettings.signIn = {
        ...currentSettings.signIn,
        ...newSignInSettings,
      };

      await currentSettings.save();

      res.json({
        success: true,
        message: "Sign-in settings updated successfully",
        settings: currentSettings.signIn,
      });
    } catch (error) {
      console.error("Update signin settings error:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating signin settings",
      });
    }
  },
);

// @desc    Get homepage settings
// @route   GET /api/admin/homepage
// @access  Admin
router.get("/homepage", protect, admin, async (req, res) => {
  try {
    let settings;
    try {
      settings = await Settings.getSettings();
    } catch (dbError) {
      console.log("Database error, returning default settings:", dbError);
      // Return default settings if database fails
      return res.json({
        success: true,
        homepage: {
          heroSlider: {
            images: [],
            settings: {
              autoPlay: true,
              autoPlayDelay: 5000,
              showDots: true,
              showArrows: true,
              height: "500px",
            },
          },
          categories: {
            title: "Browse Categories",
            titleTelugu: "వర్గాలను విహరించండి",
            categories: [],
            settings: {
              layout: "grid",
              itemsPerRow: 4,
              showDescription: true,
              showIcons: true,
            },
          },
        },
      });
    }

    res.json({
      success: true,
      homepage: {
        heroSlider: {
          images: settings.homepage?.heroSlider?.images || [],
          settings: {
            autoPlay: settings.homepage?.heroSlider?.settings?.autoPlay ?? true,
            autoPlayDelay:
              settings.homepage?.heroSlider?.settings?.autoPlayDelay ?? 5000,
            showDots: settings.homepage?.heroSlider?.settings?.showDots ?? true,
            showArrows:
              settings.homepage?.heroSlider?.settings?.showArrows ?? true,
            height: settings.homepage?.heroSlider?.settings?.height ?? "500px",
          },
        },
        categories: {
          title: settings.homepage?.categories?.title ?? "Browse Categories",
          titleTelugu:
            settings.homepage?.categories?.titleTelugu ?? "వర్గాలను విహరించండి",
          categories: settings.homepage?.categories?.categories || [],
          settings: {
            layout: settings.homepage?.categories?.settings?.layout ?? "grid",
            itemsPerRow:
              settings.homepage?.categories?.settings?.itemsPerRow ?? 4,
            showDescription:
              settings.homepage?.categories?.settings?.showDescription ?? true,
            showIcons:
              settings.homepage?.categories?.settings?.showIcons ?? true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get homepage settings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting homepage settings",
    });
  }
});

// @desc    Update homepage settings
// @route   PUT /api/admin/homepage
// @access  Admin
router.put(
  "/homepage",
  protect,
  admin,
  [
    body("homepage.heroSlider.settings.autoPlay").optional().isBoolean(),
    body("homepage.heroSlider.settings.autoPlayDelay")
      .optional()
      .isInt({ min: 1000, max: 30000 }),
    body("homepage.heroSlider.settings.showDots").optional().isBoolean(),
    body("homepage.heroSlider.settings.showArrows").optional().isBoolean(),
    body("homepage.categories.title").optional().isLength({ min: 1, max: 100 }),
    body("homepage.categories.titleTelugu").optional().isLength({ max: 100 }),
    body("homepage.categories.settings.layout")
      .optional()
      .isIn(["grid", "carousel"]),
    body("homepage.categories.settings.itemsPerRow")
      .optional()
      .isInt({ min: 1, max: 6 }),
    body("homepage.categories.settings.showDescription").optional().isBoolean(),
    body("homepage.categories.settings.showIcons").optional().isBoolean(),
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

      const { homepage } = req.body;

      // Update settings
      const currentSettings = await Settings.getSettings();
      currentSettings.homepage = homepage;

      await currentSettings.save();

      res.json({
        success: true,
        message: "Homepage settings updated successfully",
        homepage: currentSettings.homepage,
      });
    } catch (error) {
      console.error("Update homepage settings error:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating homepage settings",
      });
    }
  },
);

export default router;
