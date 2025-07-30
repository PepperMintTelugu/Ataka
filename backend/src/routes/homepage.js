import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Homepage, { Author, Publisher } from "../models/Homepage.js";
import Book from "../models/Book.js";
import { protect, admin } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = `uploads/${req.params.type || "homepage"}`;
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
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
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

// @desc    Get homepage configuration
// @route   GET /api/homepage
// @access  Public
router.get("/", async (req, res) => {
  try {
    const homepage = await Homepage.getConfiguration();

    // Sort sections by order
    homepage.sections = homepage.sections
      .filter((section) => section.isActive)
      .sort((a, b) => a.order - b.order);

    homepage.featuredAuthors = homepage.featuredAuthors
      .filter((author) => author.isActive)
      .sort((a, b) => a.order - b.order);

    homepage.featuredPublishers = homepage.featuredPublishers
      .filter((publisher) => publisher.isActive)
      .sort((a, b) => a.order - b.order);

    homepage.featuredCategories = homepage.featuredCategories
      .filter((category) => category.isActive)
      .sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: homepage,
    });
  } catch (error) {
    console.error("Get homepage error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting homepage configuration",
    });
  }
});

// @desc    Update homepage configuration
// @route   PUT /api/homepage
// @access  Admin
router.put("/", protect, admin, async (req, res) => {
  try {
    const {
      siteName,
      siteNameTelugu,
      categoriesTitle,
      categoriesTitleTelugu,
      authorsTitle,
      authorsTitleTelugu,
      publishersTitle,
      publishersTitleTelugu,
      metaTitle,
      metaTitleTelugu,
      metaDescription,
      metaDescriptionTelugu,
      socialMedia,
      contactInfo,
    } = req.body;

    let homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      homepage = await Homepage.getConfiguration();
    }

    // Update basic info
    if (siteName) homepage.siteName = siteName;
    if (siteNameTelugu) homepage.siteNameTelugu = siteNameTelugu;
    if (categoriesTitle) homepage.categoriesTitle = categoriesTitle;
    if (categoriesTitleTelugu)
      homepage.categoriesTitleTelugu = categoriesTitleTelugu;
    if (authorsTitle) homepage.authorsTitle = authorsTitle;
    if (authorsTitleTelugu) homepage.authorsTitleTelugu = authorsTitleTelugu;
    if (publishersTitle) homepage.publishersTitle = publishersTitle;
    if (publishersTitleTelugu)
      homepage.publishersTitleTelugu = publishersTitleTelugu;
    if (metaTitle) homepage.metaTitle = metaTitle;
    if (metaTitleTelugu) homepage.metaTitleTelugu = metaTitleTelugu;
    if (metaDescription) homepage.metaDescription = metaDescription;
    if (metaDescriptionTelugu)
      homepage.metaDescriptionTelugu = metaDescriptionTelugu;
    if (socialMedia)
      homepage.socialMedia = { ...homepage.socialMedia, ...socialMedia };
    if (contactInfo)
      homepage.contactInfo = { ...homepage.contactInfo, ...contactInfo };

    homepage.lastUpdatedBy = req.user.id;
    await homepage.save();

    res.json({
      success: true,
      message: "Homepage configuration updated successfully",
      data: homepage,
    });
  } catch (error) {
    console.error("Update homepage error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating homepage configuration",
    });
  }
});

// @desc    Upload image
// @route   POST /api/homepage/upload/:type
// @access  Admin
router.post(
  "/upload/:type",
  protect,
  admin,
  upload.single("image"),
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file uploaded",
        });
      }

      const imageUrl = `/uploads/${req.params.type}/${req.file.filename}`;

      res.json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          imageUrl,
          originalName: req.file.originalname,
          size: req.file.size,
        },
      });
    } catch (error) {
      console.error("Upload image error:", error);
      res.status(500).json({
        success: false,
        message: "Server error uploading image",
      });
    }
  },
);

// @desc    Update slider images
// @route   PUT /api/homepage/slider
// @access  Admin
router.put("/slider", protect, admin, async (req, res) => {
  try {
    const { sliderImages } = req.body;

    let homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      homepage = await Homepage.getConfiguration();
    }

    homepage.sliderImages = sliderImages;
    homepage.lastUpdatedBy = req.user.id;
    await homepage.save();

    res.json({
      success: true,
      message: "Slider images updated successfully",
      data: homepage.sliderImages,
    });
  } catch (error) {
    console.error("Update slider error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating slider images",
    });
  }
});

// @desc    Update featured categories
// @route   PUT /api/homepage/categories
// @access  Admin
router.put("/categories", protect, admin, async (req, res) => {
  try {
    const { featuredCategories } = req.body;

    let homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      homepage = await Homepage.getConfiguration();
    }

    homepage.featuredCategories = featuredCategories;
    homepage.lastUpdatedBy = req.user.id;
    await homepage.save();

    res.json({
      success: true,
      message: "Featured categories updated successfully",
      data: homepage.featuredCategories,
    });
  } catch (error) {
    console.error("Update categories error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating featured categories",
    });
  }
});

// @desc    Update section order
// @route   PUT /api/homepage/sections
// @access  Admin
router.put("/sections", protect, admin, async (req, res) => {
  try {
    const { sections } = req.body;

    let homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      homepage = await Homepage.getConfiguration();
    }

    await homepage.updateSectionOrder(sections);

    res.json({
      success: true,
      message: "Section order updated successfully",
      data: homepage.sections,
    });
  } catch (error) {
    console.error("Update sections error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating section order",
    });
  }
});

// @desc    Get all authors
// @route   GET /api/homepage/authors
// @access  Public
router.get("/authors", async (req, res) => {
  try {
    const homepage = await Homepage.findOne({ isActive: true });

    if (!homepage) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const authors = homepage.featuredAuthors
      .filter((author) => author.isActive)
      .sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: authors,
    });
  } catch (error) {
    console.error("Get authors error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting authors",
    });
  }
});

// @desc    Get author by ID with books
// @route   GET /api/homepage/authors/:id
// @access  Public
router.get("/authors/:id", async (req, res) => {
  try {
    const homepage = await Homepage.findOne({ isActive: true });
    const author = homepage?.featuredAuthors.find(
      (a) => a.id === req.params.id,
    );

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found",
      });
    }

    // Get books by this author
    const books = await Book.find({
      $or: [
        { author: new RegExp(author.name, "i") },
        { authorTelugu: new RegExp(author.nameTelugu || author.name, "i") },
      ],
      isActive: true,
    }).limit(20);

    res.json({
      success: true,
      data: {
        author,
        books,
        booksCount: books.length,
      },
    });
  } catch (error) {
    console.error("Get author error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting author details",
    });
  }
});

// @desc    Add/Update author
// @route   POST /api/homepage/authors
// @access  Admin
router.post("/authors", protect, admin, async (req, res) => {
  try {
    const { authors } = req.body;

    let homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      homepage = await Homepage.getConfiguration();
    }

    homepage.featuredAuthors = authors;
    homepage.lastUpdatedBy = req.user.id;
    await homepage.save();

    res.json({
      success: true,
      message: "Authors updated successfully",
      data: homepage.featuredAuthors,
    });
  } catch (error) {
    console.error("Update authors error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating authors",
    });
  }
});

// @desc    Get all publishers
// @route   GET /api/homepage/publishers
// @access  Public
router.get("/publishers", async (req, res) => {
  try {
    const homepage = await Homepage.findOne({ isActive: true });

    if (!homepage) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const publishers = homepage.featuredPublishers
      .filter((publisher) => publisher.isActive)
      .sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: publishers,
    });
  } catch (error) {
    console.error("Get publishers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting publishers",
    });
  }
});

// @desc    Get publisher by ID with books
// @route   GET /api/homepage/publishers/:id
// @access  Public
router.get("/publishers/:id", async (req, res) => {
  try {
    const homepage = await Homepage.findOne({ isActive: true });
    const publisher = homepage?.featuredPublishers.find(
      (p) => p.id === req.params.id,
    );

    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found",
      });
    }

    // Get books by this publisher
    const books = await Book.find({
      $or: [
        { publisher: new RegExp(publisher.name, "i") },
        {
          publisherTelugu: new RegExp(
            publisher.nameTelugu || publisher.name,
            "i",
          ),
        },
      ],
      isActive: true,
    }).limit(20);

    res.json({
      success: true,
      data: {
        publisher,
        books,
        booksCount: books.length,
      },
    });
  } catch (error) {
    console.error("Get publisher error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting publisher details",
    });
  }
});

// @desc    Add/Update publishers
// @route   POST /api/homepage/publishers
// @access  Admin
router.post("/publishers", protect, admin, async (req, res) => {
  try {
    const { publishers } = req.body;

    let homepage = await Homepage.findOne({ isActive: true });
    if (!homepage) {
      homepage = await Homepage.getConfiguration();
    }

    homepage.featuredPublishers = publishers;
    homepage.lastUpdatedBy = req.user.id;
    await homepage.save();

    res.json({
      success: true,
      message: "Publishers updated successfully",
      data: homepage.featuredPublishers,
    });
  } catch (error) {
    console.error("Update publishers error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating publishers",
    });
  }
});

export default router;
