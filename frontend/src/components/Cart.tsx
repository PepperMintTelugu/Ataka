import React from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

export function Cart() {
  const {
    cart,
    isCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    closeCart,
    cartTotal,
    itemCount,
  } = useCart();

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId);
    } else {
      updateQuantity(bookId, newQuantity);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shopping Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itemCount} items
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any books yet.
              </p>
              <Button asChild onClick={closeCart}>
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.book.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                    >
                      <Link
                        to={`/book/${item.book.id}`}
                        onClick={closeCart}
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
                          onClick={closeCart}
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

                        <div className="flex items-center justify-between">
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

                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleQuantityChange(
                                  item.book.id,
                                  item.quantity - 1,
                                )
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() =>
                                handleQuantityChange(
                                  item.book.id,
                                  item.quantity + 1,
                                )
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium">
                            Subtotal: ₹{item.book.price * item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.book.id)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Cart Summary */}
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Subtotal ({itemCount} items)
                  </span>
                  <span className="font-medium">₹{cartTotal}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-brand-600">
                    ₹{cartTotal}
                  </span>
                </div>

                <div className="space-y-2">
                  <Button asChild className="w-full" size="lg">
                    <Link to="/checkout" onClick={closeCart}>
                      Proceed to Checkout
                    </Link>
                  </Button>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={closeCart}
                      asChild
                    >
                      <Link to="/shop">Continue Shopping</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={clearCart}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="pt-4 text-center text-xs text-gray-500">
                  <p className="flex items-center justify-center space-x-4">
                    <span>✓ FREE Delivery</span>
                    <span>✓ Secure Payment</span>
                    <span>✓ Easy Returns</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
