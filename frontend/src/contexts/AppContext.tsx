import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Book, CartItem, WishlistItem, User } from "@/types/book";
import { apiClient } from "@/lib/api";

interface AppState {
  cart: CartItem[];
  wishlist: WishlistItem[];
  user: User | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
}

type AppAction =
  | { type: "ADD_TO_CART"; payload: Book }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | {
      type: "UPDATE_CART_QUANTITY";
      payload: { bookId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "SYNC_CART"; payload: CartItem[] }
  | { type: "ADD_TO_WISHLIST"; payload: Book }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
  | { type: "SYNC_WISHLIST"; payload: WishlistItem[] }
  | { type: "SET_USER"; payload: User | null }
  | { type: "TOGGLE_CART" }
  | { type: "TOGGLE_WISHLIST" }
  | { type: "CLOSE_CART" }
  | { type: "CLOSE_WISHLIST" };

const initialState: AppState = {
  cart: [],
  wishlist: [],
  user: null,
  isCartOpen: false,
  isWishlistOpen: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.cart.find(
        (item) => item.book.id === action.payload.id,
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.book.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          { book: action.payload, quantity: 1, addedAt: new Date() },
        ],
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.book.id !== action.payload),
      };
    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart
          .map((item) =>
            item.book.id === action.payload.bookId
              ? { ...item, quantity: action.payload.quantity }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "SYNC_CART":
      return { ...state, cart: action.payload };
    case "ADD_TO_WISHLIST": {
      const exists = state.wishlist.find(
        (item) => item.book.id === action.payload.id,
      );
      if (exists) return state;
      return {
        ...state,
        wishlist: [
          ...state.wishlist,
          { book: action.payload, addedAt: new Date() },
        ],
      };
    }
    case "REMOVE_FROM_WISHLIST":
      return {
        ...state,
        wishlist: state.wishlist.filter(
          (item) => item.book.id !== action.payload,
        ),
      };
    case "SYNC_WISHLIST":
      return { ...state, wishlist: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "TOGGLE_CART":
      return { ...state, isCartOpen: !state.isCartOpen, isWishlistOpen: false };
    case "TOGGLE_WISHLIST":
      return {
        ...state,
        isWishlistOpen: !state.isWishlistOpen,
        isCartOpen: false,
      };
    case "CLOSE_CART":
      return { ...state, isCartOpen: false };
    case "CLOSE_WISHLIST":
      return { ...state, isWishlistOpen: false };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("ataka-cart");
      const savedWishlist = localStorage.getItem("ataka-wishlist");

      if (savedCart) {
        const cart = JSON.parse(savedCart);
        if (Array.isArray(cart)) {
          dispatch({ type: "SYNC_CART", payload: cart });
        }
      }

      if (savedWishlist) {
        const wishlist = JSON.parse(savedWishlist);
        if (Array.isArray(wishlist)) {
          dispatch({ type: "SYNC_WISHLIST", payload: wishlist });
        }
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  // Save to localStorage when cart or wishlist changes
  useEffect(() => {
    localStorage.setItem("ataka-cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem("ataka-wishlist", JSON.stringify(state.wishlist));
  }, [state.wishlist]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    console.error("AppContext is null. Current context:", context);
    console.error("Make sure AppProvider is properly wrapping your component");
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Helper hooks
export function useCart() {
  const { state, dispatch } = useApp();

  const addToCart = async (book: Book) => {
    dispatch({ type: "ADD_TO_CART", payload: book });

    // Sync with backend if user is logged in
    if (state.user) {
      try {
        await apiClient.saveCart(
          state.cart.map((item) => ({
            bookId: item.book.id,
            quantity: item.quantity,
            price: item.book.price,
            title: item.book.title,
            image: item.book.coverImage,
          })),
        );
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    }
  };

  const removeFromCart = async (bookId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: bookId });

    // Sync with backend if user is logged in
    if (state.user) {
      try {
        const updatedCart = state.cart.filter(
          (item) => item.book.id !== bookId,
        );
        await apiClient.saveCart(
          updatedCart.map((item) => ({
            bookId: item.book.id,
            quantity: item.quantity,
            price: item.book.price,
            title: item.book.title,
            image: item.book.coverImage,
          })),
        );
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    }
  };

  const updateQuantity = async (bookId: string, quantity: number) => {
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { bookId, quantity } });

    // Sync with backend if user is logged in
    if (state.user) {
      try {
        const updatedCart = state.cart
          .map((item) =>
            item.book.id === bookId ? { ...item, quantity } : item,
          )
          .filter((item) => item.quantity > 0);

        await apiClient.saveCart(
          updatedCart.map((item) => ({
            bookId: item.book.id,
            quantity: item.quantity,
            price: item.book.price,
            title: item.book.title,
            image: item.book.coverImage,
          })),
        );
      } catch (error) {
        console.error("Failed to sync cart with backend:", error);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    // Clear backend cart if user is logged in
    if (state.user) {
      try {
        await apiClient.saveCart([]);
      } catch (error) {
        console.error("Failed to clear cart on backend:", error);
      }
    }
  };

  const syncCart = async () => {
    if (!state.user) return;

    try {
      const response = await apiClient.syncCart(
        state.cart.map((item) => ({
          bookId: item.book.id,
          quantity: item.quantity,
          price: item.book.price,
          title: item.book.title,
          image: item.book.coverImage,
        })),
      );

      if (response.success && response.data) {
        // Transform backend cart data to local format
        const syncedCart = response.data.map((item: any) => ({
          book: {
            id: item.bookId,
            title: item.title,
            price: item.price,
            coverImage: item.image,
            // Add other required book properties
          },
          quantity: item.quantity,
          addedAt: new Date(),
        }));

        dispatch({ type: "SYNC_CART", payload: syncedCart });
      }
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  };

  const toggleCart = () => dispatch({ type: "TOGGLE_CART" });
  const closeCart = () => dispatch({ type: "CLOSE_CART" });

  const cartTotal = state.cart.reduce(
    (total, item) => total + item.book.price * item.quantity,
    0,
  );
  const itemCount = state.cart.reduce(
    (count, item) => count + item.quantity,
    0,
  );

  return {
    cart: state.cart,
    isCartOpen: state.isCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
    toggleCart,
    closeCart,
    cartTotal,
    itemCount,
  };
}

export function useWishlist() {
  const { state, dispatch } = useApp();

  const addToWishlist = (book: Book) =>
    dispatch({ type: "ADD_TO_WISHLIST", payload: book });
  const removeFromWishlist = (bookId: string) =>
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: bookId });
  const toggleWishlist = () => dispatch({ type: "TOGGLE_WISHLIST" });
  const closeWishlist = () => dispatch({ type: "CLOSE_WISHLIST" });

  const isInWishlist = (bookId: string) =>
    state.wishlist.some((item) => item.book.id === bookId);

  return {
    wishlist: state.wishlist,
    isWishlistOpen: state.isWishlistOpen,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    closeWishlist,
    isInWishlist,
  };
}
