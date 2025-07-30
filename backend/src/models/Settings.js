import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    // Brand Configuration
    brand: {
      name: {
        type: String,
        default: "TeluguBooks",
        trim: true,
        maxlength: [50, "Brand name cannot exceed 50 characters"],
      },
      nameTelugu: {
        type: String,
        default: "తెలుగు పుస��తకాలు",
        trim: true,
        maxlength: [50, "Telugu brand name cannot exceed 50 characters"],
      },
      logo: {
        type: String,
        default: "/api/placeholder/200/80",
      },
      favicon: {
        type: String,
        default: "/favicon.ico",
      },
      tagline: {
        type: String,
        default: "Preserving and promoting Telugu literature",
        maxlength: [200, "Tagline cannot exceed 200 characters"],
      },
      taglineTelugu: {
        type: String,
        default: "తెలుగు సాహిత్య ప్రేমికుల కోసం",
        maxlength: [200, "Telugu tagline cannot exceed 200 characters"],
      },
    },

    // Color Theme Configuration
    theme: {
      primary: {
        type: String,
        default: "#ed7611", // brand-500
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
      },
      secondary: {
        type: String,
        default: "#0ea5e9", // telugu-500
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
      },
      accent: {
        type: String,
        default: "#f19334", // brand-400
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
      },
      background: {
        type: String,
        default: "#ffffff",
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
      },
      text: {
        type: String,
        default: "#1f2937", // gray-800
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
      },
      muted: {
        type: String,
        default: "#6b7280", // gray-500
        match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
      },
    },

    // Button Customization
    buttons: {
      addToCart: {
        backgroundColor: {
          type: String,
          default: "#ed7611", // primary color
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        textColor: {
          type: String,
          default: "#ffffff",
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        hoverColor: {
          type: String,
          default: "#de5d07", // brand-600
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        borderRadius: {
          type: String,
          default: "0.5rem",
        },
      },
      buyNow: {
        backgroundColor: {
          type: String,
          default: "#0ea5e9", // secondary color
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        textColor: {
          type: String,
          default: "#ffffff",
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        hoverColor: {
          type: String,
          default: "#0284c7", // telugu-600
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        borderRadius: {
          type: String,
          default: "0.5rem",
        },
      },
      wishlist: {
        backgroundColor: {
          type: String,
          default: "#ffffff",
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        textColor: {
          type: String,
          default: "#ef4444", // red-500
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        hoverColor: {
          type: String,
          default: "#fef2f2", // red-50
          match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color"],
        },
        borderRadius: {
          type: String,
          default: "0.5rem",
        },
      },
    },

    // Contact Information
    contact: {
      email: {
        type: String,
        default: "support@telugubooks.org",
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Invalid email format",
        ],
      },
      phone: {
        type: String,
        default: "+91 98765 43210",
      },
      address: {
        street: { type: String, default: "Hyderabad" },
        city: { type: String, default: "Hyderabad" },
        state: { type: String, default: "Telangana" },
        country: { type: String, default: "India" },
        pincode: { type: String, default: "500001" },
      },
      socialMedia: {
        facebook: String,
        twitter: String,
        instagram: String,
        youtube: String,
        linkedin: String,
      },
    },

    // SEO Configuration
    seo: {
      metaTitle: {
        type: String,
        default: "TeluguBooks - Telugu Literature Collection",
        maxlength: [60, "Meta title cannot exceed 60 characters"],
      },
      metaDescription: {
        type: String,
        default:
          "Discover the finest collection of Telugu books with free delivery across India. Classic literature, devotional books, poetry and more.",
        maxlength: [160, "Meta description cannot exceed 160 characters"],
      },
      keywords: [
        {
          type: String,
          default: [
            "telugu books",
            "telugu literature",
            "telugu novels",
            "telugu poetry",
            "devotional books",
            "free delivery",
          ],
        },
      ],
      ogImage: String,
      twitterCard: {
        type: String,
        default: "summary_large_image",
      },
    },

    // Business Configuration
    business: {
      freeShippingThreshold: {
        type: Number,
        default: 0, // Free shipping on all orders
      },
      currency: {
        type: String,
        default: "INR",
      },
      currencySymbol: {
        type: String,
        default: "₹",
      },
      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
      supportedLanguages: [
        {
          type: String,
          default: ["Telugu", "English", "Hindi"],
        },
      ],
    },

    // Feature Flags
    features: {
      enableReviews: { type: Boolean, default: true },
      enableWishlist: { type: Boolean, default: true },
      enableGuestCheckout: { type: Boolean, default: true },
      enableMultipleAddresses: { type: Boolean, default: true },
      enableGiftWrapping: { type: Boolean, default: false },
      enableDiscountCoupons: { type: Boolean, default: false },
      enableNewsletterSignup: { type: Boolean, default: true },
      enableSocialLogin: { type: Boolean, default: true },
    },

    // Sign In Configuration
    signIn: {
      enableGoogle: { type: Boolean, default: true },
      enableWhatsAppOTP: { type: Boolean, default: true },
      enableMobileOTP: { type: Boolean, default: true },
      enableEmailPassword: { type: Boolean, default: true },
      primaryMethod: {
        type: String,
        enum: ["google", "whatsapp", "mobile", "email"],
        default: "google",
      },
      whatsappNumber: {
        type: String,
        default: "+91 98765 43210",
      },
      otpLength: {
        type: Number,
        default: 6,
        min: 4,
        max: 8,
      },
      otpValidityMinutes: {
        type: Number,
        default: 5,
        min: 1,
        max: 30,
      },
      maxOtpAttempts: {
        type: Number,
        default: 3,
        min: 1,
        max: 10,
      },
      otpRateLimit: {
        type: Number,
        default: 1, // per minute
        min: 1,
        max: 10,
      },
    },

    // Homepage Configuration
    homepage: {
      heroSlider: {
        images: [
          {
            id: String,
            image: String,
            title: String,
            titleTelugu: String,
            subtitle: String,
            subtitleTelugu: String,
            buttonText: String,
            buttonTextTelugu: String,
            linkUrl: String,
            isActive: { type: Boolean, default: true },
            order: { type: Number, default: 1 },
          },
        ],
        settings: {
          autoPlay: { type: Boolean, default: true },
          autoPlayDelay: { type: Number, default: 5000 },
          showDots: { type: Boolean, default: true },
          showArrows: { type: Boolean, default: true },
          height: { type: String, default: "500px" },
        },
      },
      categories: {
        title: { type: String, default: "Browse Categories" },
        titleTelugu: { type: String, default: "వర్గాలను విహరించండి" },
        categories: [
          {
            categoryId: String,
            name: String,
            nameTelugu: String,
            description: String,
            descriptionTelugu: String,
            image: String,
            icon: String,
            color: { type: String, default: "#3B82F6" },
            isActive: { type: Boolean, default: true },
            order: { type: Number, default: 1 },
          },
        ],
        settings: {
          layout: { type: String, enum: ["grid", "carousel"], default: "grid" },
          itemsPerRow: { type: Number, default: 4, min: 1, max: 6 },
          showDescription: { type: Boolean, default: true },
          showIcons: { type: Boolean, default: true },
        },
      },
    },

    // Notification Settings
    notifications: {
      orderConfirmation: { type: Boolean, default: true },
      shippingUpdates: { type: Boolean, default: true },
      deliveryNotification: { type: Boolean, default: true },
      reviewReminders: { type: Boolean, default: true },
      promotionalEmails: { type: Boolean, default: false },
      smsNotifications: { type: Boolean, default: false },
    },

    // Admin Configuration
    admin: {
      itemsPerPage: { type: Number, default: 20 },
      autoApproveReviews: { type: Boolean, default: false },
      lowStockThreshold: { type: Number, default: 10 },
      backupFrequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "weekly",
      },
    },

    // Analytics
    analytics: {
      googleAnalyticsId: String,
      facebookPixelId: String,
      enableHotjar: { type: Boolean, default: false },
      hotjarId: String,
    },

    // Maintenance
    maintenance: {
      isMaintenanceMode: { type: Boolean, default: false },
      maintenanceMessage: {
        type: String,
        default:
          "We're currently updating our systems. Please check back soon!",
      },
      maintenanceEndTime: Date,
    },

    // Last updated info
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

// Update settings method
settingsSchema.statics.updateSettings = async function (updates, updatedBy) {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this(updates);
  } else {
    Object.assign(settings, updates);
  }
  settings.lastUpdatedBy = updatedBy;
  return settings.save();
};

const Settings = mongoose.model("Settings", settingsSchema);

export default Settings;
