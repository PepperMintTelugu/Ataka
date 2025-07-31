import { Client, Databases, ID, Query } from 'node-appwrite';
import axios from 'axios';

// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
  .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = 'ataka_db';
const COLLECTIONS = {
  BOOKS: 'books'
};

// Store for tracking import progress
const importProgress = new Map();

export default async ({ req, res, log, error }) => {
  try {
    const { method, path } = req;
    const body = JSON.parse(req.body || '{}');

    switch (path) {
      case '/test-connection':
        return await testWooCommerceConnection(req, res, log, error, body);
      case '/fetch-products':
        return await fetchWooCommerceProducts(req, res, log, error, body);
      case '/import-products':
        return await startProductImport(req, res, log, error, body);
      case '/import-progress':
        return await getImportProgress(req, res, log, error, body);
      default:
        return res.json({
          success: false,
          message: 'Endpoint not found'
        }, 404);
    }
  } catch (err) {
    error('Function error:', err);
    return res.json({
      success: false,
      message: 'Internal server error',
      error: err.message
    }, 500);
  }
};

async function testWooCommerceConnection(req, res, log, error, body) {
  try {
    const { siteUrl, consumerKey, consumerSecret } = body;

    if (!siteUrl || !consumerKey || !consumerSecret) {
      return res.json({
        success: false,
        message: 'Site URL, Consumer Key, and Consumer Secret are required'
      }, 400);
    }

    // Test connection
    const response = await axios.get(`${siteUrl}/wp-json/wc/v3/products`, {
      params: {
        per_page: 1,
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
      },
      timeout: 10000,
    });

    const totalProducts = response.headers['x-wp-total'] || 0;

    log('WooCommerce connection successful');

    return res.json({
      success: true,
      message: 'Connection successful',
      data: {
        totalProducts: parseInt(totalProducts),
        storeInfo: {
          url: siteUrl,
          status: 'connected',
        },
      },
    });

  } catch (err) {
    error('WooCommerce connection test failed:', err);

    let errorMessage = 'Connection failed';
    if (err.response?.status === 401) {
      errorMessage = 'Invalid API credentials';
    } else if (err.response?.status === 404) {
      errorMessage = 'WooCommerce REST API not found. Please check the URL.';
    } else if (err.code === 'ENOTFOUND') {
      errorMessage = 'Site not found. Please check the URL.';
    } else if (err.code === 'ETIMEDOUT') {
      errorMessage = 'Connection timeout. Please try again.';
    }

    return res.json({
      success: false,
      message: errorMessage
    }, 400);
  }
}

async function fetchWooCommerceProducts(req, res, log, error, body) {
  try {
    const { siteUrl, consumerKey, consumerSecret } = body;

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

      const totalPages = parseInt(response.headers['x-wp-totalpages'] || 1);
      hasMore = page < totalPages;
      page++;

      if (page > 50) break; // Safety limit
    }

    // Transform products for preview
    const transformedProducts = allProducts.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price || product.regular_price || '0',
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

    log(`Fetched ${transformedProducts.length} products from WooCommerce`);

    return res.json({
      success: true,
      message: `Fetched ${transformedProducts.length} products`,
      data: {
        products: transformedProducts,
        total: transformedProducts.length,
      },
    });

  } catch (err) {
    error('Fetch products failed:', err);
    return res.json({
      success: false,
      message: 'Failed to fetch products from WooCommerce',
      error: err.message
    }, 500);
  }
}

async function startProductImport(req, res, log, error, body) {
  try {
    const { config, products, userId } = body;
    const importId = `import_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Initialize import progress
    importProgress.set(importId, {
      total: products.length,
      processed: 0,
      success: 0,
      errors: 0,
      products: products.map((p) => ({ ...p, status: 'pending' })),
      startTime: new Date(),
    });

    // Start import process asynchronously
    importProductsAsync(importId, config, products, userId, log, error);

    return res.json({
      success: true,
      message: 'Import started',
      data: {
        importId,
        total: products.length,
      },
    });

  } catch (err) {
    error('Import start failed:', err);
    return res.json({
      success: false,
      message: 'Failed to start import process',
      error: err.message
    }, 500);
  }
}

async function getImportProgress(req, res, log, error, body) {
  try {
    const { importId } = body;
    const progress = importProgress.get(importId);

    if (!progress) {
      return res.json({
        success: false,
        message: 'Import session not found'
      }, 404);
    }

    const progressPercentage = Math.round(
      (progress.processed / progress.total) * 100,
    );

    return res.json({
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

  } catch (err) {
    error('Get progress failed:', err);
    return res.json({
      success: false,
      message: 'Failed to get import progress',
      error: err.message
    }, 500);
  }
}

async function importProductsAsync(importId, config, products, userId, log, error) {
  const progress = importProgress.get(importId);
  if (!progress) return;

  for (let i = 0; i < products.length; i++) {
    const productInfo = products[i];

    try {
      progress.products[i].status = 'importing';

      // Fetch full product details
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
      const bookData = transformWooCommerceToBook(wooProduct, userId);

      // Check if book already exists
      try {
        const existingResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTIONS.BOOKS,
          [
            Query.or([
              Query.equal('woocommerceId', wooProduct.id),
              Query.equal('isbn', bookData.isbn),
              Query.and([
                Query.equal('title', bookData.title),
                Query.equal('author', bookData.author)
              ])
            ])
          ]
        );

        if (existingResponse.documents.length > 0) {
          // Update existing book
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.BOOKS,
            existingResponse.documents[0].$id,
            bookData
          );
        } else {
          // Create new book
          await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.BOOKS,
            ID.unique(),
            bookData
          );
        }
      } catch (dbError) {
        // If query fails, try creating new
        await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.BOOKS,
          ID.unique(),
          bookData
        );
      }

      progress.products[i].status = 'success';
      progress.success++;

    } catch (err) {
      error(`Failed to import product ${productInfo.id}:`, err);
      progress.products[i].status = 'error';
      progress.products[i].error = err.message;
      progress.errors++;
    }

    progress.processed++;
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Clean up after 1 hour
  setTimeout(() => {
    importProgress.delete(importId);
  }, 3600000);
}

function transformWooCommerceToBook(wooProduct, userId) {
  // Extract metadata
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

  // Helper functions
  const extractTelugu = (text) => {
    if (!text) return '';
    const teluguRegex = /[\u0C00-\u0C7F]+/g;
    const matches = text.match(teluguRegex);
    return matches ? matches.join(' ') : '';
  };

  const cleanHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const primaryCategory = wooProduct.categories?.[0]?.name || 'literature';

  // Map WooCommerce category to our categories
  const categoryMap = {
    'fiction': 'literature',
    'non-fiction': 'literature', 
    'poetry': 'poetry',
    'devotional': 'devotional',
    'education': 'educational',
    'children': 'children',
    'history': 'history',
    'philosophy': 'philosophy',
    'biography': 'biography'
  };

  const mappedCategory = categoryMap[primaryCategory.toLowerCase()] || 'literature';

  return {
    title: wooProduct.name,
    titleTelugu: extractTelugu(wooProduct.name) || metaData['_title_telugu'] || '',
    author: metaData['_author'] || attributes['Author']?.[0] || 'Unknown Author',
    authorTelugu: metaData['_author_telugu'] || extractTelugu(metaData['_author'] || '') || '',
    publisher: metaData['_publisher'] || attributes['Publisher']?.[0] || 'Unknown Publisher',
    publisherTelugu: metaData['_publisher_telugu'] || extractTelugu(metaData['_publisher'] || '') || '',
    isbn: metaData['_isbn'] || metaData['isbn'] || `WOO-${wooProduct.id}`,
    price: parseFloat(wooProduct.price || wooProduct.regular_price || 0),
    originalPrice: parseFloat(wooProduct.regular_price || wooProduct.price || 0),
    discount: wooProduct.sale_price ? 
      Math.round(((parseFloat(wooProduct.regular_price) - parseFloat(wooProduct.sale_price)) / parseFloat(wooProduct.regular_price)) * 100) : 0,
    description: cleanHtml(wooProduct.description),
    descriptionTelugu: extractTelugu(cleanHtml(wooProduct.description)) || metaData['_description_telugu'] || '',
    image: wooProduct.images?.[0]?.src || '',
    images: JSON.stringify(wooProduct.images?.map(img => img.src) || []),
    category: mappedCategory,
    categoryTelugu: metaData['_category_telugu'] || '',
    pages: parseInt(metaData['_pages'] || attributes['Pages']?.[0] || 100),
    language: metaData['_language'] || attributes['Language']?.[0] || 'Telugu',
    dimensions: JSON.stringify({
      length: parseFloat(wooProduct.dimensions?.length || 0),
      width: parseFloat(wooProduct.dimensions?.width || 0),
      height: parseFloat(wooProduct.dimensions?.height || 0)
    }),
    weight: parseFloat(wooProduct.weight || 0),
    publicationYear: parseInt(metaData['_publication_year'] || metaData['year'] || new Date().getFullYear()),
    rating: 0,
    reviewCount: 0,
    reviews: JSON.stringify([]),
    inStock: wooProduct.stock_status === 'instock',
    stockCount: parseInt(wooProduct.stock_quantity || 0),
    tags: JSON.stringify(wooProduct.tags?.map(tag => tag.name) || []),
    featured: wooProduct.featured || false,
    bestseller: false,
    newArrival: false,
    salesCount: 0,
    isActive: wooProduct.status === 'publish',
    createdBy: userId,
    woocommerceId: wooProduct.id,
    importSource: 'woocommerce',
    importDate: new Date().toISOString()
  };
}
