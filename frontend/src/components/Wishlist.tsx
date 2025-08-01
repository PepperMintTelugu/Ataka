import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useWishlist, useCart } from "@/contexts/AppContext";

export function Wishlist() {
  const { wishlist, isWishlistOpen, removeFromWishlist, closeWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (bookId: string) => {
    const wishlistItem = wishlist.find((item) => item.book.id === bookId);
    if (wishlistItem) {
      addToCart(wishlistItem.book);
      removeFromWishlist(bookId);
    }
  };

  return (
    <Sheet open={isWishlistOpen} onOpenChange={closeWishlist}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Wishlist
            {wishlist.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {wishlist.length} items
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {wishlist.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <Heart className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Save books you love for later by clicking the heart icon.
              </p>
              <Button asChild onClick={closeWishlist}>
                <Link to="/shop">Browse Books</Link>
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div
                    key={item.book.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg"
                  >
                    <Link
                      to={`/book/${item.book.id}`}
                      onClick={closeWishlist}
                      className="flex-shrink-0"
                    >
                      <img
                        src={item.book.image}
                        alt={item.book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/book/${item.book.id}`}
                        onClick={closeWishlist}
                        className="block"
                      >
                        <h4 className="font-medium text-sm line-clamp-2 hover:text-brand-600 transition-colors">
                          {item.book.title}
                        </h4>
                        {item.book.titleTelugu && (
                          <p className="text-xs text-gray-600 telugu-text line-clamp-1">
                            {item.book.titleTelugu}
                          </p>
                        )}
                      </Link>
                      <p className="text-xs text-gray-600 mb-2">
                        by {item.book.author}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-brand-600">
                            ₹{item.book.price}
                          </span>
                          {item.book.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              ₹{item.book.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromWishlist(item.book.id)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item.book.id)}
                          className="flex-1 h-8 text-xs"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="h-8 px-3 text-xs"
                        >
                          <Link
                            to={`/book/${item.book.id}`}
                            onClick={closeWishlist}
                          >
                            View
                          </Link>
                        </Button>
                      </div>

                      {!item.book.inStock && (
                        <p className="text-xs text-red-500 mt-1">
                          Currently out of stock
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 text-center">
                <Button
                  variant="outline"
                  onClick={closeWishlist}
                  asChild
                  className="w-full"
                >
                  <Link to="/shop">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
