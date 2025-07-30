// API client for backend communication
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

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
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Books API
  async getBooks() {
    return this.request<ApiResponse<any[]>>('/api/books');
  }

  async getBook(id: string) {
    return this.request<ApiResponse<any>>(`/api/books/${id}`);
  }

  async createBook(bookData: any) {
    return this.request<ApiResponse<any>>('/api/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: string, bookData: any) {
    return this.request<ApiResponse<any>>(`/api/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: string) {
    return this.request<ApiResponse<any>>(`/api/books/${id}`, {
      method: 'DELETE',
    });
  }

  // Authors API
  async getAuthors() {
    return this.request<ApiResponse<any[]>>('/api/authors');
  }

  async createAuthor(authorData: any) {
    return this.request<ApiResponse<any>>('/api/authors', {
      method: 'POST',
      body: JSON.stringify(authorData),
    });
  }

  async updateAuthor(id: string, authorData: any) {
    return this.request<ApiResponse<any>>(`/api/authors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(authorData),
    });
  }

  async deleteAuthor(id: string) {
    return this.request<ApiResponse<any>>(`/api/authors/${id}`, {
      method: 'DELETE',
    });
  }

  // Publishers API
  async getPublishers() {
    return this.request<ApiResponse<any[]>>('/api/publishers');
  }

  async createPublisher(publisherData: any) {
    return this.request<ApiResponse<any>>('/api/publishers', {
      method: 'POST',
      body: JSON.stringify(publisherData),
    });
  }

  async updatePublisher(id: string, publisherData: any) {
    return this.request<ApiResponse<any>>(`/api/publishers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(publisherData),
    });
  }

  async deletePublisher(id: string) {
    return this.request<ApiResponse<any>>(`/api/publishers/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders API
  async getOrders() {
    return this.request<ApiResponse<any[]>>('/api/orders');
  }

  async getOrder(id: string) {
    return this.request<ApiResponse<any>>(`/api/orders/${id}`);
  }

  async createOrder(orderData: any) {
    return this.request<ApiResponse<any>>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id: string, orderData: any) {
    return this.request<ApiResponse<any>>(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  // Users API
  async getUsers() {
    return this.request<ApiResponse<any[]>>('/api/users');
  }

  async getUser(id: string) {
    return this.request<ApiResponse<any>>(`/api/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<ApiResponse<any>>(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Auth API
  async login(credentials: { email: string; password: string }) {
    return this.request<ApiResponse<any>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any) {
    return this.request<ApiResponse<any>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request<ApiResponse<any>>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request<ApiResponse<any>>('/api/auth/me');
  }

  // Admin API
  async getAdminStats() {
    return this.request<ApiResponse<any>>('/api/admin/stats');
  }

  async uploadFile(file: File, path: string = 'books') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    return this.request<ApiResponse<{ url: string }>>('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // Health check
  async healthCheck() {
    return this.request<any>('/health');
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse };
