import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Mock data for authors (in production, this would be MongoDB)
let authors = [
  {
    id: "viswanatha-satyanarayana",
    name: "Viswanatha Satyanarayana",
    nameTelugu: "విశ్వన��థ సత్యనారాయణ",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    bio: "Jnanpith Award winner and renowned Telugu author",
    bioTelugu: "జ్ఞానపీఠ పురస్కార గ్రహీత మరియు ప్రఖ్యాత తెలుగు రచయిత",
    booksCount: 45,
    totalSales: 125000,
    monthlyRevenue: 15000,
    isActive: true,
    order: 1,
    specialization: "Literature",
    birthYear: 1895,
    awards: ["Jnanpith Award", "Sahitya Akademi Award"],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date()
  },
  {
    id: "yandamuri-veerendranath",
    name: "Yandamuri Veerendranath",
    nameTelugu: "యండమూరి వీరేంద్రనాథ్",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    bio: "Contemporary novelist and screenwriter",
    bioTelugu: "సమకాలీన నవలా రచయిత మరియు రచనా రచయిత",
    booksCount: 52,
    totalSales: 89000,
    monthlyRevenue: 12000,
    isActive: true,
    order: 2,
    specialization: "Fiction",
    birthYear: 1948,
    awards: ["Nandi Award"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date()
  }
];

// Get all authors
router.get("/", (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort = "name" } = req.query;
    
    let filteredAuthors = authors;
    
    // Search functionality
    if (search) {
      filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(search.toLowerCase()) ||
        (author.nameTelugu && author.nameTelugu.includes(search))
      );
    }
    
    // Sort functionality
    filteredAuthors.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "booksCount":
          return b.booksCount - a.booksCount;
        case "totalSales":
          return b.totalSales - a.totalSales;
        case "createdAt":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return a.order - b.order;
      }
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedAuthors = filteredAuthors.slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedAuthors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredAuthors.length / limit),
        totalItems: filteredAuthors.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch authors",
      error: error.message
    });
  }
});

// Get author by ID
router.get("/:id", (req, res) => {
  try {
    const author = authors.find(a => a.id === req.params.id);
    
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found"
      });
    }
    
    res.json({
      success: true,
      data: author
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch author",
      error: error.message
    });
  }
});

// Create new author
router.post("/", [
  body("name").notEmpty().withMessage("Name is required"),
  body("booksCount").isInt({ min: 0 }).withMessage("Books count must be a positive integer"),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }
    
    const newAuthor = {
      id: req.body.name.toLowerCase().replace(/\s+/g, "-"),
      ...req.body,
      totalSales: 0,
      monthlyRevenue: 0,
      order: authors.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    authors.push(newAuthor);
    
    res.status(201).json({
      success: true,
      data: newAuthor,
      message: "Author created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create author",
      error: error.message
    });
  }
});

// Update author
router.put("/:id", [
  body("name").optional().notEmpty(),
  body("booksCount").optional().isInt({ min: 0 }),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array()
      });
    }
    
    const authorIndex = authors.findIndex(a => a.id === req.params.id);
    
    if (authorIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Author not found"
      });
    }
    
    authors[authorIndex] = {
      ...authors[authorIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      data: authors[authorIndex],
      message: "Author updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update author",
      error: error.message
    });
  }
});

// Delete author
router.delete("/:id", (req, res) => {
  try {
    const authorIndex = authors.findIndex(a => a.id === req.params.id);
    
    if (authorIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Author not found"
      });
    }
    
    const deletedAuthor = authors.splice(authorIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedAuthor,
      message: "Author deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete author",
      error: error.message
    });
  }
});

// Get author analytics
router.get("/:id/analytics", (req, res) => {
  try {
    const author = authors.find(a => a.id === req.params.id);
    
    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Author not found"
      });
    }
    
    // Mock analytics data
    const analytics = {
      totalSales: author.totalSales,
      monthlyRevenue: author.monthlyRevenue,
      avgOrderValue: Math.round(author.totalSales / (author.booksCount * 10)),
      topBooks: [
        { title: "Book 1", sales: 1200 },
        { title: "Book 2", sales: 950 },
        { title: "Book 3", sales: 780 }
      ],
      monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
        revenue: Math.floor(Math.random() * 5000) + 2000,
        orders: Math.floor(Math.random() * 50) + 20
      }))
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch author analytics",
      error: error.message
    });
  }
});

export default router;
