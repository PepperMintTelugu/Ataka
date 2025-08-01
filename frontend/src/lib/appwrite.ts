import {
  Client,
  Account,
  Databases,
  Storage,
  Functions,
  ID,
  Query,
} from "appwrite";
import { MockDataService } from "./mock-data";

// Configuration validation
const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || "ataka-bookstore";
const isDevelopment = import.meta.env.VITE_DEBUG === "true" || import.meta.env.NODE_ENV === "development";

// Appwrite configuration
const client = new Client();

if (isDevelopment) {
  console.log("🚀 Development Mode: Appwrite Config:", { endpoint, projectId });
  console.log("⚠️  Note: Using mock data fallback for development");
}

// Only configure client if not in offline development mode
if (!isDevelopment || endpoint !== "https://cloud.appwrite.io/v1") {
  client
    .setEndpoint(endpoint)
    .setProject(projectId);
} else {
  // In development mode with default endpoint, configure with dummy values to prevent errors
  client
    .setEndpoint("http://localhost:8080/v1") // This will fail gracefully
    .setProject("development-mode");
}

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and collection IDs
export const DATABASE_ID = "ataka_db";
export const COLLECTIONS = {
  USERS: "users",
  BOOKS: "books",
  ORDERS: "orders",
  SETTINGS: "settings",
  HOMEPAGE: "homepage",
} as const;

// Storage bucket IDs
export const BUCKETS = {
  BOOK_IMAGES: "book-images",
  USER_AVATARS: "user-avatars",
  DOCUMENTS: "documents",
} as const;

// Function IDs
export const FUNCTIONS_IDS = {
  AUTH_MIDDLEWARE: "auth-middleware",
  PAYMENT_RAZORPAY: "payment-razorpay",
  DELIVERY_SHIPROCKET: "delivery-shiprocket",
  IMPORT_WOOCOMMERCE: "import-woocommerce",
  ORDER_PROCESSOR: "order-processor",
} as const;

// Helper functions
export const createId = () => ID.unique();

// Query helpers
export const createQuery = Query;

// Export client for advanced usage
export { client };

// Type definitions for better TypeScript support
export interface AppwriteUser {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  name: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  addresses?: string;
  wishlist?: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface AppwriteBook {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  title: string;
  titleTelugu?: string;
  author: string;
  authorTelugu?: string;
  publisher: string;
  publisherTelugu?: string;
  isbn: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  descriptionTelugu?: string;
  image: string;
  images?: string;
  category: string;
  categoryTelugu?: string;
  pages: number;
  language: string;
  dimensions?: string;
  weight: number;
  publicationYear: number;
  rating: number;
  reviewCount: number;
  reviews?: string;
  inStock: boolean;
  stockCount: number;
  tags?: string;
  featured: boolean;
  bestseller: boolean;
  newArrival: boolean;
  salesCount: number;
  isActive: boolean;
  createdBy: string;
  woocommerceId?: number;
  importSource: string;
  importDate?: string;
}

export interface AppwriteOrder {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  orderNumber: string;
  userId: string;
  items: string;
  shippingAddress: string;
  billingAddress?: string;
  orderSummary: string;
  paymentDetails: string;
  orderStatus: string;
  shippingDetails?: string;
  timeline?: string;
  customerNotes?: string;
  adminNotes?: string;
  isGift: boolean;
  giftMessage?: string;
}

// Error handling helper
export class AppwriteError extends Error {
  constructor(
    message: string,
    public code?: number,
    public type?: string,
  ) {
    super(message);
    this.name = "AppwriteError";
  }
}

// Auth helper functions
export const AuthHelpers = {
  async getCurrentUser() {
    try {
      const session = await account.get();
      if (session) {
        // Get user details from our users collection
        const userDoc = await databases.getDocument(
          DATABASE_ID,
          COLLECTIONS.USERS,
          session.$id,
        );
        return { session, user: userDoc as AppwriteUser };
      }
      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  async loginWithEmail(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);

      // Update last login
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        session.userId,
        {
          lastLogin: new Date().toISOString(),
        },
      );

      return session;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async registerWithEmail(email: string, password: string, name: string) {
    try {
      const user = await account.create(createId(), email, password, name);

      // Create user document in our users collection
      await databases.createDocument(DATABASE_ID, COLLECTIONS.USERS, user.$id, {
        name,
        email,
        role: "user",
        isEmailVerified: false,
        isPhoneVerified: false,
        isActive: true,
        lastLogin: new Date().toISOString(),
      });

      // Create session
      const session = await account.createEmailPasswordSession(email, password);
      return { user, session };
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async resetPassword(email: string) {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`,
      );
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async loginWithGoogle() {
    try {
      // Create OAuth2 session with Google
      account.createOAuth2Session(
        "google",
        `${window.location.origin}/auth/success`,
        `${window.location.origin}/auth/failure`,
      );
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async handleOAuthCallback() {
    try {
      const session = await account.get();
      if (session) {
        // Check if user document exists
        try {
          const userDoc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            session.$id,
          );

          // Update last login
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            session.$id,
            {
              lastLogin: new Date().toISOString(),
            },
          );

          return { session, user: userDoc as AppwriteUser };
        } catch (error) {
          // User document doesn't exist, create it
          const userDoc = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            session.$id,
            {
              name: session.name,
              email: session.email,
              role: "user",
              isEmailVerified: session.emailVerification,
              isPhoneVerified: false,
              isActive: true,
              lastLogin: new Date().toISOString(),
            },
          );

          return { session, user: userDoc as AppwriteUser };
        }
      }
      return null;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },
};

// Database helper functions
export const DatabaseHelpers = {
  // Books
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
    // Skip Appwrite in development mode and use mock data directly
    if (isDevelopment && endpoint === "https://cloud.appwrite.io/v1") {
      console.log("🔄 Development mode: Using mock data for getBooks");
      return await MockDataService.getBooks(filters);
    }

    try {
      const queries = [Query.orderDesc("$createdAt")];

      if (filters.category) {
        queries.push(Query.equal("category", filters.category));
      }

      if (filters.search) {
        queries.push(Query.search("title", filters.search));
      }

      if (filters.featured) {
        queries.push(Query.equal("isFeatured", true));
      }

      if (filters.bestseller) {
        queries.push(Query.equal("isBestseller", true));
      }

      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      }

      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        queries,
      );
      return response.documents as AppwriteBook[];
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      return await MockDataService.getBooks(filters);
    }
  },

  async getBook(id: string) {
    // Skip Appwrite in development mode
    if (isDevelopment && endpoint === "https://cloud.appwrite.io/v1") {
      console.log("🔄 Development mode: Using mock data for getBook");
      return await MockDataService.getBook(id);
    }

    try {
      const book = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        id,
      );
      return book as AppwriteBook;
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      return await MockDataService.getBook(id);
    }
  },

  async createBook(bookData: Partial<AppwriteBook>) {
    // Skip Appwrite in development mode
    if (isDevelopment && endpoint === "https://cloud.appwrite.io/v1") {
      console.log("🔄 Development mode: Using mock data for createBook");
      return await MockDataService.createBook(bookData);
    }

    try {
      const book = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        createId(),
        bookData,
      );
      return book as AppwriteBook;
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      return await MockDataService.createBook(bookData);
    }
  },

  async updateBook(id: string, bookData: Partial<AppwriteBook>) {
    try {
      const book = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        id,
        bookData,
      );
      return book as AppwriteBook;
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      return await MockDataService.updateBook(id, bookData);
    }
  },

  async deleteBook(id: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.BOOKS, id);
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      await MockDataService.deleteBook(id);
    }
  },

  // Orders
  async getUserOrders(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.equal("userId", userId), Query.orderDesc("$createdAt")],
      );
      return response.documents as AppwriteOrder[];
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async createOrder(orderData: Partial<AppwriteOrder>) {
    try {
      const order = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        createId(),
        orderData,
      );
      return order as AppwriteOrder;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async updateOrder(id: string, orderData: Partial<AppwriteOrder>) {
    try {
      const order = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        id,
        orderData,
      );
      return order as AppwriteOrder;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async getAllOrders(
    filters: { status?: string; limit?: number; offset?: number } = {},
  ) {
    // Skip Appwrite in development mode and use mock data directly
    if (isDevelopment && endpoint === "https://cloud.appwrite.io/v1") {
      console.log("🔄 Development mode: Using mock data for getAllOrders");
      return await MockDataService.getAllOrders(filters);
    }

    try {
      const queries = [Query.orderDesc("$createdAt")];

      if (filters.status) {
        queries.push(Query.equal("status", filters.status));
      }

      if (filters.limit) {
        queries.push(Query.limit(filters.limit));
      }

      if (filters.offset) {
        queries.push(Query.offset(filters.offset));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        queries,
      );
      return response.documents as AppwriteOrder[];
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      return await MockDataService.getAllOrders(filters);
    }
  },

  // Settings
  async getSettings() {
    // Skip Appwrite in development mode
    if (isDevelopment && endpoint === "https://cloud.appwrite.io/v1") {
      console.log("🔄 Development mode: Using mock data for getSettings");
      return await MockDataService.getSettings();
    }

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.SETTINGS,
      );
      return response.documents;
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      return await MockDataService.getSettings();
    }
  },

  async getSetting(key: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.SETTINGS,
        [Query.equal("key", key)],
      );
      return response.documents[0] || null;
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      return await MockDataService.getSetting(key);
    }
  },

  async updateSetting(key: string, value: string, type: string = "string") {
    try {
      const existing = await this.getSetting(key);

      if (existing) {
        return await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.SETTINGS,
          existing.$id,
          { value, type },
        );
      } else {
        return await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.SETTINGS,
          createId(),
          { key, value, type },
        );
      }
    } catch (error: any) {
      console.warn("Database connection failed, using mock data:", error.message);
      return await MockDataService.updateSetting(key, value, type);
    }
  },

  // Homepage
  async getHomepageContent() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.HOMEPAGE,
        [Query.equal("isActive", true), Query.orderAsc("order")],
      );
      return response.documents;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async updateHomepageSection(
    section: string,
    content: string,
    title?: string,
  ) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.HOMEPAGE,
        [Query.equal("section", section)],
      );

      const data = { section, content, title, isActive: true };

      if (response.documents.length > 0) {
        return await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.HOMEPAGE,
          response.documents[0].$id,
          data,
        );
      } else {
        return await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.HOMEPAGE,
          createId(),
          data,
        );
      }
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },
};

// Storage helper functions
export const StorageHelpers = {
  async uploadFile(bucketId: string, file: File, fileId?: string) {
    try {
      const id = fileId || createId();
      const uploadedFile = await storage.createFile(bucketId, id, file);
      return uploadedFile;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async deleteFile(bucketId: string, fileId: string) {
    try {
      await storage.deleteFile(bucketId, fileId);
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  getFilePreview(
    bucketId: string,
    fileId: string,
    width?: number,
    height?: number,
  ) {
    return storage.getFilePreview(bucketId, fileId, width, height);
  },

  getFileDownload(bucketId: string, fileId: string) {
    return storage.getFileDownload(bucketId, fileId);
  },

  getFileView(bucketId: string, fileId: string) {
    return storage.getFileView(bucketId, fileId);
  },
};

export default client;
