import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Review cannot exceed 500 characters"],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    titleTelugu: {
      type: String,
      trim: true,
      maxlength: [200, "Telugu title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: [100, "Author name cannot exceed 100 characters"],
    },
    authorTelugu: {
      type: String,
      trim: true,
      maxlength: [100, "Telugu author name cannot exceed 100 characters"],
    },
    publisher: {
      type: String,
      required: [true, "Publisher is required"],
      trim: true,
      maxlength: [100, "Publisher name cannot exceed 100 characters"],
    },
    publisherTelugu: {
      type: String,
      trim: true,
      maxlength: [100, "Telugu publisher name cannot exceed 100 characters"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
      match: [
        /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/,
        "Please provide a valid ISBN",
      ],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    discount: {
      type: Number,
      min: [0, "Discount cannot be negative"],
      max: [100, "Discount cannot exceed 100%"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    descriptionTelugu: {
      type: String,
      trim: true,
      maxlength: [2000, "Telugu description cannot exceed 2000 characters"],
    },
    image: {
      type: String,
      required: [true, "Book image is required"],
    },
    images: [String],
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "literature",
        "poetry",
        "devotional",
        "educational",
        "children",
        "history",
        "philosophy",
        "biography",
      ],
    },
    categoryTelugu: String,
    pages: {
      type: Number,
      required: [true, "Number of pages is required"],
      min: [1, "Pages must be at least 1"],
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      enum: ["Telugu", "English", "Hindi"],
    },
    dimensions: {
      length: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
    },
    weight: {
      type: Number,
      required: [true, "Weight is required"],
      min: [0, "Weight cannot be negative"],
    },
    publicationYear: {
      type: Number,
      required: [true, "Publication year is required"],
      min: [1800, "Publication year seems too old"],
      max: [
        new Date().getFullYear() + 1,
        "Publication year cannot be in future",
      ],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    inStock: {
      type: Boolean,
      default: true,
    },
    stockCount: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock count cannot be negative"],
    },
    tags: [String],
    seoTitle: String,
    seoDescription: String,
    featured: {
      type: Boolean,
      default: false,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    newArrival: {
      type: Boolean,
      default: false,
    },
    salesCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Import tracking
    woocommerceId: {
      type: Number,
      unique: true,
      sparse: true,
    },
    importSource: {
      type: String,
      enum: ["manual", "woocommerce", "csv", "api"],
      default: "manual",
    },
    importDate: Date,
    woocommerceData: {
      originalId: Number,
      permalink: String,
      type: String,
      status: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better query performance
bookSchema.index({ title: "text", author: "text", description: "text" });
bookSchema.index({ category: 1 });
bookSchema.index({ language: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ rating: -1 });
bookSchema.index({ salesCount: -1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ featured: 1 });
bookSchema.index({ bestseller: 1 });
bookSchema.index({ newArrival: 1 });

// Calculate average rating when reviews are updated
bookSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.reviewCount = 0;
  } else {
    const totalRating = this.reviews.reduce(
      (acc, review) => acc + review.rating,
      0,
    );
    this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.reviewCount = this.reviews.length;
  }
  return this.save();
};

// Update stock after purchase
bookSchema.methods.updateStock = function (quantity) {
  this.stockCount = Math.max(0, this.stockCount - quantity);
  this.inStock = this.stockCount > 0;
  this.salesCount += quantity;
  return this.save();
};

const Book = mongoose.model("Book", bookSchema);

export default Book;
