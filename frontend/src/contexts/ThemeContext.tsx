import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeSettings {
  brand: {
    name: string;
    nameTelugu: string;
    logo: string;
    favicon: string;
    tagline: string;
    taglineTelugu: string;
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  buttons: {
    addToCart: {
      backgroundColor: string;
      textColor: string;
      hoverColor: string;
      borderRadius: string;
    };
    buyNow: {
      backgroundColor: string;
      textColor: string;
      hoverColor: string;
      borderRadius: string;
    };
    wishlist: {
      backgroundColor: string;
      textColor: string;
      hoverColor: string;
      borderRadius: string;
    };
  };
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetToDefault: () => void;
  isLoading: boolean;
}

const defaultSettings: ThemeSettings = {
  brand: {
    name: "TeluguBooks",
    nameTelugu: "తెలుగు పుస్తకాలు",
    logo: "/api/placeholder/200/80",
    favicon: "/favicon.ico",
    tagline: "Preserving and promoting Telugu literature",
    taglineTelugu: "తెలుగు సాహిత్య ప్రేమికుల కోసం",
  },
  theme: {
    primary: "#ed7611",
    secondary: "#0ea5e9",
    accent: "#f19334",
    background: "#ffffff",
    text: "#1f2937",
    muted: "#6b7280",
  },
  buttons: {
    addToCart: {
      backgroundColor: "#ed7611",
      textColor: "#ffffff",
      hoverColor: "#de5d07",
      borderRadius: "0.5rem",
    },
    buyNow: {
      backgroundColor: "#0ea5e9",
      textColor: "#ffffff",
      hoverColor: "#0284c7",
      borderRadius: "0.5rem",
    },
    wishlist: {
      backgroundColor: "#ffffff",
      textColor: "#ef4444",
      hoverColor: "#fef2f2",
      borderRadius: "0.5rem",
    },
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from API on mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Apply CSS custom properties when settings change
  useEffect(() => {
    applyThemeToDOM();
  }, [settings]);

  const loadSettings = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll check localStorage for saved settings
      const savedSettings = localStorage.getItem("telugu-books-theme");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load theme settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    const updatedSettings = {
      ...settings,
      ...newSettings,
    };
    setSettings(updatedSettings);

    // Save to localStorage (in real app, this would also save to API)
    localStorage.setItem("telugu-books-theme", JSON.stringify(updatedSettings));
  };

  const resetToDefault = () => {
    setSettings(defaultSettings);
    localStorage.removeItem("telugu-books-theme");
  };

  const applyThemeToDOM = () => {
    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty("--color-primary", settings.theme.primary);
    root.style.setProperty("--color-secondary", settings.theme.secondary);
    root.style.setProperty("--color-accent", settings.theme.accent);
    root.style.setProperty("--color-background", settings.theme.background);
    root.style.setProperty("--color-text", settings.theme.text);
    root.style.setProperty("--color-muted", settings.theme.muted);

    // Apply button styles
    root.style.setProperty(
      "--btn-add-to-cart-bg",
      settings.buttons.addToCart.backgroundColor,
    );
    root.style.setProperty(
      "--btn-add-to-cart-text",
      settings.buttons.addToCart.textColor,
    );
    root.style.setProperty(
      "--btn-add-to-cart-hover",
      settings.buttons.addToCart.hoverColor,
    );

    root.style.setProperty(
      "--btn-buy-now-bg",
      settings.buttons.buyNow.backgroundColor,
    );
    root.style.setProperty(
      "--btn-buy-now-text",
      settings.buttons.buyNow.textColor,
    );
    root.style.setProperty(
      "--btn-buy-now-hover",
      settings.buttons.buyNow.hoverColor,
    );

    root.style.setProperty(
      "--btn-wishlist-bg",
      settings.buttons.wishlist.backgroundColor,
    );
    root.style.setProperty(
      "--btn-wishlist-text",
      settings.buttons.wishlist.textColor,
    );
    root.style.setProperty(
      "--btn-wishlist-hover",
      settings.buttons.wishlist.hoverColor,
    );

    // Update favicon
    const favicon = document.querySelector(
      'link[rel="icon"]',
    ) as HTMLLinkElement;
    if (favicon) {
      favicon.href = settings.brand.favicon;
    }

    // Update page title
    document.title = `${settings.brand.name} - ${settings.brand.tagline}`;
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        resetToDefault,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Custom hook for branded components
export function useBrandedComponents() {
  const { settings } = useTheme();

  const BrandedButton = ({
    variant = "addToCart",
    children,
    className = "",
    ...props
  }: {
    variant?: "addToCart" | "buyNow" | "wishlist";
    children: React.ReactNode;
    className?: string;
    [key: string]: any;
  }) => {
    const buttonStyles = settings.buttons[variant];

    return (
      <button
        className={`inline-flex items-center justify-center font-medium transition-colors ${className}`}
        style={{
          backgroundColor: buttonStyles.backgroundColor,
          color: buttonStyles.textColor,
          borderRadius: buttonStyles.borderRadius,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = buttonStyles.hoverColor;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = buttonStyles.backgroundColor;
        }}
        {...props}
      >
        {children}
      </button>
    );
  };

  const BrandLogo = ({
    className = "",
    showText = true,
  }: {
    className?: string;
    showText?: boolean;
  }) => (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img
        src={settings.brand.logo}
        alt={settings.brand.name}
        className="h-8 w-auto"
        onError={(e) => {
          // Fallback to default logo if custom logo fails to load
          (e.target as HTMLImageElement).src = "/api/placeholder/200/80";
        }}
      />
      {showText && (
        <div className="flex flex-col">
          <span
            className="text-xl font-bold"
            style={{ color: settings.theme.primary }}
          >
            {settings.brand.name}
          </span>
          <span
            className="text-xs telugu-text"
            style={{ color: settings.theme.muted }}
          >
            {settings.brand.nameTelugu}
          </span>
        </div>
      )}
    </div>
  );

  return {
    BrandedButton,
    BrandLogo,
  };
}
