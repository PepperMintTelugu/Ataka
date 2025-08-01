import { useEffect } from "react";
import { useNotificationHelpers } from "@/contexts/NotificationContext";

export default function CartAbandonmentTracker() {
  let scheduleCartAbandonmentReminder: any;
  let settings: any;

  try {
    const helpers = useNotificationHelpers();
    scheduleCartAbandonmentReminder = helpers.scheduleCartAbandonmentReminder;
    settings = helpers.settings;
  } catch (error) {
    // Notification context not available, skip tracking
    console.log(
      "Notification context not available, skipping cart abandonment tracking",
    );
    return null;
  }

  useEffect(() => {
    if (
      !settings ||
      !settings.cartAbandonmentEnabled ||
      !scheduleCartAbandonmentReminder
    )
      return;

    const handleCartUpdate = (event: CustomEvent) => {
      const { action, cart } = event.detail;

      if (action === "add" && cart.length > 0) {
        // Clear any existing abandonment timers
        const existingTimers = JSON.parse(
          localStorage.getItem("cartTimers") || "[]",
        );
        existingTimers.forEach((timerId: number) => clearTimeout(timerId));

        // Schedule new abandonment reminder
        const timerId = setTimeout(
          () => {
            const currentCart = JSON.parse(
              localStorage.getItem("ataka-cart") || "[]",
            );
            if (currentCart.length > 0) {
              scheduleCartAbandonmentReminder(currentCart, 30);
            }
          },
          30 * 60 * 1000,
        ); // 30 minutes

        localStorage.setItem("cartTimers", JSON.stringify([timerId]));
      } else if (
        action === "clear" ||
        (action === "remove" && cart.length === 0)
      ) {
        // Clear abandonment timers if cart is empty
        const existingTimers = JSON.parse(
          localStorage.getItem("cartTimers") || "[]",
        );
        existingTimers.forEach((timerId: number) => clearTimeout(timerId));
        localStorage.removeItem("cartTimers");
      }
    };

    // Listen for cart updates
    window.addEventListener("cartUpdated", handleCartUpdate as EventListener);

    // Check for existing cart on mount
    const existingCart = JSON.parse(localStorage.getItem("ataka-cart") || "[]");
    if (existingCart.length > 0) {
      const lastActivity = localStorage.getItem("lastCartActivity");
      const now = Date.now();

      if (lastActivity) {
        const timeSinceLastActivity = now - parseInt(lastActivity);
        const remainingTime = 30 * 60 * 1000 - timeSinceLastActivity; // 30 minutes

        if (remainingTime > 0) {
          const timerId = setTimeout(() => {
            scheduleCartAbandonmentReminder(existingCart, 0);
          }, remainingTime);

          localStorage.setItem("cartTimers", JSON.stringify([timerId]));
        }
      } else {
        // No last activity recorded, schedule for 30 minutes
        const timerId = setTimeout(
          () => {
            scheduleCartAbandonmentReminder(existingCart, 0);
          },
          30 * 60 * 1000,
        );

        localStorage.setItem("cartTimers", JSON.stringify([timerId]));
      }
    }

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate as EventListener,
      );
    };
  }, [scheduleCartAbandonmentReminder, settings.cartAbandonmentEnabled]);

  // Track cart activity
  useEffect(() => {
    const trackActivity = () => {
      localStorage.setItem("lastCartActivity", Date.now().toString());
    };

    // Track user activity
    document.addEventListener("click", trackActivity);
    document.addEventListener("keydown", trackActivity);

    return () => {
      document.removeEventListener("click", trackActivity);
      document.removeEventListener("keydown", trackActivity);
    };
  }, []);

  return null; // This component doesn't render anything
}
