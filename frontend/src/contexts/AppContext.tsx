import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Book, CartItem, WishlistItem, User } from "@/types/book";

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
  | { type: "ADD_TO_WISHLIST"; payload: Book }
  | { type: "REMOVE_FROM_WISHLIST"; payload: string }
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
    const savedCart = localStorage.getItem("telugu-books-cart");
    const savedWishlist = localStorage.getItem("telugu-books-wishlist");

    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        cart.forEach((item: CartItem) => {
          dispatch({ type: "ADD_TO_CART", payload: item.book });
          if (item.quantity > 1) {
            dispatch({
              type: "UPDATE_CART_QUANTITY",
              payload: { bookId: item.book.id, quantity: item.quantity },
            });
          }
        });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }

    if (savedWishlist) {
      try {
        const wishlist = JSON.parse(savedWishlist);
        wishlist.forEach((item: WishlistItem) => {
          dispatch({ type: "ADD_TO_WISHLIST", payload: item.book });
        });
      } catch (error) {
        console.error("Error loading wishlist from localStorage:", error);
      }
    }
  }, []);

  // Save to localStorage when cart or wishlist changes
  useEffect(() => {
    localStorage.setItem("telugu-books-cart", JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    localStorage.setItem(
      "telugu-books-wishlist",
      JSON.stringify(state.wishlist),
    );
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
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Helper hooks
export function useCart() {
  const { state, dispatch } = useApp();

  const addToCart = (book: Book) =>
    dispatch({ type: "ADD_TO_CART", payload: book });
  const removeFromCart = (bookId: string) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: bookId });
  const updateQuantity = (bookId: string, quantity: number) =>
    dispatch({ type: "UPDATE_CART_QUANTITY", payload: { bookId, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
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
