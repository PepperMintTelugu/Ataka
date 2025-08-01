
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminBooks from '@/components/admin/AdminBooks';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminInventory from '@/components/admin/AdminInventory';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FileText, Package, LayoutGrid, AlertCircle, CheckCircle2, Settings, RefreshCw } from 'lucide-react';
import { medusaClient } from '@/modules/api/medusa/medusa-client';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('books');
  const [medusaStatus, setMedusaStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [medusaError, setMedusaError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if user is admin
  const isAdmin = user?.email === 'admin@ataka.com';
  
  console.log("Admin.tsx rendered with:", {
    user,
    isAuthenticated,
    isAdmin,
    medusaStatus
  });

  // Check Medusa connection
  const checkMedusaConnection = async () => {
    if (!isAuthenticated || !isAdmin) return;
    
    setIsLoading(true);
    setMedusaStatus('checking');
    
    try {
      console.log("Testing connection to Medusa...");
      const result = await medusaClient.testConnection();
      
      console.log("Medusa connection test result:", result);
      
      if (result.success) {
        setMedusaStatus('connected');
        toast({
          title: "Connected to backend",
          description: "Successfully connected to the Medusa backend service.",
        });
      } else {
        setMedusaStatus('error');
        setMedusaError(result.message || 'Could not connect to Medusa server');
        toast({
          variant: "destructive",
          title: "Backend connection failed",
          description: result.message || "Could not connect to the Medusa backend service.",
        });
      }
    } catch (err: any) {
      console.error("Medusa connection error:", err);
      setMedusaStatus('error');
      setMedusaError(err.message || 'Could not connect to Medusa server');
      toast({
        variant: "destructive",
        title: "Backend connection failed",
        description: err.message || "Could not connect to the Medusa backend service.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMedusaConnection();
  }, [isAuthenticated, isAdmin]);

  // Redirect non-authenticated users
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Show access denied for non-admin users
  if (!isAdmin) {
    console.log("Not admin, showing access denied");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 mb-6">You do not have permission to access this page.</p>
          <Link 
            to="/" 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold">ATAKA Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your products, orders, and inventory from this central dashboard.
        </p>
      </div>
      
      {/* Admin User Information */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Logged in as Admin:</span> 
          <span className="text-primary">{user?.email}</span>
        </div>
      </div>
      
      {/* Medusa Connection Status */}
      {medusaStatus === 'checking' && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connecting to Medusa</AlertTitle>
          <AlertDescription>
            Attempting to connect to your Medusa e-commerce server...
          </AlertDescription>
        </Alert>
      )}
      
      {medusaStatus === 'connected' && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-700">Connected to Medusa</AlertTitle>
          <AlertDescription className="text-green-600">
            Your admin panel is successfully connected to Medusa e-commerce backend.
          </AlertDescription>
        </Alert>
      )}
      
      {medusaStatus === 'error' && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            <p>{medusaError || 'Failed to connect to Medusa server'}</p>
            <p className="mt-2 text-sm">
              Make sure your Medusa server is running and accessible. The current backend URL is: {medusaClient['baseUrl']}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={checkMedusaConnection}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Retrying...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Connection
                </>
              )}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="books" className="flex items-center justify-center">
            <LayoutGrid className="mr-2 h-4 w-4" />
            <span>Books</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center justify-center">
            <FileText className="mr-2 h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center justify-center">
            <Package className="mr-2 h-4 w-4" />
            <span>Inventory</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="books">
          <AdminBooks />
        </TabsContent>
        
        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>
        
        <TabsContent value="inventory">
          <AdminInventory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
