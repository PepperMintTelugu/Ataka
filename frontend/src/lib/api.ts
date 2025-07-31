// API client for backend communication
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Books API
  async getBooks() {
    return this.request<ApiResponse<any[]>>("/api/books");
  }

  async getBook(id: string) {
    return this.request<ApiResponse<any>>(`/api/books/${id}`);
  }

  async createBook(bookData: any) {
    return this.request<ApiResponse<any>>("/api/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: string, bookData: any) {
    return this.request<ApiResponse<any>>(`/api/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: string) {
    return this.request<ApiResponse<any>>(`/api/books/${id}`, {
      method: "DELETE",
    });
  }

  // Authors API
  async getAuthors() {
    return this.request<ApiResponse<any[]>>("/api/authors");
  }

  async createAuthor(authorData: any) {
    return this.request<ApiResponse<any>>("/api/authors", {
      method: "POST",
      body: JSON.stringify(authorData),
    });
  }

  async updateAuthor(id: string, authorData: any) {
    return this.request<ApiResponse<any>>(`/api/authors/${id}`, {
      method: "PUT",
      body: JSON.stringify(authorData),
    });
  }

  async deleteAuthor(id: string) {
    return this.request<ApiResponse<any>>(`/api/authors/${id}`, {
      method: "DELETE",
    });
  }

  // Publishers API
  async getPublishers() {
    return this.request<ApiResponse<any[]>>("/api/publishers");
  }

  async createPublisher(publisherData: any) {
    return this.request<ApiResponse<any>>("/api/publishers", {
      method: "POST",
      body: JSON.stringify(publisherData),
    });
  }

  async updatePublisher(id: string, publisherData: any) {
    return this.request<ApiResponse<any>>(`/api/publishers/${id}`, {
      method: "PUT",
      body: JSON.stringify(publisherData),
    });
  }

  async deletePublisher(id: string) {
    return this.request<ApiResponse<any>>(`/api/publishers/${id}`, {
      method: "DELETE",
    });
  }

  // Orders API
  async getOrders() {
    return this.request<ApiResponse<any[]>>("/api/orders");
  }

  async getOrder(id: string) {
    return this.request<ApiResponse<any>>(`/api/orders/${id}`);
  }



  async updateOrder(id: string, orderData: any) {
    return this.request<ApiResponse<any>>(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify(orderData),
    });
  }

  // Users API
  async getUsers() {
    return this.request<ApiResponse<any[]>>("/api/users");
  }

  async getUser(id: string) {
    return this.request<ApiResponse<any>>(`/api/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<ApiResponse<any>>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  // Auth API
  async login(credentials: { email: string; password: string }) {
    return this.request<ApiResponse<any>>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any) {
    return this.request<ApiResponse<any>>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request<ApiResponse<any>>("/api/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser() {
    return this.request<ApiResponse<any>>("/api/auth/me");
  }

  // Admin API
  async getAdminStats() {
    return this.request<ApiResponse<any>>("/api/admin/stats");
  }

  async uploadFile(file: File, path: string = "books") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    return this.request<ApiResponse<{ url: string }>>("/api/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // Payment API
  async createPaymentOrder(orderData: {
    amount: number;
    currency?: string;
    items: any[];
    shippingAddress: any;
    notes?: any;
  }) {
    return this.request<
      ApiResponse<{
        orderId: string;
        razorpayOrderId: string;
        amount: number;
        currency: string;
      }>
    >("/api/payments/create-order", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async verifyPayment(paymentData: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }) {
    return this.request<
      ApiResponse<{
        verified: boolean;
        order: any;
      }>
    >("/api/payments/verify-payment", {
      method: "POST",
      body: JSON.stringify(paymentData),
    });
  }

  async getPaymentConfig() {
    return this.request<
      ApiResponse<{
        keyId: string;
        currency: string;
      }>
    >("/api/payments/config");
  }

  // Order API Extended
  async createOrder(orderData: {
    items: any[];
    shippingAddress: any;
    paymentMethod: string;
    notes?: string;
  }) {
    return this.request<ApiResponse<any>>("/api/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request<ApiResponse<any>>(`/api/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  async cancelOrder(orderId: string, reason?: string) {
    return this.request<ApiResponse<any>>(`/api/orders/${orderId}/cancel`, {
      method: "POST",
      body: JSON.stringify({ reason }),
    });
  }

  async getOrderInvoice(orderId: string) {
    return this.request<Blob>(`/api/orders/${orderId}/invoice`, {
      method: "GET",
    });
  }

  async trackOrder(orderId: string) {
    return this.request<
      ApiResponse<{
        status: string;
        trackingNumber?: string;
        deliveryEstimate: string;
        statusHistory: any[];
      }>
    >(`/api/orders/${orderId}/track`);
  }

  // Shipping API
  async calculateShipping(data: {
    items: any[];
    pincode: string;
    weight?: number;
  }) {
    return this.request<
      ApiResponse<{
        shippingCost: number;
        deliveryEstimate: string;
        availableCouriers: any[];
      }>
    >("/api/delivery/calculate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createShipment(orderData: {
    orderId: string;
    courierPartner: string;
    pickupLocation?: string;
  }) {
    return this.request<
      ApiResponse<{
        shipmentId: string;
        trackingNumber: string;
        courierName: string;
      }>
    >("/api/delivery/create-shipment", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async trackShipment(trackingNumber: string) {
    return this.request<
      ApiResponse<{
        status: string;
        location: string;
        estimatedDelivery: string;
        history: any[];
      }>
    >(`/api/delivery/track/${trackingNumber}`);
  }

  // Cart API (for logged in users)
  async saveCart(cartItems: any[]) {
    return this.request<ApiResponse<any>>("/api/users/cart", {
      method: "POST",
      body: JSON.stringify({ items: cartItems }),
    });
  }

  async getCart() {
    return this.request<ApiResponse<any[]>>("/api/users/cart");
  }

  async syncCart(localCartItems: any[]) {
    return this.request<ApiResponse<any[]>>("/api/users/cart/sync", {
      method: "POST",
      body: JSON.stringify({ localItems: localCartItems }),
    });
  }

  // Wishlist API
  async getWishlist() {
    return this.request<ApiResponse<any[]>>("/api/users/wishlist");
  }

  async addToWishlist(bookId: string) {
    return this.request<ApiResponse<any>>("/api/users/wishlist", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    });
  }

  async removeFromWishlist(bookId: string) {
    return this.request<ApiResponse<any>>(`/api/users/wishlist/${bookId}`, {
      method: "DELETE",
    });
  }

  // Analytics and Admin APIs
  async getAnalytics(timeframe: string = "30d") {
    return this.request<
      ApiResponse<{
        revenue: number;
        orders: number;
        customers: number;
        topBooks: any[];
        revenueChart: any[];
      }>
    >(`/api/analytics?timeframe=${timeframe}`);
  }

  async getInventoryStats() {
    return this.request<
      ApiResponse<{
        totalBooks: number;
        lowStock: any[];
        outOfStock: any[];
        recentlyAdded: any[];
      }>
    >("/api/admin/inventory/stats");
  }

  // Settings API
  async getSettings() {
    return this.request<ApiResponse<any>>("/api/settings");
  }

  async updateSettings(settings: any) {
    return this.request<ApiResponse<any>>("/api/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
  }

  // Search API
  async searchBooks(
    query: string,
    filters?: {
      category?: string;
      author?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    },
  ) {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    return this.request<
      ApiResponse<{
        books: any[];
        total: number;
        suggestions: string[];
      }>
    >(`/api/books/search?${params.toString()}`);
  }

  // Bulk operations for admin
  async bulkUpdateBooks(updates: Array<{ id: string; updates: any }>) {
    return this.request<ApiResponse<any>>("/api/admin/books/bulk-update", {
      method: "POST",
      body: JSON.stringify({ updates }),
    });
  }

  async exportData(
    type: "books" | "orders" | "customers",
    format: "csv" | "xlsx" = "csv",
  ) {
    return this.request<Blob>(`/api/admin/export/${type}?format=${format}`, {
      method: "GET",
    });
  }

  // Notification API
  async getNotifications() {
    return this.request<ApiResponse<any[]>>("/api/notifications");
  }

  async markNotificationRead(notificationId: string) {
    return this.request<ApiResponse<any>>(
      `/api/notifications/${notificationId}/read`,
      {
        method: "POST",
      },
    );
  }

  // Health check
  async healthCheck() {
    return this.request<any>("/health");
  }

  // Location and utility APIs
  async validatePincode(pincode: string) {
    return this.request<
      ApiResponse<{
        valid: boolean;
        city?: string;
        state?: string;
        deliverable: boolean;
      }>
    >(`/api/utils/validate-pincode/${pincode}`);
  }

  async getStates() {
    return this.request<ApiResponse<string[]>>("/api/utils/states");
  }

  async getCitiesByState(state: string) {
    return this.request<ApiResponse<string[]>>(`/api/utils/cities/${state}`);
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export types for the complete e-commerce functionality
export interface CartItem {
  bookId: string;
  quantity: number;
  price: number;
  title: string;
  image: string;
}

export interface Address {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface PaymentOrder {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: CartItem[];
  shippingAddress: Address;
  payment: {
    method: string;
    status: string;
    razorpayPaymentId?: string;
  };
  delivery: {
    trackingNumber?: string;
    courierPartner?: string;
    estimatedDelivery?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type { ApiResponse };
