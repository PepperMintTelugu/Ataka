import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Mock data for publishers
let publishers = [
  {
    id: "vishwakarma-publications",
    name: "Vishwakarma Publications",
    nameTelugu: "విశ్వకర్మ పబ్లికేషన్స్",
    logo: "https://images.unsplash.com/photo-1568667256549-094345857637?w=200&h=120&fit=crop",
    description: "Leading publisher of Telugu literature and educational books",
    descriptionTelugu: "తెలుగు సాహిత్యం మరియు విద్యా పుస్తకాలకు ప్రముఖ ప్రచురణకర్త",
    website: "https://vishwakarma.com",
    booksCount: 1250,
    totalSales: 2500000,
    monthlyRevenue: 185000,
    commissionRate: 15, // Percentage for billing
    isActive: true,
    order: 1,
    established: 1952,
    location: "Hyderabad",
    specialization: "Literature & Poetry",
    contactEmail: "contact@vishwakarma.com",
    contactPhone: "+91-40-12345678",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date()
  },
  {
    id: "andhra-saraswata-parishad",
    name: "Andhra Saraswata Parishad",
    nameTelugu: "ఆంధ్ర సరస్వత పరిషత్",
    logo: "https://images.unsplash.com/photo-1599582909646-1b6e6ebcdb41?w=200&h=120&fit=crop",
    description: "Promoting Telugu literature and culture",
    descriptionTelugu: "తెలుగు సాహిత్యం మరియు సంస్కృతిని ప్రోత్సహించడం",
    website: "https://apsahityaakademi.gov.in",
    booksCount: 1100,
    totalSales: 1800000,
    monthlyRevenue: 125000,
    commissionRate: 12,
    isActive: true,
    order: 2,
    established: 1938,
    location: "Vijayawada",
    specialization: "Educational & Cultural",
    contactEmail: "info@apsahitya.gov.in",
    contactPhone: "+91-866-2555555",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date()
  }
];

// Get all publishers
router.get("/", (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", sort = "name" } = req.query;
    
    let filteredPublishers = publishers;
    
    // Search functionality
    if (search) {
      filteredPublishers = publishers.filter(publisher =>
        publisher.name.toLowerCase().includes(search.toLowerCase()) ||
        (publisher.nameTelugu && publisher.nameTelugu.includes(search))
      );
    }
    
    // Sort functionality
    filteredPublishers.sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "booksCount":
          return b.booksCount - a.booksCount;
        case "totalSales":
          return b.totalSales - a.totalSales;
        case "monthlyRevenue":
          return b.monthlyRevenue - a.monthlyRevenue;
        case "established":
          return a.established - b.established;
        default:
          return a.order - b.order;
      }
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedPublishers = filteredPublishers.slice(startIndex, startIndex + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedPublishers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredPublishers.length / limit),
        totalItems: filteredPublishers.length,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch publishers",
      error: error.message
    });
  }
});

// Get publisher by ID
router.get("/:id", (req, res) => {
  try {
    const publisher = publishers.find(p => p.id === req.params.id);
    
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found"
      });
    }
    
    res.json({
      success: true,
      data: publisher
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch publisher",
      error: error.message
    });
  }
});

// Create new publisher
router.post("/", [
  body("name").notEmpty().withMessage("Name is required"),
  body("booksCount").isInt({ min: 0 }).withMessage("Books count must be a positive integer"),
  body("commissionRate").isFloat({ min: 0, max: 100 }).withMessage("Commission rate must be between 0-100"),
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
    
    const newPublisher = {
      id: req.body.name.toLowerCase().replace(/\s+/g, "-"),
      ...req.body,
      totalSales: 0,
      monthlyRevenue: 0,
      order: publishers.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    publishers.push(newPublisher);
    
    res.status(201).json({
      success: true,
      data: newPublisher,
      message: "Publisher created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create publisher",
      error: error.message
    });
  }
});

// Update publisher
router.put("/:id", [
  body("name").optional().notEmpty(),
  body("booksCount").optional().isInt({ min: 0 }),
  body("commissionRate").optional().isFloat({ min: 0, max: 100 }),
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
    
    const publisherIndex = publishers.findIndex(p => p.id === req.params.id);
    
    if (publisherIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found"
      });
    }
    
    publishers[publisherIndex] = {
      ...publishers[publisherIndex],
      ...req.body,
      updatedAt: new Date()
    };
    
    res.json({
      success: true,
      data: publishers[publisherIndex],
      message: "Publisher updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update publisher",
      error: error.message
    });
  }
});

// Delete publisher
router.delete("/:id", (req, res) => {
  try {
    const publisherIndex = publishers.findIndex(p => p.id === req.params.id);
    
    if (publisherIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found"
      });
    }
    
    const deletedPublisher = publishers.splice(publisherIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedPublisher,
      message: "Publisher deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete publisher",
      error: error.message
    });
  }
});

// Get publisher analytics and billing data
router.get("/:id/analytics", (req, res) => {
  try {
    const publisher = publishers.find(p => p.id === req.params.id);
    
    if (!publisher) {
      return res.status(404).json({
        success: false,
        message: "Publisher not found"
      });
    }
    
    // Calculate billing information
    const commissionEarned = Math.round(publisher.totalSales * (publisher.commissionRate / 100));
    const publisherEarnings = publisher.totalSales - commissionEarned;
    
    const analytics = {
      // Financial Data
      totalSales: publisher.totalSales,
      monthlyRevenue: publisher.monthlyRevenue,
      commissionRate: publisher.commissionRate,
      commissionEarned: commissionEarned,
      publisherEarnings: publisherEarnings,
      avgOrderValue: Math.round(publisher.totalSales / (publisher.booksCount * 8)),
      
      // Performance Metrics
      booksCount: publisher.booksCount,
      topSellingBooks: [
        { title: "Telugu Literature Classics", sales: 15000, revenue: 450000 },
        { title: "Modern Poetry Collection", sales: 12000, revenue: 360000 },
        { title: "Educational Series Vol 1", sales: 10000, revenue: 300000 }
      ],
      
      // Monthly breakdown for billing
      monthlyData: Array.from({ length: 12 }, (_, i) => {
        const monthRevenue = Math.floor(Math.random() * 50000) + 100000;
        const commission = Math.round(monthRevenue * (publisher.commissionRate / 100));
        return {
          month: new Date(2024, i, 1).toLocaleString('default', { month: 'short' }),
          revenue: monthRevenue,
          orders: Math.floor(Math.random() * 100) + 50,
          commission: commission,
          publisherEarnings: monthRevenue - commission,
          booksSupplied: Math.floor(Math.random() * 200) + 100
        };
      }),
      
      // Billing Summary
      billingSummary: {
        totalRevenue: publisher.totalSales,
        platformCommission: commissionEarned,
        publisherPayout: publisherEarnings,
        pendingPayments: Math.floor(Math.random() * 50000) + 10000,
        lastPaymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        nextPaymentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch publisher analytics",
      error: error.message
    });
  }
});

// Get billing report for all publishers
router.get("/billing/report", (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const billingReport = publishers.map(publisher => {
      const commissionEarned = Math.round(publisher.totalSales * (publisher.commissionRate / 100));
      return {
        publisherId: publisher.id,
        name: publisher.name,
        totalSales: publisher.totalSales,
        commissionRate: publisher.commissionRate,
        commissionEarned: commissionEarned,
        publisherEarnings: publisher.totalSales - commissionEarned,
        booksCount: publisher.booksCount,
        monthlyRevenue: publisher.monthlyRevenue
      };
    });
    
    const totalSales = billingReport.reduce((sum, p) => sum + p.totalSales, 0);
    const totalCommission = billingReport.reduce((sum, p) => sum + p.commissionEarned, 0);
    
    res.json({
      success: true,
      data: {
        publishers: billingReport,
        summary: {
          totalPublishers: publishers.length,
          totalSales: totalSales,
          totalCommission: totalCommission,
          avgCommissionRate: Math.round(billingReport.reduce((sum, p) => sum + p.commissionRate, 0) / billingReport.length)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to generate billing report",
      error: error.message
    });
  }
});

export default router;
