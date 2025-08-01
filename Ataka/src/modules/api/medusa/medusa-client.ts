
/**
 * Simple Medusa client using native fetch API
 * Used as a fallback when the official Medusa packages can't be installed
 */

const MEDUSA_BACKEND_URL = import.meta.env.VITE_MEDUSA_BACKEND_URL || "http://localhost:9000"; // Allow override via env var

export type MedusaConfig = {
  baseUrl: string;
  apiKey?: string;
};

class MedusaClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor(config: MedusaConfig = { baseUrl: MEDUSA_BACKEND_URL }) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    
    // Log the backend URL being used
    console.log("Medusa client initialized with backend URL:", this.baseUrl);
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/store${endpoint}`;
    
    console.log(`Making request to: ${url}`);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      // Add timeout to fetch requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // Detailed error logging for status codes
      if (!response.ok) {
        const errorText = await response.text();
        let errorJson;
        
        try {
          errorJson = JSON.parse(errorText);
        } catch (e) {
          errorJson = { message: errorText || `HTTP error ${response.status}` };
        }
        
        console.error(`Medusa request failed (${response.status}):`, {
          url,
          status: response.status,
          statusText: response.statusText,
          error: errorJson
        });
        
        throw new Error(errorJson.message || `HTTP error ${response.status}`);
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors and timeouts
      if (error.name === 'AbortError') {
        console.error("Medusa request timeout:", url);
        throw new Error(`Request to ${url} timed out after 10 seconds`);
      }
      
      console.error("Medusa request error:", {
        url,
        error: error.message || 'Unknown error'
      });
      throw error;
    }
  }

  // Products
  async getProducts() {
    return this.request<any>('/products');
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`);
  }

  // Orders
  async getOrders() {
    return this.request<any>('/orders');
  }

  // Cart
  async createCart() {
    return this.request<any>('/carts', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }
  
  // Test connection 
  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        return { success: true, status: response.status };
      }
      
      return { 
        success: false, 
        status: response.status,
        message: `Server responded with status ${response.status}` 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Network error',
        message: `Connection failed: ${error.message || 'Unknown error'}`
      };
    }
  }
}

// Create a default client instance
const medusaClient = new MedusaClient();

export { medusaClient };
export default MedusaClient;
