
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { Package, User, LogOut } from 'lucide-react';

const Account = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If user is logged in, populate the form fields
    if (isAuthenticated && user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [isAuthenticated, user]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${email}!`,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  const handleProfileUpdate = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated.",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-serif font-bold mb-6 text-center">Account</h1>
          
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary-light"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>
                      Sign up for a new account to get started
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary-light"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Mock order history data
  const orders = [
    {
      id: "ORD12345",
      date: "Apr 15, 2023",
      status: "Delivered",
      amount: "₹599.00",
      items: 2
    },
    {
      id: "ORD12346",
      date: "Mar 28, 2023",
      status: "Processing",
      amount: "₹849.00",
      items: 3
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-serif font-bold mb-6">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                <User className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium text-lg">{user?.name}</p>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <nav className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/account')}
              >
                <User className="mr-2 h-5 w-5" />
                Profile
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/account/orders')}
              >
                <Package className="mr-2 h-5 w-5" />
                Orders
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="profile-name">Full Name</Label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profile-password">Password</Label>
                    <Input
                      id="profile-password"
                      type="password"
                      placeholder="••••••••"
                    />
                    <p className="text-sm text-gray-500 mt-1">Leave blank to keep current password</p>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={handleProfileUpdate}
                    className="bg-primary hover:bg-primary-light"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    View and track your recent orders
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order.id} className="flex flex-wrap justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                          </div>
                          
                          <div>
                            <p>{order.items} items</p>
                            <p className="font-medium text-primary">{order.amount}</p>
                          </div>
                          
                          <div className="w-full sm:w-auto mt-3 sm:mt-0">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          
                          <Button variant="outline" size="sm" className="w-full sm:w-auto mt-3 sm:mt-0">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-600">You haven't placed any orders yet.</p>
                      <Button asChild className="mt-4">
                        <a href="/">Start Shopping</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Account;
