import {
  AuthHelpers,
  DatabaseHelpers,
  StorageHelpers,
  functions,
  FUNCTIONS_IDS,
  BUCKETS,
  AppwriteError,
  createQuery as Query,
} from "./appwrite";

// Authentication API
export const authAPI = {
  async login(email: string, password: string) {
    try {
      return await AuthHelpers.loginWithEmail(email, password);
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError ? error.message : "Login failed",
      );
    }
  },

  async register(email: string, password: string, name: string) {
    try {
      return await AuthHelpers.registerWithEmail(email, password, name);
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError ? error.message : "Registration failed",
      );
    }
  },

  async logout() {
    try {
      return await AuthHelpers.logout();
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError ? error.message : "Logout failed",
      );
    }
  },

  async getCurrentUser() {
    try {
      return await AuthHelpers.getCurrentUser();
    } catch (error) {
      return null;
    }
  },

  async resetPassword(email: string) {
    try {
      return await AuthHelpers.resetPassword(email);
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError
          ? error.message
          : "Password reset failed",
      );
    }
  },
};

// Books API (using Appwrite Functions)
export const booksAPI = {
  async getBooks(
    filters: {
      category?: string;
      search?: string;
      featured?: boolean;
      bestseller?: boolean;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books",
          method: "GET",
          ...filters,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to fetch books",
      );
    }
  },

  async getBook(id: string) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books/:id",
          method: "GET",
          id,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to fetch book",
      );
    }
  },

  async createBook(bookData: any) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books",
          method: "POST",
          ...bookData,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to create book",
      );
    }
  },

  async updateBook(id: string, bookData: any) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books/:id",
          method: "PUT",
          id,
          ...bookData,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to update book",
      );
    }
  },

  async deleteBook(id: string) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books/:id",
          method: "DELETE",
          id,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to delete book",
      );
    }
  },

  async getFeaturedBooks(limit: number = 10) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books/featured",
          method: "GET",
          limit,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error
          ? error.message
          : "Failed to fetch featured books",
      );
    }
  },

  async getBestsellers(limit: number = 10) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books/bestsellers",
          method: "GET",
          limit,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to fetch bestsellers",
      );
    }
  },

  async getBooksByCategory(
    category: string,
    limit: number = 20,
    offset: number = 0,
  ) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books/category/:category",
          method: "GET",
          category,
          limit,
          offset,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error
          ? error.message
          : "Failed to fetch books by category",
      );
    }
  },

  async searchBooks(search: string, limit: number = 20) {
    try {
      const execution = await functions.createExecution(
        "books-api",
        JSON.stringify({
          path: "/books/search",
          method: "GET",
          search,
          limit,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to search books",
      );
    }
  },

  async uploadBookImage(file: File) {
    try {
      const uploadedFile = await StorageHelpers.uploadFile(
        BUCKETS.BOOK_IMAGES,
        file,
      );
      return StorageHelpers.getFileView(BUCKETS.BOOK_IMAGES, uploadedFile.$id);
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError
          ? error.message
          : "Failed to upload image",
      );
    }
  },
};

// Orders API (using Appwrite Functions)
export const ordersAPI = {
  async getUserOrders(
    userId: string,
    filters: { status?: string; limit?: number; offset?: number } = {},
  ) {
    try {
      const execution = await functions.createExecution(
        "orders-api",
        JSON.stringify({
          path: "/orders",
          method: "GET",
          userId,
          ...filters,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to fetch orders",
      );
    }
  },

  async getOrder(orderId: string, userId: string) {
    try {
      const execution = await functions.createExecution(
        "orders-api",
        JSON.stringify({
          path: "/orders/:id",
          method: "GET",
          id: orderId,
          userId,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to fetch order",
      );
    }
  },

  async createOrder(userId: string, orderData: any) {
    try {
      const execution = await functions.createExecution(
        "orders-api",
        JSON.stringify({
          path: "/orders",
          method: "POST",
          userId,
          ...orderData,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to create order",
      );
    }
  },

  async updateOrder(orderId: string, userId: string, orderData: any) {
    try {
      const execution = await functions.createExecution(
        "orders-api",
        JSON.stringify({
          path: "/orders/:id",
          method: "PUT",
          id: orderId,
          userId,
          ...orderData,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to update order",
      );
    }
  },

  async updateOrderStatus(
    orderId: string,
    status: string,
    adminNotes?: string,
  ) {
    try {
      const execution = await functions.createExecution(
        "orders-api",
        JSON.stringify({
          path: "/orders/:id/status",
          method: "PUT",
          id: orderId,
          status,
          adminNotes,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error
          ? error.message
          : "Failed to update order status",
      );
    }
  },

  async trackOrder(orderId: string) {
    try {
      const execution = await functions.createExecution(
        "orders-api",
        JSON.stringify({
          path: "/orders/:id/track",
          method: "GET",
          id: orderId,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to track order",
      );
    }
  },

  async getAllOrders(
    filters: { status?: string; limit?: number; offset?: number } = {},
  ) {
    try {
      const execution = await functions.createExecution(
        "orders-api",
        JSON.stringify({
          path: "/orders/admin",
          method: "GET",
          ...filters,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to fetch all orders",
      );
    }
  },
};

// Payment API (using Appwrite Functions)
export const paymentAPI = {
  async createRazorpayOrder(orderData: {
    amount: number;
    currency: string;
    items: any[];
    shippingAddress: any;
    userId: string;
  }) {
    try {
      const execution = await functions.createExecution(
        FUNCTIONS_IDS.PAYMENT_RAZORPAY,
        JSON.stringify({
          path: "/create-order",
          ...orderData,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error
          ? error.message
          : "Failed to create payment order",
      );
    }
  },

  async verifyPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    orderId: string;
  }) {
    try {
      const execution = await functions.createExecution(
        FUNCTIONS_IDS.PAYMENT_RAZORPAY,
        JSON.stringify({
          path: "/verify-payment",
          ...paymentData,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Payment verification failed",
      );
    }
  },

  async getPaymentConfig() {
    try {
      const execution = await functions.createExecution(
        FUNCTIONS_IDS.PAYMENT_RAZORPAY,
        JSON.stringify({ path: "/get-config" }),
      );

      const response = JSON.parse(execution.responseBody);
      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to get payment config",
      );
    }
  },
};

// Import API (using Appwrite Functions)
export const importAPI = {
  async testWooCommerceConnection(config: {
    siteUrl: string;
    consumerKey: string;
    consumerSecret: string;
  }) {
    try {
      const execution = await functions.createExecution(
        FUNCTIONS_IDS.IMPORT_WOOCOMMERCE,
        JSON.stringify({
          path: "/test-connection",
          ...config,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Connection test failed",
      );
    }
  },

  async fetchWooCommerceProducts(config: {
    siteUrl: string;
    consumerKey: string;
    consumerSecret: string;
  }) {
    try {
      const execution = await functions.createExecution(
        FUNCTIONS_IDS.IMPORT_WOOCOMMERCE,
        JSON.stringify({
          path: "/fetch-products",
          ...config,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Failed to fetch products",
      );
    }
  },

  async importProducts(config: any, products: any[], userId: string) {
    try {
      const execution = await functions.createExecution(
        FUNCTIONS_IDS.IMPORT_WOOCOMMERCE,
        JSON.stringify({
          path: "/import-products",
          config,
          products,
          userId,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error ? error.message : "Import failed",
      );
    }
  },

  async getImportProgress(importId: string) {
    try {
      const execution = await functions.createExecution(
        FUNCTIONS_IDS.IMPORT_WOOCOMMERCE,
        JSON.stringify({
          path: "/import-progress",
          importId,
        }),
      );

      const response = JSON.parse(execution.responseBody);
      if (!response.success) {
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      throw new AppwriteError(
        error instanceof Error
          ? error.message
          : "Failed to get import progress",
      );
    }
  },
};

// Settings API
export const settingsAPI = {
  async getSettings() {
    try {
      return await DatabaseHelpers.getSettings();
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError
          ? error.message
          : "Failed to fetch settings",
      );
    }
  },

  async getSetting(key: string) {
    try {
      return await DatabaseHelpers.getSetting(key);
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError
          ? error.message
          : "Failed to fetch setting",
      );
    }
  },

  async updateSetting(key: string, value: string, type: string = "string") {
    try {
      return await DatabaseHelpers.updateSetting(key, value, type);
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError
          ? error.message
          : "Failed to update setting",
      );
    }
  },
};

// Homepage API
export const homepageAPI = {
  async getHomepageContent() {
    try {
      return await DatabaseHelpers.getHomepageContent();
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError
          ? error.message
          : "Failed to fetch homepage content",
      );
    }
  },

  async updateHomepageSection(
    section: string,
    content: string,
    title?: string,
  ) {
    try {
      return await DatabaseHelpers.updateHomepageSection(
        section,
        content,
        title,
      );
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError
          ? error.message
          : "Failed to update homepage section",
      );
    }
  },
};

// File upload API
export const uploadAPI = {
  async uploadFile(file: File, bucketId: string = BUCKETS.BOOK_IMAGES) {
    try {
      const uploadedFile = await StorageHelpers.uploadFile(bucketId, file);
      return {
        fileId: uploadedFile.$id,
        url: StorageHelpers.getFileView(bucketId, uploadedFile.$id).href,
      };
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError ? error.message : "File upload failed",
      );
    }
  },

  async deleteFile(fileId: string, bucketId: string = BUCKETS.BOOK_IMAGES) {
    try {
      return await StorageHelpers.deleteFile(bucketId, fileId);
    } catch (error) {
      throw new AppwriteError(
        error instanceof AppwriteError ? error.message : "File deletion failed",
      );
    }
  },

  getFileUrl(fileId: string, bucketId: string = BUCKETS.BOOK_IMAGES) {
    return StorageHelpers.getFileView(bucketId, fileId).href;
  },

  getImagePreview(
    fileId: string,
    width?: number,
    height?: number,
    bucketId: string = BUCKETS.BOOK_IMAGES,
  ) {
    return StorageHelpers.getFilePreview(bucketId, fileId, width, height).href;
  },
};

// Export all APIs
export const api = {
  auth: authAPI,
  books: booksAPI,
  orders: ordersAPI,
  payment: paymentAPI,
  import: importAPI,
  settings: settingsAPI,
  homepage: homepageAPI,
  upload: uploadAPI,
};

export default api;

// Backward compatibility - export individual APIs for gradual migration
export {
  authAPI as auth,
  booksAPI as books,
  ordersAPI as orders,
  paymentAPI as payment,
  importAPI as importService,
  settingsAPI as settings,
  homepageAPI as homepage,
  uploadAPI as upload,
};
