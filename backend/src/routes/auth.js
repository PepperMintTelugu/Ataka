import express from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import Settings from "../models/Settings.js";
import { generateToken, setTokenCookie, protect } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";
import crypto from "crypto";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory OTP storage (in production, use Redis or database)
const otpStorage = new Map();

// Rate limiting for OTP requests
const otpRateLimit = new Map();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
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

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        isEmailVerified: false, // In production, implement email verification
      });

      // Generate token
      const token = generateToken(user._id);

      // Set cookie
      setTokenCookie(res, token);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during registration",
      });
    }
  },
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
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

      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password");

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated. Please contact support.",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      // Set cookie
      setTokenCookie(res, token);

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Server error during login",
      });
    }
  },
);

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Required information not provided by Google",
      });
    }

    // Find or create user
    let user = await User.findOne({
      $or: [{ email }, { googleId }],
    });

    if (user) {
      // Update existing user
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
      user.isEmailVerified = true;
      user.lastLogin = new Date();
      await user.save();
    } else {
      // Create new user
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        isEmailVerified: true,
        lastLogin: new Date(),
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    setTokenCookie(res, token);

    res.json({
      success: true,
      message: "Google authentication successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
        isNewUser: !user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during Google authentication",
    });
  }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
router.post("/logout", protect, (req, res) => {
  try {
    // Clear cookie
    res.clearCookie("token");

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting user information",
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put(
  "/profile",
  protect,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email"),
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

      const { name, email } = req.body;
      const user = await User.findById(req.user.id);

      if (name) user.name = name;
      if (email && email !== user.email) {
        // Check if email is already taken
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email already in use",
          });
        }
        user.email = email;
        user.isEmailVerified = false; // Re-verify email in production
      }

      await user.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({
        success: false,
        message: "Server error updating profile",
      });
    }
  },
);

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
router.put(
  "/password",
  protect,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
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

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id).select("+password");

      // Verify current password
      if (!(await user.comparePassword(currentPassword))) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({
        success: false,
        message: "Server error changing password",
      });
    }
  },
);

// @desc    Get signin settings
// @route   GET /api/auth/signin-settings
// @access  Public
router.get("/signin-settings", async (req, res) => {
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

// Helper function to generate OTP
const generateOTP = (length = 6) => {
  return crypto.randomInt(100000, 999999).toString().padStart(length, "0");
};

// Helper function to check rate limiting
const checkRateLimit = (identifier, maxRequests = 1) => {
  const now = Date.now();
  const minute = 60 * 1000;
  const key = `${identifier}_${Math.floor(now / minute)}`;

  const attempts = otpRateLimit.get(key) || 0;
  if (attempts >= maxRequests) {
    return false;
  }

  otpRateLimit.set(key, attempts + 1);
  // Clean up old entries
  setTimeout(() => otpRateLimit.delete(key), minute);

  return true;
};

// @desc    Send WhatsApp OTP
// @route   POST /api/auth/send-whatsapp-otp
// @access  Public
router.post(
  "/send-whatsapp-otp",
  [
    body("phoneNumber")
      .isMobilePhone()
      .withMessage("Invalid phone number format"),
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

      const { phoneNumber } = req.body;
      const settings = await Settings.getSettings();
      const otpSettings = settings.signIn || {};

      // Check rate limiting
      if (!checkRateLimit(phoneNumber, otpSettings.otpRateLimit || 1)) {
        return res.status(429).json({
          success: false,
          message: "Too many OTP requests. Please try again later.",
        });
      }

      // Generate OTP
      const otp = generateOTP(otpSettings.otpLength || 6);
      const expiresAt =
        Date.now() + (otpSettings.otpValidityMinutes || 5) * 60 * 1000;

      // Store OTP
      otpStorage.set(`whatsapp_${phoneNumber}`, {
        otp,
        expiresAt,
        attempts: 0,
        maxAttempts: otpSettings.maxOtpAttempts || 3,
      });

      // In production, integrate with WhatsApp Business API
      // For demo purposes, we'll log the OTP
      console.log(`WhatsApp OTP for ${phoneNumber}: ${otp}`);

      // Simulate WhatsApp API call
      // await sendWhatsAppMessage(phoneNumber, `Your TeluguBooks verification code is: ${otp}`);

      res.json({
        success: true,
        message: "WhatsApp OTP sent successfully",
        data: {
          phoneNumber,
          expiresIn: otpSettings.otpValidityMinutes || 5,
        },
      });
    } catch (error) {
      console.error("Send WhatsApp OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error sending WhatsApp OTP",
      });
    }
  },
);

// @desc    Send Mobile OTP
// @route   POST /api/auth/send-mobile-otp
// @access  Public
router.post(
  "/send-mobile-otp",
  [
    body("phoneNumber")
      .isMobilePhone()
      .withMessage("Invalid phone number format"),
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

      const { phoneNumber } = req.body;
      const settings = await Settings.getSettings();
      const otpSettings = settings.signIn || {};

      // Check rate limiting
      if (!checkRateLimit(phoneNumber, otpSettings.otpRateLimit || 1)) {
        return res.status(429).json({
          success: false,
          message: "Too many OTP requests. Please try again later.",
        });
      }

      // Generate OTP
      const otp = generateOTP(otpSettings.otpLength || 6);
      const expiresAt =
        Date.now() + (otpSettings.otpValidityMinutes || 5) * 60 * 1000;

      // Store OTP
      otpStorage.set(`mobile_${phoneNumber}`, {
        otp,
        expiresAt,
        attempts: 0,
        maxAttempts: otpSettings.maxOtpAttempts || 3,
      });

      // In production, integrate with SMS gateway (Twilio, AWS SNS, etc.)
      // For demo purposes, we'll log the OTP
      console.log(`Mobile OTP for ${phoneNumber}: ${otp}`);

      // Simulate SMS API call
      // await sendSMS(phoneNumber, `Your TeluguBooks verification code is: ${otp}`);

      res.json({
        success: true,
        message: "Mobile OTP sent successfully",
        data: {
          phoneNumber,
          expiresIn: otpSettings.otpValidityMinutes || 5,
        },
      });
    } catch (error) {
      console.error("Send Mobile OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error sending Mobile OTP",
      });
    }
  },
);

// @desc    Verify WhatsApp OTP
// @route   POST /api/auth/verify-whatsapp-otp
// @access  Public
router.post(
  "/verify-whatsapp-otp",
  [
    body("phoneNumber")
      .isMobilePhone()
      .withMessage("Invalid phone number format"),
    body("otp").isLength({ min: 4, max: 8 }).withMessage("Invalid OTP format"),
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

      const { phoneNumber, otp } = req.body;
      const key = `whatsapp_${phoneNumber}`;
      const storedOtpData = otpStorage.get(key);

      if (!storedOtpData) {
        return res.status(400).json({
          success: false,
          message: "OTP not found or expired. Please request a new one.",
        });
      }

      // Check expiration
      if (Date.now() > storedOtpData.expiresAt) {
        otpStorage.delete(key);
        return res.status(400).json({
          success: false,
          message: "OTP has expired. Please request a new one.",
        });
      }

      // Check max attempts
      if (storedOtpData.attempts >= storedOtpData.maxAttempts) {
        otpStorage.delete(key);
        return res.status(400).json({
          success: false,
          message:
            "Maximum verification attempts exceeded. Please request a new OTP.",
        });
      }

      // Verify OTP
      if (storedOtpData.otp !== otp) {
        storedOtpData.attempts++;
        return res.status(400).json({
          success: false,
          message: "Invalid verification code.",
        });
      }

      // OTP is valid, remove from storage
      otpStorage.delete(key);

      // Find or create user
      let user = await User.findOne({ phoneNumber });

      if (!user) {
        // Create new user with phone number
        user = await User.create({
          name: `User_${phoneNumber.slice(-4)}`, // Temporary name
          phoneNumber,
          isPhoneVerified: true,
          isActive: true,
        });
      } else {
        user.isPhoneVerified = true;
        user.lastLogin = new Date();
        await user.save();
      }

      // Generate token
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.json({
        success: true,
        message: "WhatsApp verification successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
          },
          token,
          isNewUser: !user.lastLogin,
        },
      });
    } catch (error) {
      console.error("Verify WhatsApp OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error verifying WhatsApp OTP",
      });
    }
  },
);

// @desc    Verify Mobile OTP
// @route   POST /api/auth/verify-mobile-otp
// @access  Public
router.post(
  "/verify-mobile-otp",
  [
    body("phoneNumber")
      .isMobilePhone()
      .withMessage("Invalid phone number format"),
    body("otp").isLength({ min: 4, max: 8 }).withMessage("Invalid OTP format"),
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

      const { phoneNumber, otp } = req.body;
      const key = `mobile_${phoneNumber}`;
      const storedOtpData = otpStorage.get(key);

      if (!storedOtpData) {
        return res.status(400).json({
          success: false,
          message: "OTP not found or expired. Please request a new one.",
        });
      }

      // Check expiration
      if (Date.now() > storedOtpData.expiresAt) {
        otpStorage.delete(key);
        return res.status(400).json({
          success: false,
          message: "OTP has expired. Please request a new one.",
        });
      }

      // Check max attempts
      if (storedOtpData.attempts >= storedOtpData.maxAttempts) {
        otpStorage.delete(key);
        return res.status(400).json({
          success: false,
          message:
            "Maximum verification attempts exceeded. Please request a new OTP.",
        });
      }

      // Verify OTP
      if (storedOtpData.otp !== otp) {
        storedOtpData.attempts++;
        return res.status(400).json({
          success: false,
          message: "Invalid verification code.",
        });
      }

      // OTP is valid, remove from storage
      otpStorage.delete(key);

      // Find or create user
      let user = await User.findOne({ phoneNumber });

      if (!user) {
        // Create new user with phone number
        user = await User.create({
          name: `User_${phoneNumber.slice(-4)}`, // Temporary name
          phoneNumber,
          isPhoneVerified: true,
          isActive: true,
        });
      } else {
        user.isPhoneVerified = true;
        user.lastLogin = new Date();
        await user.save();
      }

      // Generate token
      const token = generateToken(user._id);
      setTokenCookie(res, token);

      res.json({
        success: true,
        message: "Mobile verification successful",
        data: {
          user: {
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            email: user.email,
            role: user.role,
          },
          token,
          isNewUser: !user.lastLogin,
        },
      });
    } catch (error) {
      console.error("Verify Mobile OTP error:", error);
      res.status(500).json({
        success: false,
        message: "Server error verifying Mobile OTP",
      });
    }
  },
);

export default router;
