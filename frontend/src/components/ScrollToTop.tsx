import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // Don't scroll if there's a hash (e.g., #section-id)
    if (hash) {
      return;
    }

    // Scroll to top when the route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use "instant" for immediate scroll, "smooth" for animated
    });
  }, [pathname, hash, key]);

  return null;
}
