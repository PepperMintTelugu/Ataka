
/**
 * Backend API service module
 * Provides integration with all backend services including payment, shipping, and notifications
 */

import { razorpay, shiprocket, createIntegratedOrder } from './payment/payment-shipping';
import pushNotifications from './notifications/push-notifications';

// Export all backend services in a single module
export const backend = {
  // Payment integration
  payment: {
    razorpay,
    createOrder: razorpay.createOrder,
    checkPaymentStatus: razorpay.getPaymentStatus,
    refundPayment: razorpay.refundPayment,
  },
  
  // Shipping integration
  shipping: {
    shiprocket,
    createShipment: shiprocket.createShipment,
    trackShipment: shiprocket.getShipmentStatus, 
    cancelShipment: shiprocket.cancelShipment,
  },
  
  // Push notifications
  notifications: pushNotifications,
  
  // Combined operations
  orders: {
    createOrder: createIntegratedOrder,
  },
  
  // Initialize all services
  initialize: (config?: {
    razorpayKey?: string,
    shiprocketToken?: string,
    notificationConfig?: {
      provider: 'fcm' | 'onesignal' | 'custom',
      apiKey?: string,
      appId?: string
    }
  }) => {
    console.log('Initializing backend services');
    
    // Initialize push notifications if config provided
    if (config?.notificationConfig) {
      pushNotifications.initialize(config.notificationConfig);
    }
    
    return {
      success: true,
      message: 'Backend services initialized successfully'
    };
  }
};

// Default export for easier imports
export default backend;
