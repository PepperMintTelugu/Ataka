// Production-ready integration configurations for Ataka

// Razorpay Payment Gateway Integration
export const razorpayConfig = {
  keyId: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxxxx",
  keySecret: process.env.REACT_APP_RAZORPAY_KEY_SECRET || "xxxxxxxxxx",
  currency: "INR",
  company: "Ataka - The Ultimate Bookstore",
  description: "Telugu Literature Purchase",
  image: "https://cdn.builder.io/api/v1/image/assets%2Feb6a9d54076e488bac688c857f8339b7%2Ffb10c84215264db69542d6861e716ef1?format=webp&width=200",
  prefill: {
    email: "",
    contact: "",
    name: ""
  },
  theme: {
    color: "#6366f1"
  }
};

// Initialize Razorpay Payment
export const initializeRazorpayPayment = (orderData: {
  amount: number;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: (response: any) => void;
  onFailure: (error: any) => void;
}) => {
  const options = {
    key: razorpayConfig.keyId,
    amount: orderData.amount * 100, // Convert to paise
    currency: razorpayConfig.currency,
    name: razorpayConfig.company,
    description: razorpayConfig.description,
    image: razorpayConfig.image,
    order_id: orderData.orderId,
    handler: (response: any) => {
      // Payment success callback
      orderData.onSuccess(response);
    },
    prefill: {
      name: orderData.customerInfo.name,
      email: orderData.customerInfo.email,
      contact: orderData.customerInfo.phone,
    },
    theme: razorpayConfig.theme,
    modal: {
      ondismiss: () => {
        orderData.onFailure({ error: "Payment cancelled by user" });
      }
    }
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};

// Shiprocket API Integration
export const shiprocketConfig = {
  apiUrl: process.env.REACT_APP_SHIPROCKET_API_URL || "https://apiv2.shiprocket.in/v1/external",
  email: process.env.REACT_APP_SHIPROCKET_EMAIL || "your-email@ataka.com",
  password: process.env.REACT_APP_SHIPROCKET_PASSWORD || "your-password",
  token: process.env.REACT_APP_SHIPROCKET_TOKEN || ""
};

// Create Shiprocket Order
export const createShiprocketOrder = async (orderData: {
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    name: string;
    sku: string;
    units: number;
    selling_price: number;
    discount: number;
    tax: number;
    hsn: number;
  }>;
  paymentMethod: string;
  subTotal: number;
}) => {
  try {
    const shiprocketOrder = {
      order_id: orderData.orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary",
      billing_customer_name: orderData.customerInfo.name,
      billing_last_name: "",
      billing_address: orderData.customerInfo.address,
      billing_city: orderData.customerInfo.city,
      billing_pincode: orderData.customerInfo.pincode,
      billing_state: orderData.customerInfo.state,
      billing_country: "India",
      billing_email: orderData.customerInfo.email,
      billing_phone: orderData.customerInfo.phone,
      shipping_is_billing: true,
      order_items: orderData.items,
      payment_method: orderData.paymentMethod,
      sub_total: orderData.subTotal,
      length: 15,
      breadth: 10,
      height: 5,
      weight: 0.5
    };

    const response = await fetch(`${shiprocketConfig.apiUrl}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${shiprocketConfig.token}`
      },
      body: JSON.stringify(shiprocketOrder)
    });

    return await response.json();
  } catch (error) {
    console.error('Shiprocket order creation failed:', error);
    throw error;
  }
};

// Track Shiprocket Order
export const trackShiprocketOrder = async (orderId: string) => {
  try {
    const response = await fetch(`${shiprocketConfig.apiUrl}/courier/track/awb/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${shiprocketConfig.token}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Order tracking failed:', error);
    throw error;
  }
};

// Google OAuth Integration
export const googleAuthConfig = {
  clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com",
  redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback",
  scope: "openid email profile"
};

// Initialize Google Sign-In
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: googleAuthConfig.clientId,
        callback: (response: any) => {
          resolve(response);
        },
        auto_select: false,
        cancel_on_tap_outside: true
      });
    } else {
      reject(new Error('Google API not loaded'));
    }
  });
};

// Handle Google Sign-In Response
export const handleGoogleSignIn = async (credential: string) => {
  try {
    // Send credential to your backend for verification
    const response = await fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ credential })
    });

    return await response.json();
  } catch (error) {
    console.error('Google sign-in failed:', error);
    throw error;
  }
};

// Utility function to load external scripts
export const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Initialize all integrations
export const initializeIntegrations = async () => {
  try {
    // Load Razorpay script
    const razorpayLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!razorpayLoaded) {
      console.error('Failed to load Razorpay script');
    }

    // Load Google API script
    const googleLoaded = await loadScript('https://accounts.google.com/gsi/client');
    if (!googleLoaded) {
      console.error('Failed to load Google API script');
    }

    // Initialize Google Auth
    if (googleLoaded) {
      await initializeGoogleAuth();
    }

    return {
      razorpay: razorpayLoaded,
      google: googleLoaded
    };
  } catch (error) {
    console.error('Integration initialization failed:', error);
    return {
      razorpay: false,
      google: false
    };
  }
};

// Environment validation
export const validateIntegrationConfig = () => {
  const issues = [];

  if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
    issues.push('REACT_APP_RAZORPAY_KEY_ID is not configured');
  }

  if (!process.env.REACT_APP_SHIPROCKET_TOKEN) {
    issues.push('REACT_APP_SHIPROCKET_TOKEN is not configured');
  }

  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    issues.push('REACT_APP_GOOGLE_CLIENT_ID is not configured');
  }

  if (issues.length > 0) {
    console.warn('Integration configuration issues:', issues);
  }

  return issues.length === 0;
};
