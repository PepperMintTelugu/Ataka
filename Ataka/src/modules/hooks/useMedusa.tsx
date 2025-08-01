
import { useState, useEffect } from 'react';
import { medusaClient } from '@/modules/api/medusa/medusa-client';

export function useMedusaProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await medusaClient.getProducts();
      setProducts(response.products || []);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error fetching Medusa products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, isLoading, error, refetch: fetchProducts };
}

export function useMedusaOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await medusaClient.getOrders();
      setOrders(response.orders || []);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Error fetching Medusa orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return { orders, isLoading, error, refetch: fetchOrders };
}
