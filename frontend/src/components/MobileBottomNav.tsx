import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, User, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCart, useWishlist } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const location = useLocation();
  const { itemCount, toggleCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (
    e: React.MouseEvent,
    action: "link" | "cart" | "wishlist",
    path?: string,
  ) => {
    if (action === "cart") {
      e.preventDefault();
      toggleCart();
    } else if (action === "wishlist") {
      e.preventDefault();
      toggleWishlist();
    }
    // For 'link' action, let the default Link behavior handle navigation
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <nav className="grid grid-cols-5 h-16">
        {/* Home */}
        <Link
          to="/"
          className={cn(
            "flex flex-col items-center justify-center space-y-1 transition-colors touch-manipulation relative",
            isActive("/")
              ? "text-brand-600 bg-brand-50"
              : "text-gray-600 hover:text-gray-900 active:bg-gray-100",
          )}
        >
          <Home className={cn("w-5 h-5", isActive("/") && "text-brand-600")} />
          <span
            className={cn(
              "text-xs font-medium",
              isActive("/") ? "text-brand-600" : "text-gray-600",
            )}
          >
            Home
          </span>
          {isActive("/") && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-brand-600 rounded-full"></div>
          )}
        </Link>

        {/* Shop */}
        <Link
          to="/shop"
          className={cn(
            "flex flex-col items-center justify-center space-y-1 transition-colors touch-manipulation relative",
            isActive("/shop")
              ? "text-brand-600 bg-brand-50"
              : "text-gray-600 hover:text-gray-900 active:bg-gray-100",
          )}
        >
          <Search
            className={cn("w-5 h-5", isActive("/shop") && "text-brand-600")}
          />
          <span
            className={cn(
              "text-xs font-medium",
              isActive("/shop") ? "text-brand-600" : "text-gray-600",
            )}
          >
            Shop
          </span>
          {isActive("/shop") && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-brand-600 rounded-full"></div>
          )}
        </Link>

        {/* Wishlist */}
        <button
          onClick={(e) => handleNavClick(e, "wishlist")}
          className="flex flex-col items-center justify-center space-y-1 transition-colors touch-manipulation relative text-gray-600 hover:text-gray-900 active:bg-gray-100"
        >
          <div className="relative">
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {wishlist.length > 99 ? "99+" : wishlist.length}
              </Badge>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={(e) => handleNavClick(e, "cart")}
          className="flex flex-col items-center justify-center space-y-1 transition-colors touch-manipulation relative text-gray-600 hover:text-gray-900 active:bg-gray-100"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </div>
          <span className="text-xs font-medium text-gray-600">Cart</span>
        </button>

        {/* Account */}
        <Link
          to="/login"
          className={cn(
            "flex flex-col items-center justify-center space-y-1 transition-colors touch-manipulation relative",
            isActive("/login")
              ? "text-brand-600 bg-brand-50"
              : "text-gray-600 hover:text-gray-900 active:bg-gray-100",
          )}
        >
          <User
            className={cn("w-5 h-5", isActive("/login") && "text-brand-600")}
          />
          <span
            className={cn(
              "text-xs font-medium",
              isActive("/login") ? "text-brand-600" : "text-gray-600",
            )}
          >
            Account
          </span>
          {isActive("/login") && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-brand-600 rounded-full"></div>
          )}
        </Link>
      </nav>
    </div>
  );
}
