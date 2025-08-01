import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type:
    | "cart_abandoned"
    | "wishlist_reminder"
    | "stock_alert"
    | "order_update"
    | "promotion"
    | "general";
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  settings: {
    cartAbandonmentEnabled: boolean;
    wishlistRemindersEnabled: boolean;
    stockAlertsEnabled: boolean;
    promotionalEnabled: boolean;
    orderUpdatesEnabled: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
}

type NotificationAction =
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_READ"; payload: string }
  | { type: "MARK_ALL_READ" }
  | { type: "REMOVE_NOTIFICATION"; payload: string }
  | { type: "CLEAR_EXPIRED" }
  | { type: "UPDATE_SETTINGS"; payload: Partial<NotificationState["settings"]> }
  | { type: "SYNC_NOTIFICATIONS"; payload: Notification[] };

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  settings: {
    cartAbandonmentEnabled: true,
    wishlistRemindersEnabled: true,
    stockAlertsEnabled: true,
    promotionalEnabled: true,
    orderUpdatesEnabled: true,
    emailNotifications: true,
    pushNotifications: false,
  },
};

function notificationReducer(
  state: NotificationState,
  action: NotificationAction,
): NotificationState {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };
    }

    case "MARK_READ": {
      const updatedNotifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n,
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter((n) => !n.read).length,
      };
    }

    case "MARK_ALL_READ": {
      const updatedNotifications = state.notifications.map((n) => ({
        ...n,
        read: true,
      }));
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    }

    case "REMOVE_NOTIFICATION": {
      const filteredNotifications = state.notifications.filter(
        (n) => n.id !== action.payload,
      );
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter((n) => !n.read).length,
      };
    }

    case "CLEAR_EXPIRED": {
      const now = new Date();
      const validNotifications = state.notifications.filter(
        (n) => !n.expiresAt || n.expiresAt > now,
      );
      return {
        ...state,
        notifications: validNotifications,
        unreadCount: validNotifications.filter((n) => !n.read).length,
      };
    }

    case "UPDATE_SETTINGS": {
      const newSettings = { ...state.settings, ...action.payload };
      localStorage.setItem(
        "notification-settings",
        JSON.stringify(newSettings),
      );
      return {
        ...state,
        settings: newSettings,
      };
    }

    case "SYNC_NOTIFICATIONS": {
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((n) => !n.read).length,
      };
    }

    default:
      return state;
  }
}

const NotificationContext = createContext<{
  state: NotificationState;
  dispatch: React.Dispatch<NotificationAction>;
} | null>(null);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Safely get toast, might not be available during initial render
  let toast: any;
  try {
    const toastContext = useToast();
    toast = toastContext.toast;
  } catch (error) {
    // Toast context not available
    toast = () => {}; // No-op function
  }

  // Load settings and notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("notification-settings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: "UPDATE_SETTINGS", payload: settings });
      }

      const savedNotifications = localStorage.getItem("local-notifications");
      if (savedNotifications) {
        const notifications = JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          expiresAt: n.expiresAt ? new Date(n.expiresAt) : undefined,
        }));
        dispatch({ type: "SYNC_NOTIFICATIONS", payload: notifications });
      }
    } catch (error) {
      console.error("Error loading notification data:", error);
    }
  }, []);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      "local-notifications",
      JSON.stringify(state.notifications),
    );
  }, [state.notifications]);

  // Clear expired notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: "CLEAR_EXPIRED" });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Show toast for new notifications
  useEffect(() => {
    if (!toast || typeof toast !== "function") return;

    const lastNotification = state.notifications[0];
    if (
      lastNotification &&
      !lastNotification.read &&
      lastNotification.type !== "cart_abandoned"
    ) {
      // Don't toast for cart abandonment
      toast({
        title: lastNotification.title,
        description: lastNotification.message,
      });
    }
  }, [state.notifications, toast]);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

// Helper hooks for specific notification types
export function useNotificationHelpers() {
  const { state, dispatch } = useNotifications();

  const createNotification = (
    type: Notification["type"],
    title: string,
    message: string,
    data?: any,
    expiresIn?: number, // minutes
  ) => {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date(),
      expiresAt: expiresIn
        ? new Date(Date.now() + expiresIn * 60 * 1000)
        : undefined,
    };

    dispatch({ type: "ADD_NOTIFICATION", payload: notification });
    return notification.id;
  };

  const scheduleCartAbandonmentReminder = (
    cartItems: any[],
    minutes: number = 30,
  ) => {
    if (!state.settings.cartAbandonmentEnabled) return;

    setTimeout(
      () => {
        const currentCart = JSON.parse(
          localStorage.getItem("ataka-cart") || "[]",
        );
        if (currentCart.length > 0) {
          createNotification(
            "cart_abandoned",
            "Don't forget your books!",
            `You have ${currentCart.length} book${currentCart.length > 1 ? "s" : ""} waiting in your cart.`,
            { cartItems: currentCart },
            1440, // Expire in 24 hours
          );
        }
      },
      minutes * 60 * 1000,
    );
  };

  const scheduleWishlistReminder = (bookTitle: string, days: number = 7) => {
    if (!state.settings.wishlistRemindersEnabled) return;

    setTimeout(
      () => {
        createNotification(
          "wishlist_reminder",
          "Book back in stock!",
          `"${bookTitle}" from your wishlist is now available.`,
          { bookTitle },
          2880, // Expire in 48 hours
        );
      },
      days * 24 * 60 * 60 * 1000,
    );
  };

  const notifyStockAlert = (bookTitle: string, bookId: string) => {
    if (!state.settings.stockAlertsEnabled) return;

    createNotification(
      "stock_alert",
      "Back in Stock!",
      `"${bookTitle}" is now available to order.`,
      { bookId, bookTitle },
      1440, // Expire in 24 hours
    );
  };

  const notifyOrderUpdate = (
    orderNumber: string,
    status: string,
    message: string,
  ) => {
    if (!state.settings.orderUpdatesEnabled) return;

    createNotification("order_update", `Order ${orderNumber}`, message, {
      orderNumber,
      status,
    });
  };

  const notifyPromotion = (title: string, message: string, data?: any) => {
    if (!state.settings.promotionalEnabled) return;

    createNotification(
      "promotion",
      title,
      message,
      data,
      10080, // Expire in 7 days
    );
  };

  const markAsRead = (notificationId: string) => {
    dispatch({ type: "MARK_READ", payload: notificationId });
  };

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_READ" });
  };

  const removeNotification = (notificationId: string) => {
    dispatch({ type: "REMOVE_NOTIFICATION", payload: notificationId });
  };

  const updateSettings = (settings: Partial<NotificationState["settings"]>) => {
    dispatch({ type: "UPDATE_SETTINGS", payload: settings });
  };

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    settings: state.settings,
    createNotification,
    scheduleCartAbandonmentReminder,
    scheduleWishlistReminder,
    notifyStockAlert,
    notifyOrderUpdate,
    notifyPromotion,
    markAsRead,
    markAllAsRead,
    removeNotification,
    updateSettings,
  };
}
