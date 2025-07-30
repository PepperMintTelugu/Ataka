import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Suppress react-beautiful-dnd defaultProps deprecation warning
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    args[0].includes("defaultProps will be removed from memo components")
  ) {
    return; // Suppress this specific warning
  }
  originalConsoleWarn.apply(console, args);
};

createRoot(document.getElementById("root")!).render(<App />);
