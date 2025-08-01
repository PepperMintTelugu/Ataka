
// Re-export all API modules for easier imports
export * from './medusa/medusa-client';
export * from './payment/payment-shipping';
export * from './notifications/push-notifications';
export * from './backend';

// Import and re-export default
import backend from './backend';
export default backend;
