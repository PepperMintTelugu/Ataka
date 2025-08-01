import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Settings,
  Zap,
  Database,
  ExternalLink,
} from "lucide-react";

interface WooCommerceConfig {
  siteUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

interface ImportedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  status: "pending" | "importing" | "success" | "error";
  error?: string;
}

export default function ProductImport() {
  const [config, setConfig] = useState<WooCommerceConfig>({
    siteUrl: "https://ataka.co.in",
    consumerKey: "",
    consumerSecret: "",
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [products, setProducts] = useState<ImportedProduct[]>([]);
  const [importProgress, setImportProgress] = useState(0);
  const [importStats, setImportStats] = useState({
    total: 0,
    success: 0,
    errors: 0,
    pending: 0,
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleConfigChange = (
    field: keyof WooCommerceConfig,
    value: string,
  ) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const testConnection = async () => {
    if (!config.siteUrl || !config.consumerKey || !config.consumerSecret) {
      toast({
        title: "Missing Configuration",
        description: "Please fill in all WooCommerce API credentials.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/import/test-woocommerce", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        setIsConnected(true);
        toast({
          title: "Connection Successful! ✅",
          description: `Found ${data.data.totalProducts} products on your WooCommerce store.`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Connection test failed:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Unable to connect to WooCommerce store.",
        variant: "destructive",
      });
    }
  };

  const fetchProducts = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please test connection first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/import/fetch-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (data.success) {
        const transformedProducts = data.data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.src || "/placeholder.svg",
          status: "pending" as const,
        }));

        setProducts(transformedProducts);
        setImportStats({
          total: transformedProducts.length,
          success: 0,
          errors: 0,
          pending: transformedProducts.length,
        });

        toast({
          title: "Products Fetched Successfully",
          description: `Loaded ${transformedProducts.length} products ready for import.`,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Fetch products failed:", error);
      toast({
        title: "Fetch Failed",
        description:
          error.message || "Unable to fetch products from WooCommerce.",
        variant: "destructive",
      });
    }
  };

  const startImport = async () => {
    if (products.length === 0) {
      toast({
        title: "No Products",
        description: "Please fetch products first.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    setImportProgress(0);

    try {
      const response = await fetch("/api/import/import-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          config,
          products: products.map((p) => ({ id: p.id, name: p.name })),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Start polling for import progress
        pollImportProgress(data.data.importId);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Import failed:", error);
      setIsImporting(false);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to start import process.",
        variant: "destructive",
      });
    }
  };

  const pollImportProgress = async (importId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/import/progress/${importId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          const { progress, products: updatedProducts, stats } = data.data;

          setImportProgress(progress);
          setProducts(updatedProducts);
          setImportStats(stats);

          if (progress >= 100) {
            clearInterval(pollInterval);
            setIsImporting(false);
            toast({
              title: "Import Completed! 🎉",
              description: `Successfully imported ${stats.success} products with ${stats.errors} errors.`,
            });
          }
        }
      } catch (error) {
        console.error("Progress polling failed:", error);
      }
    }, 2000);

    // Clean up interval after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
      setIsImporting(false);
    }, 600000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Import from WooCommerce
              </h1>
            </div>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200"
            >
              Import from ataka.co.in
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  WooCommerce API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={config.siteUrl}
                    onChange={(e) =>
                      handleConfigChange("siteUrl", e.target.value)
                    }
                    placeholder="https://ataka.co.in"
                  />
                </div>

                <div>
                  <Label htmlFor="consumerKey">Consumer Key</Label>
                  <Input
                    id="consumerKey"
                    value={config.consumerKey}
                    onChange={(e) =>
                      handleConfigChange("consumerKey", e.target.value)
                    }
                    placeholder="ck_xxxxxxxxxxxxxxxx"
                  />
                </div>

                <div>
                  <Label htmlFor="consumerSecret">Consumer Secret</Label>
                  <Input
                    id="consumerSecret"
                    type="password"
                    value={config.consumerSecret}
                    onChange={(e) =>
                      handleConfigChange("consumerSecret", e.target.value)
                    }
                    placeholder="cs_xxxxxxxxxxxxxxxx"
                  />
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={testConnection}
                    variant="outline"
                    className="w-full"
                    disabled={isImporting}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>

                  <Button
                    onClick={fetchProducts}
                    className="w-full"
                    disabled={!isConnected || isImporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Fetch Products
                  </Button>

                  <Button
                    onClick={startImport}
                    className="w-full"
                    disabled={products.length === 0 || isImporting}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isImporting ? "Importing..." : "Start Import"}
                  </Button>
                </div>

                {isConnected && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Setup Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium">1. Get WooCommerce API Keys</h4>
                  <p className="text-gray-600">
                    Go to your WordPress admin → WooCommerce → Settings →
                    Advanced → REST API
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">2. Create API Key</h4>
                  <p className="text-gray-600">
                    Click "Add Key" with Read permissions
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">3. Copy Credentials</h4>
                  <p className="text-gray-600">
                    Copy Consumer Key and Consumer Secret
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://ataka.co.in/wp-admin/admin.php?page=wc-settings&tab=advanced&section=keys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Open WooCommerce API
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Import Progress */}
            {isImporting && (
              <Card>
                <CardHeader>
                  <CardTitle>Import Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={importProgress} className="w-full" />
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {importStats.total}
                        </div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {importStats.success}
                        </div>
                        <div className="text-sm text-gray-600">Success</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-red-600">
                          {importStats.errors}
                        </div>
                        <div className="text-sm text-gray-600">Errors</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {importStats.pending}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products List */}
            {products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Products ({products.length})</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchProducts}
                      disabled={isImporting}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.slice(0, 20).map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-16 object-cover rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/placeholder.svg";
                                  }}
                                />
                                <div>
                                  <p className="font-medium text-sm">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    ID: {product.id}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>₹{product.price}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.status === "success"
                                    ? "default"
                                    : product.status === "error"
                                      ? "destructive"
                                      : product.status === "importing"
                                        ? "secondary"
                                        : "outline"
                                }
                              >
                                {product.status === "success" && (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                )}
                                {product.status === "error" && (
                                  <XCircle className="w-3 h-3 mr-1" />
                                )}
                                {product.status === "importing" && (
                                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                )}
                                {product.status === "pending" && (
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                )}
                                {product.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {products.length > 20 && (
                      <div className="text-center py-4 text-gray-500">
                        ... and {products.length - 20} more products
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {products.length === 0 && !isImporting && (
              <Card>
                <CardContent className="text-center py-12">
                  <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No Products Loaded
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Configure your WooCommerce API and fetch products to start
                    importing.
                  </p>
                  <Button onClick={fetchProducts} disabled={!isConnected}>
                    <Download className="w-4 h-4 mr-2" />
                    Fetch Products from ataka.co.in
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
