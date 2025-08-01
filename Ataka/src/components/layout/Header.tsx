
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, LogIn, User, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.email === 'admin@ataka.com';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Will implement search functionality later
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link to="/" className="text-lg font-bold">Home</Link>
                <Link to="/categories/fiction" className="text-lg">Fiction</Link>
                <Link to="/categories/non-fiction" className="text-lg">Non-Fiction</Link>
                <Link to="/categories/poetry" className="text-lg">Poetry</Link>
                <Link to="/categories/children" className="text-lg">Children's Books</Link>
                {isAuthenticated && (
                  <>
                    <Link to="/orders" className="text-lg">My Orders</Link>
                    <Link to="/account" className="text-lg">My Account</Link>
                    {isAdmin && (
                      <Link to="/admin" className="text-lg flex items-center text-amber-600">
                        <ShieldCheck className="h-4 w-4 mr-2" />Admin Dashboard
                      </Link>
                    )}
                    <button onClick={logout} className="text-lg text-red-600">Logout</button>
                  </>
                )}
                {!isAuthenticated && (
                  <>
                    <Link to="/login" className="text-lg">Login</Link>
                    <Link to="/register" className="text-lg">Register</Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-primary text-2xl font-bold">ATAKA</h1>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex items-center flex-1 max-w-md mx-4"
          >
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search for books, authors..."
                className="w-full pl-4 pr-10 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0 h-full"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Auth & Cart Links */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      {isAdmin ? (
                        <ShieldCheck className="h-4 w-4 text-amber-600" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      {user?.name || (isAdmin ? 'Admin' : 'Account')}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/account">My Account</Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center text-amber-600">
                          <ShieldCheck className="h-4 w-4 mr-2" />Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/account/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="text-red-600 hover:text-red-700"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 flex items-center justify-center bg-primary text-white text-xs rounded-full">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form 
          onSubmit={handleSearch} 
          className="md:hidden px-4 pb-3"
        >
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search for books, authors..."
              className="w-full pl-4 pr-10 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
