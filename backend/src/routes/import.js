import express from "express";
import axios from "axios";
import Book from "../models/Book.js";
import { protect, admin } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// Store for tracking import progress
const importProgress = new Map();

// @desc    Test WooCommerce connection
// @route   POST /api/import/test-woocommerce
// @access  Admin
router.post("/test-woocommerce", protect, admin, async (req, res) => {
  try {
    const { siteUrl, consumerKey, consumerSecret } = req.body;

    if (!siteUrl || !consumerKey || !consumerSecret) {
      return res.status(400).json({
        success: false,
        message: "Site URL, Consumer Key, and Consumer Secret are required",
      });
    }

    // Test connection by fetching a single product
    const response = await axios.get(`${siteUrl}/wp-json/wc/v3/products`, {
      params: {
        per_page: 1,
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      },
      timeout: 10000,
    });

    // Get total count from headers
    const totalProducts = response.headers["x-wp-total"] || 0;

    res.json({
      success: true,
      message: "Connection successful",
      data: {
        totalProducts: parseInt(totalProducts),
        storeInfo: {
          url: siteUrl,
          status: "connected",
        },
      },
    });
  } catch (error) {
    console.error("WooCommerce connection test failed:", error);

    let errorMessage = "Connection failed";
    if (error.response?.status === 401) {
      errorMessage = "Invalid API credentials";
    } else if (error.response?.status === 404) {
      errorMessage = "WooCommerce REST API not found. Please check the URL.";
    } else if (error.code === "ENOTFOUND") {
      errorMessage = "Site not found. Please check the URL.";
    } else if (error.code === "ETIMEDOUT") {
      errorMessage = "Connection timeout. Please try again.";
    }

    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
});

// @desc    Fetch products from WooCommerce
// @route   POST /api/import/fetch-products
// @access  Admin
router.post("/fetch-products", protect, admin, async (req, res) => {
  try {
    const { siteUrl, consumerKey, consumerSecret } = req.body;

    // Fetch all products (paginated)
    let allProducts = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(`${siteUrl}/wp-json/wc/v3/products`, {
        params: {
          per_page: perPage,
          page: page,
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
        },
        timeout: 15000,
      });

      const products = response.data;
      allProducts = allProducts.concat(products);

      // Check if there are more pages
      const totalPages = parseInt(response.headers["x-wp-totalpages"] || 1);
      hasMore = page < totalPages;
      page++;

      // Safety limit
      if (page > 50) break;
    }

    // Transform products to our format preview
    const transformedProducts = allProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price || product.regular_price || "0",
      shortDescription: product.short_description,
      description: product.description,
      images: product.images || [],
      categories: product.categories || [],
      attributes: product.attributes || [],
      tags: product.tags || [],
      stock_status: product.stock_status,
      manage_stock: product.manage_stock,
      stock_quantity: product.stock_quantity,
      meta_data: product.meta_data || [],
    }));

    res.json({
      success: true,
      message: `Fetched ${transformedProducts.length} products`,
      data: {
        products: transformedProducts,
        total: transformedProducts.length,
      },
    });
  } catch (error) {
    console.error("Fetch products failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products from WooCommerce",
    });
  }
});

// @desc    Start product import
// @route   POST /api/import/import-products
// @access  Admin
router.post("/import-products", protect, admin, async (req, res) => {
  try {
    const { config, products } = req.body;
    const importId = `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize import progress
    importProgress.set(importId, {
      total: products.length,
      processed: 0,
      success: 0,
      errors: 0,
      products: products.map((p) => ({ ...p, status: "pending" })),
      startTime: new Date(),
    });

    // Start import process asynchronously
    importProductsAsync(importId, config, products);

    res.json({
      success: true,
      message: "Import started",
      data: {
        importId,
        total: products.length,
      },
    });
  } catch (error) {
    console.error("Import start failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start import process",
    });
  }
});

// @desc    Get import progress
// @route   GET /api/import/progress/:importId
// @access  Admin
router.get("/progress/:importId", protect, admin, (req, res) => {
  try {
    const { importId } = req.params;
    const progress = importProgress.get(importId);

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Import session not found",
      });
    }

    const progressPercentage = Math.round(
      (progress.processed / progress.total) * 100,
    );

    res.json({
      success: true,
      data: {
        progress: progressPercentage,
        products: progress.products,
        stats: {
          total: progress.total,
          success: progress.success,
          errors: progress.errors,
          pending: progress.total - progress.processed,
        },
      },
    });
  } catch (error) {
    console.error("Get progress failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get import progress",
    });
  }
});

// Async function to import products
async function importProductsAsync(importId, config, products) {
  const progress = importProgress.get(importId);
  if (!progress) return;

  for (let i = 0; i < products.length; i++) {
    const productInfo = products[i];

    try {
      // Update status to importing
      progress.products[i].status = "importing";

      // Fetch full product details from WooCommerce
      const response = await axios.get(
        `${config.siteUrl}/wp-json/wc/v3/products/${productInfo.id}`,
        {
          params: {
            consumer_key: config.consumerKey,
            consumer_secret: config.consumerSecret,
          },
          timeout: 10000,
        },
      );

      const wooProduct = response.data;

      // Transform WooCommerce product to our Book schema
      const bookData = await transformWooCommerceToBook(wooProduct);

      // Check if book already exists
      const existingBook = await Book.findOne({
        $or: [
          { woocommerceId: wooProduct.id },
          { isbn: bookData.isbn },
          { title: bookData.title, author: bookData.author },
        ],
      });

      if (existingBook) {
        // Update existing book
        Object.assign(existingBook, bookData);
        await existingBook.save();
      } else {
        // Create new book
        await Book.create(bookData);
      }

      // Update progress
      progress.products[i].status = "success";
      progress.success++;
    } catch (error) {
      console.error(`Failed to import product ${productInfo.id}:`, error);

      // Update progress with error
      progress.products[i].status = "error";
      progress.products[i].error = error.message;
      progress.errors++;
    }

    progress.processed++;

    // Small delay to prevent overwhelming the servers
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Clean up progress after 1 hour
  setTimeout(() => {
    importProgress.delete(importId);
  }, 3600000);
}

// Transform WooCommerce product to Book schema
async function transformWooCommerceToBook(wooProduct) {
  // Extract custom fields from meta_data
  const metaData = {};
  if (wooProduct.meta_data) {
    wooProduct.meta_data.forEach((meta) => {
      metaData[meta.key] = meta.value;
    });
  }

  // Extract attributes
  const attributes = {};
  if (wooProduct.attributes) {
    wooProduct.attributes.forEach((attr) => {
      attributes[attr.name] = attr.options;
    });
  }

  // Helper function to extract Telugu text
  const extractTelugu = (text) => {
    if (!text) return "";
    // Simple regex to find Telugu text (basic approach)
    const teluguRegex = /[\u0C00-\u0C7F]+/g;
    const matches = text.match(teluguRegex);
    return matches ? matches.join(" ") : "";
  };

  // Helper function to clean HTML and extract text
  const cleanHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  // Determine book category from WooCommerce categories
  const primaryCategory = wooProduct.categories?.[0]?.name || "Fiction";

  return {
    // Basic information
    woocommerceId: wooProduct.id,
    title: wooProduct.name,
    titleTelugu:
      extractTelugu(wooProduct.name) || metaData["_title_telugu"] || "",

    // Try to extract author from various sources
    author:
      metaData["_author"] ||
      attributes["Author"]?.[0] ||
      attributes["వ్రాసిన వారు"]?.[0] ||
      "Unknown Author",
    authorTelugu:
      metaData["_author_telugu"] ||
      extractTelugu(metaData["_author"] || "") ||
      attributes["వ్రాసిన వారు"]?.[0] ||
      "",

    // Publisher information
    publisher:
      metaData["_publisher"] ||
      attributes["Publisher"]?.[0] ||
      attributes["ప్రచురణకర్త"]?.[0] ||
      "Unknown Publisher",
    publisherTelugu:
      metaData["_publisher_telugu"] ||
      extractTelugu(metaData["_publisher"] || "") ||
      attributes["ప్రచురణకర్త"]?.[0] ||
      "",

    // Pricing
    price: parseFloat(wooProduct.price || wooProduct.regular_price || 0),
    originalPrice: parseFloat(
      wooProduct.regular_price || wooProduct.price || 0,
    ),
    salePrice: wooProduct.sale_price ? parseFloat(wooProduct.sale_price) : null,

    // Descriptions
    description: cleanHtml(wooProduct.description),
    descriptionTelugu:
      extractTelugu(cleanHtml(wooProduct.description)) ||
      metaData["_description_telugu"] ||
      "",
    shortDescription: cleanHtml(wooProduct.short_description),

    // Category and classification
    category: primaryCategory,
    subcategory: wooProduct.categories?.[1]?.name || "",

    // Book details
    isbn: metaData["_isbn"] || metaData["isbn"] || `WOO-${wooProduct.id}`,
    pages: parseInt(
      metaData["_pages"] || attributes["Pages"]?.[0] || metaData["pages"] || 0,
    ),
    language: metaData["_language"] || attributes["Language"]?.[0] || "Telugu",
    publicationYear: parseInt(
      metaData["_publication_year"] ||
        metaData["year"] ||
        new Date().getFullYear(),
    ),
    edition:
      metaData["_edition"] || attributes["Edition"]?.[0] || "First Edition",

    // Physical dimensions
    weight: parseFloat(wooProduct.weight || metaData["_weight"] || 0),
    dimensions: {
      length: parseFloat(
        wooProduct.dimensions?.length || metaData["_length"] || 0,
      ),
      width: parseFloat(
        wooProduct.dimensions?.width || metaData["_width"] || 0,
      ),
      height: parseFloat(
        wooProduct.dimensions?.height || metaData["_height"] || 0,
      ),
    },

    // Images
    image: wooProduct.images?.[0]?.src || "/placeholder.svg",
    images: wooProduct.images?.map((img) => img.src) || [],

    // Inventory
    stockCount: parseInt(wooProduct.stock_quantity || 0),
    inStock: wooProduct.stock_status === "instock",
    manageStock: wooProduct.manage_stock || false,

    // SEO and metadata
    slug: wooProduct.slug,
    tags: wooProduct.tags?.map((tag) => tag.name) || [],

    // Additional fields
    featured: wooProduct.featured || false,
    status: wooProduct.status === "publish" ? "active" : "draft",

    // Reviews (we'll start with empty reviews and let users add them)
    rating: 0,
    reviewCount: 0,
    reviews: [],

    // Timestamps
    createdAt: new Date(wooProduct.date_created || Date.now()),
    updatedAt: new Date(wooProduct.date_modified || Date.now()),

    // Import metadata
    importSource: "woocommerce",
    importDate: new Date(),
    woocommerceData: {
      originalId: wooProduct.id,
      permalink: wooProduct.permalink,
      type: wooProduct.type,
      status: wooProduct.status,
    },
  };
}

export default router;
