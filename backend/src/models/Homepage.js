import mongoose from "mongoose";

const sliderImageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleTelugu: String,
  subtitle: String,
  subtitleTelugu: String,
  buttonText: {
    type: String,
    default: "Shop Now",
  },
  buttonTextTelugu: String,
  linkUrl: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const categoryDisplaySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  nameTelugu: String,
  description: String,
  descriptionTelugu: String,
  image: String,
  icon: String,
  color: {
    type: String,
    default: "#3B82F6",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const authorSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  nameTelugu: String,
  image: String,
  bio: String,
  bioTelugu: String,
  booksCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const publisherSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  nameTelugu: String,
  logo: String,
  description: String,
  descriptionTelugu: String,
  website: String,
  booksCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const sectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "hero-slider",
      "categories",
      "featured-books",
      "bestsellers",
      "new-arrivals",
      "authors",
      "publishers",
      "testimonials",
      "newsletter",
      "stats",
      "why-choose-us",
    ],
  },
  title: String,
  titleTelugu: String,
  subtitle: String,
  subtitleTelugu: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    required: true,
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const homepageSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: "Telugu Books",
    },
    siteNameTelugu: {
      type: String,
      default: "తెలుగు పుస్తకాలు",
    },

    // Hero Section
    sliderImages: [sliderImageSchema],

    // Categories Section
    featuredCategories: [categoryDisplaySchema],
    categoriesTitle: {
      type: String,
      default: "Book Categories",
    },
    categoriesTitleTelugu: {
      type: String,
      default: "పుస్తక వర్గాలు",
    },

    // Authors Section
    featuredAuthors: [authorSchema],
    authorsTitle: {
      type: String,
      default: "Featured Authors",
    },
    authorsTitleTelugu: {
      type: String,
      default: "ప్రముఖ రచయితలు",
    },

    // Publishers Section
    featuredPublishers: [publisherSchema],
    publishersTitle: {
      type: String,
      default: "Trusted Publishers",
    },
    publishersTitleTelugu: {
      type: String,
      default: "విశ్వసనీయ ప్రచురణకర్తలు",
    },

    // Section Management
    sections: [sectionSchema],

    // SEO
    metaTitle: String,
    metaTitleTelugu: String,
    metaDescription: String,
    metaDescriptionTelugu: String,

    // Social Media
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      youtube: String,
      telegram: String,
    },

    // Contact Info
    contactInfo: {
      phone: String,
      email: String,
      address: String,
      addressTelugu: String,
      workingHours: String,
      workingHoursTelugu: String,
    },

    // Flags
    isActive: {
      type: Boolean,
      default: true,
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Index for better performance
homepageSchema.index({ "sections.order": 1 });
homepageSchema.index({ "featuredAuthors.order": 1 });
homepageSchema.index({ "featuredPublishers.order": 1 });
homepageSchema.index({ "featuredCategories.order": 1 });

// Static method to get homepage configuration
homepageSchema.statics.getConfiguration = async function () {
  let config = await this.findOne({ isActive: true });

  if (!config) {
    // Create default configuration
    config = await this.create({
      sections: [
        { id: "hero-slider", type: "hero-slider", order: 1, isActive: true },
        { id: "categories", type: "categories", order: 2, isActive: true },
        {
          id: "featured-books",
          type: "featured-books",
          order: 3,
          isActive: true,
        },
        { id: "bestsellers", type: "bestsellers", order: 4, isActive: true },
        { id: "new-arrivals", type: "new-arrivals", order: 5, isActive: true },
        { id: "authors", type: "authors", order: 6, isActive: true },
        {
          id: "why-choose-us",
          type: "why-choose-us",
          order: 7,
          isActive: true,
        },
        { id: "stats", type: "stats", order: 8, isActive: true },
        { id: "publishers", type: "publishers", order: 9, isActive: true },
        { id: "newsletter", type: "newsletter", order: 10, isActive: true },
      ],
    });
  }

  return config;
};

// Method to update section order
homepageSchema.methods.updateSectionOrder = function (sectionUpdates) {
  sectionUpdates.forEach((update) => {
    const section = this.sections.id(update.id);
    if (section) {
      section.order = update.order;
      section.isActive = update.isActive;
    }
  });
  return this.save();
};

const Homepage = mongoose.model("Homepage", homepageSchema);
const Author = mongoose.model("Author", authorSchema);
const Publisher = mongoose.model("Publisher", publisherSchema);

export { Homepage, Author, Publisher };
export default Homepage;
