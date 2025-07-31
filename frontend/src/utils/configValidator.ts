interface EnvironmentConfig {
  API_URL: string;
  APP_URL: string;
  RAZORPAY_KEY_ID?: string;
  GOOGLE_CLIENT_ID?: string;
  APP_NAME: string;
  ENVIRONMENT: string;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  return {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    APP_URL: import.meta.env.VITE_APP_URL || 'http://localhost:8080',
    RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID,
    GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    APP_NAME: import.meta.env.VITE_APP_NAME || 'Ataka - The Ultimate Bookstore',
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development'
  };
}

export function validateProductionConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const config = getEnvironmentConfig();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required for production
  if (config.ENVIRONMENT === 'production') {
    if (!config.API_URL || config.API_URL.includes('localhost')) {
      errors.push('VITE_API_URL must be set to production backend URL');
    }

    if (!config.APP_URL || config.APP_URL.includes('localhost')) {
      errors.push('VITE_APP_URL must be set to production frontend URL');
    }

    if (!config.RAZORPAY_KEY_ID) {
      warnings.push('VITE_RAZORPAY_KEY_ID not set - payment functionality will be limited');
    }

    if (!config.GOOGLE_CLIENT_ID) {
      warnings.push('VITE_GOOGLE_CLIENT_ID not set - Google authentication will be disabled');
    }
  }

  // Validate URL formats
  try {
    new URL(config.API_URL);
  } catch {
    errors.push('VITE_API_URL is not a valid URL');
  }

  try {
    new URL(config.APP_URL);
  } catch {
    errors.push('VITE_APP_URL is not a valid URL');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function logConfigurationStatus(): void {
  const config = getEnvironmentConfig();
  const validation = validateProductionConfig();

  console.group('🔧 Application Configuration');
  console.log('Environment:', config.ENVIRONMENT);
  console.log('API URL:', config.API_URL);
  console.log('App URL:', config.APP_URL);
  console.log('Razorpay:', config.RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Not configured');
  console.log('Google Auth:', config.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not configured');

  if (validation.errors.length > 0) {
    console.group('❌ Configuration Errors');
    validation.errors.forEach(error => console.error(error));
    console.groupEnd();
  }

  if (validation.warnings.length > 0) {
    console.group('⚠️ Configuration Warnings');
    validation.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }

  if (validation.isValid) {
    console.log('✅ Configuration is valid for deployment');
  } else {
    console.error('❌ Configuration has errors - deployment may fail');
  }

  console.groupEnd();
}

// Auto-validate configuration in development and log status
if (import.meta.env.DEV || import.meta.env.VITE_ENVIRONMENT === 'production') {
  logConfigurationStatus();
}
