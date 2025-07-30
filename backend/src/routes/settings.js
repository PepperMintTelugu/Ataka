import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Settings from "../models/Settings.js";
import { protect, admin } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/brand/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// @desc    Get current settings
// @route   GET /api/settings
// @access  Public
router.get("/", async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      data: { settings },
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
});

// @desc    Update brand settings
// @route   PUT /api/settings/brand
// @access  Admin
router.put(
  "/brand",
  protect,
  admin,
  [
    body("brand.name")
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Brand name must be between 1 and 50 characters"),
    body("brand.nameTelugu")
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Telugu brand name must be between 1 and 50 characters"),
    body("brand.tagline")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Tagline cannot exceed 200 characters"),
    body("brand.taglineTelugu")
      .optional()
      .trim()
      .isLength({ max: 200 })
      .withMessage("Telugu tagline cannot exceed 200 characters"),
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

      const settings = await Settings.updateSettings(req.body, req.user.id);

      res.json({
        success: true,
        message: "Brand settings updated successfully",
        data: { settings },
      });
    } catch (error) {
      console.error("Update brand settings error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update brand settings",
      });
    }
  },
);

// @desc    Update theme colors
// @route   PUT /api/settings/theme
// @access  Admin
router.put(
  "/theme",
  protect,
  admin,
  [
    body("theme.primary")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid primary color format"),
    body("theme.secondary")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid secondary color format"),
    body("theme.accent")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid accent color format"),
    body("theme.background")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid background color format"),
    body("theme.text")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid text color format"),
    body("theme.muted")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid muted color format"),
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

      const settings = await Settings.updateSettings(req.body, req.user.id);

      res.json({
        success: true,
        message: "Theme colors updated successfully",
        data: { settings },
      });
    } catch (error) {
      console.error("Update theme error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update theme colors",
      });
    }
  },
);

// @desc    Update button styles
// @route   PUT /api/settings/buttons
// @access  Admin
router.put(
  "/buttons",
  protect,
  admin,
  [
    body("buttons.addToCart.backgroundColor")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid add to cart background color"),
    body("buttons.addToCart.textColor")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid add to cart text color"),
    body("buttons.addToCart.hoverColor")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid add to cart hover color"),
    body("buttons.buyNow.backgroundColor")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid buy now background color"),
    body("buttons.buyNow.textColor")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid buy now text color"),
    body("buttons.buyNow.hoverColor")
      .optional()
      .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .withMessage("Invalid buy now hover color"),
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

      const settings = await Settings.updateSettings(req.body, req.user.id);

      res.json({
        success: true,
        message: "Button styles updated successfully",
        data: { settings },
      });
    } catch (error) {
      console.error("Update button styles error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update button styles",
      });
    }
  },
);

// @desc    Upload logo
// @route   POST /api/settings/logo
// @access  Admin
router.post(
  "/logo",
  protect,
  admin,
  upload.single("logo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Logo file is required",
        });
      }

      const logoPath = `/uploads/brand/${req.file.filename}`;

      // Update settings with new logo path
      const settings = await Settings.updateSettings(
        {
          brand: {
            logo: logoPath,
          },
        },
        req.user.id,
      );

      res.json({
        success: true,
        message: "Logo uploaded successfully",
        data: {
          logoPath,
          settings,
        },
      });
    } catch (error) {
      console.error("Logo upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload logo",
      });
    }
  },
);

// @desc    Upload favicon
// @route   POST /api/settings/favicon
// @access  Admin
router.post(
  "/favicon",
  protect,
  admin,
  upload.single("favicon"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Favicon file is required",
        });
      }

      const faviconPath = `/uploads/brand/${req.file.filename}`;

      // Update settings with new favicon path
      const settings = await Settings.updateSettings(
        {
          brand: {
            favicon: faviconPath,
          },
        },
        req.user.id,
      );

      res.json({
        success: true,
        message: "Favicon uploaded successfully",
        data: {
          faviconPath,
          settings,
        },
      });
    } catch (error) {
      console.error("Favicon upload error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to upload favicon",
      });
    }
  },
);

// @desc    Update contact information
// @route   PUT /api/settings/contact
// @access  Admin
router.put(
  "/contact",
  protect,
  admin,
  [
    body("contact.email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email format"),
    body("contact.phone").optional().isString(),
    body("contact.address").optional().isObject(),
    body("contact.socialMedia").optional().isObject(),
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

      const settings = await Settings.updateSettings(req.body, req.user.id);

      res.json({
        success: true,
        message: "Contact information updated successfully",
        data: { settings },
      });
    } catch (error) {
      console.error("Update contact error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update contact information",
      });
    }
  },
);

// @desc    Update SEO settings
// @route   PUT /api/settings/seo
// @access  Admin
router.put(
  "/seo",
  protect,
  admin,
  [
    body("seo.metaTitle")
      .optional()
      .trim()
      .isLength({ max: 60 })
      .withMessage("Meta title cannot exceed 60 characters"),
    body("seo.metaDescription")
      .optional()
      .trim()
      .isLength({ max: 160 })
      .withMessage("Meta description cannot exceed 160 characters"),
    body("seo.keywords").optional().isArray(),
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

      const settings = await Settings.updateSettings(req.body, req.user.id);

      res.json({
        success: true,
        message: "SEO settings updated successfully",
        data: { settings },
      });
    } catch (error) {
      console.error("Update SEO error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update SEO settings",
      });
    }
  },
);

// @desc    Update feature flags
// @route   PUT /api/settings/features
// @access  Admin
router.put("/features", protect, admin, async (req, res) => {
  try {
    const settings = await Settings.updateSettings(req.body, req.user.id);

    res.json({
      success: true,
      message: "Feature settings updated successfully",
      data: { settings },
    });
  } catch (error) {
    console.error("Update features error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update feature settings",
    });
  }
});

// @desc    Reset settings to default
// @route   POST /api/settings/reset
// @access  Admin
router.post("/reset", protect, admin, async (req, res) => {
  try {
    // Delete existing settings to trigger default creation
    await Settings.deleteMany({});

    // Get fresh default settings
    const settings = await Settings.getSettings();

    res.json({
      success: true,
      message: "Settings reset to default successfully",
      data: { settings },
    });
  } catch (error) {
    console.error("Reset settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset settings",
    });
  }
});

// @desc    Export settings
// @route   GET /api/settings/export
// @access  Admin
router.get("/export", protect, admin, async (req, res) => {
  try {
    const settings = await Settings.getSettings();

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="telugu-books-settings-${Date.now()}.json"`,
    );

    res.json({
      exportDate: new Date().toISOString(),
      version: "1.0",
      settings,
    });
  } catch (error) {
    console.error("Export settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export settings",
    });
  }
});

// @desc    Import settings
// @route   POST /api/settings/import
// @access  Admin
router.post("/import", protect, admin, async (req, res) => {
  try {
    const { settings } = req.body;

    if (!settings) {
      return res.status(400).json({
        success: false,
        message: "Settings data is required",
      });
    }

    const updatedSettings = await Settings.updateSettings(
      settings,
      req.user.id,
    );

    res.json({
      success: true,
      message: "Settings imported successfully",
      data: { settings: updatedSettings },
    });
  } catch (error) {
    console.error("Import settings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to import settings",
    });
  }
});

export default router;
