import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { GoogleStyleSearch } from "@/components/GoogleStyleSearch";
import { useCart, useWishlist } from "@/contexts/AppContext";
import { categories } from "@/data/books";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { itemCount, toggleCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { scrollDirection, isScrolled } = useScrollDirection(50);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={cn(
      "bg-white shadow-sm border-b sticky top-0 z-50 transition-transform duration-300 ease-in-out",
      scrollDirection === 'down' && isScrolled ? "-translate-y-full" : "translate-y-0"
    )}>
      {/* Top bar with offers - Hidden on mobile for cleaner look */}
      <div className="hidden sm:block bg-gradient-to-r from-brand-500 to-telugu-500 text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          <span className="telugu-text">
            FREE DELIVERY | అందమైన Packaging | Cut-throat Prices ✨
          </span>
        </div>
      </div>

      {/* Mobile Header - Google Style */}
      <div className="lg:hidden">
        <div className="px-4 py-4">
          {/* Top Row - Logo centered with Menu */}
          <div className="flex items-center justify-between mb-4">
            {/* Spacer for symmetry */}
            <div className="w-10"></div>

            {/* Centered Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Feb6a9d54076e488bac688c857f8339b7%2F68f0f0b566ee4fabb5929f4ee8330d25?format=webp&width=200"
                alt="Ataka - The Ultimate Bookstore"
                className="h-12 w-auto"
              />
            </Link>

            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Google-style Search Bar */}
          <div className="mb-2">
            <GoogleStyleSearch
              placeholder="Search books, authors..."
              className="w-full"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t bg-white shadow-lg">
            <nav className="py-2">
              <Link
                to="/shop"
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5 mr-3 text-brand-500" />
                All Books
              </Link>
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="flex justify-between items-center px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border-b border-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="font-medium">{category.name}</span>
                  <span className="text-xs text-gray-500 telugu-text">
                    {category.nameTelugu}
                  </span>
                </Link>
              ))}
              <div className="border-t border-gray-200">
                <Link
                  to="/login"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-3 text-brand-500" />
                  Sign In
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/about"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Feb6a9d54076e488bac688c857f8339b7%2F68f0f0b566ee4fabb5929f4ee8330d25?format=webp&width=200"
                alt="Ataka - The Ultimate Bookstore"
                className="h-10 w-auto"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search books, authors, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-12 h-10 border-gray-300 focus:ring-brand-500 focus:border-brand-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-brand-500 hover:bg-brand-600"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Categories Dropdown - Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">Categories</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        to={`/shop?category=${category.id}`}
                        className="flex justify-between"
                      >
                        <span>{category.name}</span>
                        <span className="text-xs text-gray-500 telugu-text">
                          {category.nameTelugu}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleWishlist}
                className="relative"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {wishlist.length}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCart}
                className="relative"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>

              {/* User Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/login">Sign In</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Create Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">My Profile</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="border-t bg-gray-50">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-8 h-12 text-sm">
              <Link
                to="/shop"
                className="text-gray-700 hover:text-brand-500 transition-colors"
              >
                All Books
              </Link>
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                  className="text-gray-700 hover:text-brand-500 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
              <Link
                to="/about"
                className="text-gray-700 hover:text-brand-500 transition-colors ml-auto"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-brand-500 transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
