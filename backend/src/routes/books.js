import express from "express";
import Book from "../models/Book.js";
import { protect, admin, optionalAuth } from "../middleware/auth.js";
import { body, query, validationResult } from "express-validator";

const router = express.Router();

// @desc    Get all books with filtering, sorting, and pagination
// @route   GET /api/books
// @access  Public
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Invalid page"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Invalid limit"),
    query("category").optional().isString(),
    query("language").optional().isString(),
    query("author").optional().isString(),
    query("minPrice").optional().isFloat({ min: 0 }),
    query("maxPrice").optional().isFloat({ min: 0 }),
    query("rating").optional().isFloat({ min: 0, max: 5 }),
    query("search").optional().isString(),
    query("sortBy")
      .optional()
      .isIn([
        "price",
        "-price",
        "rating",
        "-rating",
        "salesCount",
        "-salesCount",
        "createdAt",
        "-createdAt",
        "title",
        "-title",
      ]),
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

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = { isActive: true };

      if (req.query.category) {
        filter.category = req.query.category;
      }

      if (req.query.language) {
        filter.language = req.query.language;
      }

      if (req.query.author) {
        filter.author = { $regex: req.query.author, $options: "i" };
      }

      if (req.query.minPrice || req.query.maxPrice) {
        filter.price = {};
        if (req.query.minPrice)
          filter.price.$gte = parseFloat(req.query.minPrice);
        if (req.query.maxPrice)
          filter.price.$lte = parseFloat(req.query.maxPrice);
      }

      if (req.query.rating) {
        filter.rating = { $gte: parseFloat(req.query.rating) };
      }

      if (req.query.inStock !== undefined) {
        filter.inStock = req.query.inStock === "true";
      }

      if (req.query.featured === "true") {
        filter.featured = true;
      }

      if (req.query.bestseller === "true") {
        filter.bestseller = true;
      }

      if (req.query.newArrival === "true") {
        filter.newArrival = true;
      }

      // Text search
      if (req.query.search) {
        filter.$text = { $search: req.query.search };
      }

      // Sort options
      let sortOption = {};
      if (req.query.sortBy) {
        const sortField = req.query.sortBy.startsWith("-")
          ? req.query.sortBy.substring(1)
          : req.query.sortBy;
        const sortDirection = req.query.sortBy.startsWith("-") ? -1 : 1;
        sortOption[sortField] = sortDirection;
      } else {
        sortOption = { createdAt: -1 }; // Default sort by newest
      }

      // Execute query
      const books = await Book.find(filter)
        .sort(sortOption)
        .limit(limit)
        .skip(skip)
        .select("-reviews") // Don't include reviews in list view
        .lean();

      // Get total count for pagination
      const total = await Book.countDocuments(filter);

      // Calculate pagination info
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      res.json({
        success: true,
        data: {
          books,
          pagination: {
            currentPage: page,
            totalPages,
            totalBooks: total,
            hasNextPage,
            hasPrevPage,
            limit,
          },
        },
      });
    } catch (error) {
      console.error("Get books error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch books",
      });
    }
  },
);

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("reviews.user", "name avatar")
      .populate("createdBy", "name");

    if (!book || !book.isActive) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if book is in user's wishlist (if authenticated)
    let isInWishlist = false;
    if (req.user) {
      isInWishlist = req.user.wishlist.includes(book._id);
    }

    res.json({
      success: true,
      data: {
        book,
        isInWishlist,
      },
    });
  } catch (error) {
    console.error("Get book error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch book",
    });
  }
});

// @desc    Create new book
// @route   POST /api/books
// @access  Admin
router.post(
  "/",
  protect,
  admin,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("author").trim().notEmpty().withMessage("Author is required"),
    body("publisher").trim().notEmpty().withMessage("Publisher is required"),
    body("isbn").notEmpty().withMessage("ISBN is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be positive"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required"),
    body("image").notEmpty().withMessage("Image is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("pages").isInt({ min: 1 }).withMessage("Pages must be positive"),
    body("language").notEmpty().withMessage("Language is required"),
    body("dimensions").isObject().withMessage("Dimensions are required"),
    body("weight").isFloat({ min: 0 }).withMessage("Weight must be positive"),
    body("publicationYear").isInt().withMessage("Publication year is required"),
    body("stockCount").isInt({ min: 0 }).withMessage("Stock count is required"),
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

      // Check if ISBN already exists
      const existingBook = await Book.findOne({ isbn: req.body.isbn });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          message: "Book with this ISBN already exists",
        });
      }

      // Calculate discount if originalPrice is provided
      let discount = 0;
      if (req.body.originalPrice && req.body.originalPrice > req.body.price) {
        discount = Math.round(
          ((req.body.originalPrice - req.body.price) / req.body.originalPrice) *
            100,
        );
      }

      const bookData = {
        ...req.body,
        discount,
        createdBy: req.user.id,
        inStock: req.body.stockCount > 0,
      };

      const book = await Book.create(bookData);

      res.status(201).json({
        success: true,
        message: "Book created successfully",
        data: { book },
      });
    } catch (error) {
      console.error("Create book error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create book",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if ISBN is being changed and if it already exists
    if (req.body.isbn && req.body.isbn !== book.isbn) {
      const existingBook = await Book.findOne({ isbn: req.body.isbn });
      if (existingBook) {
        return res.status(400).json({
          success: false,
          message: "Book with this ISBN already exists",
        });
      }
    }

    // Calculate discount if prices are updated
    if (req.body.originalPrice && req.body.price) {
      if (req.body.originalPrice > req.body.price) {
        req.body.discount = Math.round(
          ((req.body.originalPrice - req.body.price) / req.body.originalPrice) *
            100,
        );
      } else {
        req.body.discount = 0;
      }
    }

    // Update inStock status based on stockCount
    if (req.body.stockCount !== undefined) {
      req.body.inStock = req.body.stockCount > 0;
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Book updated successfully",
      data: { book: updatedBook },
    });
  } catch (error) {
    console.error("Update book error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update book",
    });
  }
});

// @desc    Delete book (soft delete)
// @route   DELETE /api/books/:id
// @access  Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Soft delete
    book.isActive = false;
    await book.save();

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete book",
    });
  }
});

// @desc    Add review to book
// @route   POST /api/books/:id/reviews
// @access  Private
router.post(
  "/:id/reviews",
  protect,
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment").trim().notEmpty().withMessage("Comment is required"),
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

      const { rating, comment } = req.body;
      const book = await Book.findById(req.params.id);

      if (!book) {
        return res.status(404).json({
          success: false,
          message: "Book not found",
        });
      }

      // Check if user already reviewed this book
      const existingReview = book.reviews.find(
        (review) => review.user.toString() === req.user.id,
      );

      if (existingReview) {
        return res.status(400).json({
          success: false,
          message: "You have already reviewed this book",
        });
      }

      // Add review
      book.reviews.push({
        user: req.user.id,
        rating,
        comment,
      });

      // Recalculate average rating
      await book.calculateAverageRating();

      const populatedBook = await Book.findById(req.params.id).populate(
        "reviews.user",
        "name avatar",
      );

      res.status(201).json({
        success: true,
        message: "Review added successfully",
        data: {
          book: populatedBook,
        },
      });
    } catch (error) {
      console.error("Add review error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add review",
      });
    }
  },
);

// @desc    Get book categories
// @route   GET /api/books/categories
// @access  Public
router.get("/data/categories", async (req, res) => {
  try {
    const categories = await Book.distinct("category", { isActive: true });

    res.json({
      success: true,
      data: { categories },
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
});

// @desc    Get book languages
// @route   GET /api/books/languages
// @access  Public
router.get("/data/languages", async (req, res) => {
  try {
    const languages = await Book.distinct("language", { isActive: true });

    res.json({
      success: true,
      data: { languages },
    });
  } catch (error) {
    console.error("Get languages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch languages",
    });
  }
});

export default router;
