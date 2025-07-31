import { apiClient } from "@/lib/api";

export interface ConnectionStatus {
  isConnected: boolean;
  latency?: number;
  error?: string;
  backendHealth?: any;
}

export async function testBackendConnection(): Promise<ConnectionStatus> {
  const startTime = Date.now();
  
  try {
    const response = await apiClient.healthCheck();
    const latency = Date.now() - startTime;
    
    return {
      isConnected: true,
      latency,
      backendHealth: response
    };
  } catch (error) {
    return {
      isConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      latency: Date.now() - startTime
    };
  }
}

export async function testAPIEndpoints(): Promise<{
  books: boolean;
  authors: boolean;
  publishers: boolean;
  settings: boolean;
}> {
  const results = {
    books: false,
    authors: false,
    publishers: false,
    settings: false
  };

  try {
    await apiClient.getBooks();
    results.books = true;
  } catch (error) {
    console.warn('Books API endpoint failed:', error);
  }

  try {
    await apiClient.getAuthors();
    results.authors = true;
  } catch (error) {
    console.warn('Authors API endpoint failed:', error);
  }

  try {
    await apiClient.getPublishers();
    results.publishers = true;
  } catch (error) {
    console.warn('Publishers API endpoint failed:', error);
  }

  try {
    await apiClient.getSettings();
    results.settings = true;
  } catch (error) {
    console.warn('Settings API endpoint failed:', error);
  }

  return results;
}

export function displayConnectionStatus(status: ConnectionStatus): string {
  if (status.isConnected) {
    return `✅ Connected to backend (${status.latency}ms)`;
  } else {
    return `❌ Backend connection failed: ${status.error}`;
  }
}

// Auto-test connection on app load (development only)
if (import.meta.env.DEV) {
  testBackendConnection().then(status => {
    console.log('[Dev] Backend connection:', displayConnectionStatus(status));
    
    if (status.isConnected) {
      testAPIEndpoints().then(endpoints => {
        console.log('[Dev] API endpoints status:', endpoints);
      });
    }
  });
}
