import { Client, Account, Databases, Storage, Functions, ID, Query } from 'appwrite';

// Appwrite configuration
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'ataka-bookstore');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and collection IDs
export const DATABASE_ID = 'ataka_db';
export const COLLECTIONS = {
  USERS: 'users',
  BOOKS: 'books',
  ORDERS: 'orders',
  SETTINGS: 'settings',
  HOMEPAGE: 'homepage',
} as const;

// Storage bucket IDs
export const BUCKETS = {
  BOOK_IMAGES: 'book-images',
  USER_AVATARS: 'user-avatars',
  DOCUMENTS: 'documents',
} as const;

// Function IDs
export const FUNCTIONS_IDS = {
  AUTH_MIDDLEWARE: 'auth-middleware',
  PAYMENT_RAZORPAY: 'payment-razorpay',
  DELIVERY_SHIPROCKET: 'delivery-shiprocket',
  IMPORT_WOOCOMMERCE: 'import-woocommerce',
  ORDER_PROCESSOR: 'order-processor',
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
  role: 'user' | 'admin';
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
    public type?: string
  ) {
    super(message);
    this.name = 'AppwriteError';
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
          session.$id
        );
        return { session, user: userDoc as AppwriteUser };
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
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
          lastLogin: new Date().toISOString()
        }
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
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.USERS,
        user.$id,
        {
          name,
          email,
          role: 'user',
          isEmailVerified: false,
          isPhoneVerified: false,
          isActive: true,
          lastLogin: new Date().toISOString()
        }
      );
      
      // Create session
      const session = await account.createEmailPasswordSession(email, password);
      return { user, session };
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async logout() {
    try {
      await account.deleteSession('current');
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async resetPassword(email: string) {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  }
};

// Database helper functions
export const DatabaseHelpers = {
  // Books
  async getBooks(queries: string[] = []) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        queries
      );
      return response.documents as AppwriteBook[];
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async getBook(id: string) {
    try {
      const book = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        id
      );
      return book as AppwriteBook;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async createBook(bookData: Partial<AppwriteBook>) {
    try {
      const book = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        createId(),
        bookData
      );
      return book as AppwriteBook;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async updateBook(id: string, bookData: Partial<AppwriteBook>) {
    try {
      const book = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BOOKS,
        id,
        bookData
      );
      return book as AppwriteBook;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async deleteBook(id: string) {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTIONS.BOOKS, id);
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  // Orders
  async getUserOrders(userId: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ORDERS,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
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
        orderData
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
        orderData
      );
      return order as AppwriteOrder;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  // Settings
  async getSettings() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.SETTINGS
      );
      return response.documents;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async getSetting(key: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.SETTINGS,
        [Query.equal('key', key)]
      );
      return response.documents[0] || null;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async updateSetting(key: string, value: string, type: string = 'string') {
    try {
      const existing = await this.getSetting(key);
      
      if (existing) {
        return await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.SETTINGS,
          existing.$id,
          { value, type }
        );
      } else {
        return await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.SETTINGS,
          createId(),
          { key, value, type }
        );
      }
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  // Homepage
  async getHomepageContent() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.HOMEPAGE,
        [Query.equal('isActive', true), Query.orderAsc('order')]
      );
      return response.documents;
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  },

  async updateHomepageSection(section: string, content: string, title?: string) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.HOMEPAGE,
        [Query.equal('section', section)]
      );
      
      const data = { section, content, title, isActive: true };
      
      if (response.documents.length > 0) {
        return await databases.updateDocument(
          DATABASE_ID,
          COLLECTIONS.HOMEPAGE,
          response.documents[0].$id,
          data
        );
      } else {
        return await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.HOMEPAGE,
          createId(),
          data
        );
      }
    } catch (error: any) {
      throw new AppwriteError(error.message, error.code, error.type);
    }
  }
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

  getFilePreview(bucketId: string, fileId: string, width?: number, height?: number) {
    return storage.getFilePreview(bucketId, fileId, width, height);
  },

  getFileDownload(bucketId: string, fileId: string) {
    return storage.getFileDownload(bucketId, fileId);
  },

  getFileView(bucketId: string, fileId: string) {
    return storage.getFileView(bucketId, fileId);
  }
};

export default client;
