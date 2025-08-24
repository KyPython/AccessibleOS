/**
 * Build and deployment configuration for AccessibleOS
 */

export interface BuildConfig {
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  firebaseConfig: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  features: {
    analytics: boolean;
    monitoring: boolean;
    debugging: boolean;
    serviceWorker: boolean;
  };
  optimization: {
    bundleSplitting: boolean;
    treeshaking: boolean;
    minification: boolean;
    compression: boolean;
  };
}

const configs: Record<string, BuildConfig> = {
  development: {
    environment: 'development',
    apiUrl: 'http://localhost:3001/api',
    firebaseConfig: {
      apiKey: process.env.VITE_FIREBASE_API_KEY || 'demo-key',
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || 'accessibleos-dev.firebaseapp.com',
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'accessibleos-dev',
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'accessibleos-dev.appspot.com',
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
      appId: process.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef'
    },
    features: {
      analytics: false,
      monitoring: true,
      debugging: true,
      serviceWorker: false
    },
    optimization: {
      bundleSplitting: false,
      treeshaking: false,
      minification: false,
      compression: false
    }
  },
  staging: {
    environment: 'staging',
    apiUrl: 'https://api-staging.accessibleos.com/api',
    firebaseConfig: {
      apiKey: process.env.VITE_FIREBASE_API_KEY || '',
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.VITE_FIREBASE_APP_ID || ''
    },
    features: {
      analytics: true,
      monitoring: true,
      debugging: true,
      serviceWorker: true
    },
    optimization: {
      bundleSplitting: true,
      treeshaking: true,
      minification: true,
      compression: true
    }
  },
  production: {
    environment: 'production',
    apiUrl: 'https://api.accessibleos.com/api',
    firebaseConfig: {
      apiKey: process.env.VITE_FIREBASE_API_KEY || '',
      authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: process.env.VITE_FIREBASE_APP_ID || ''
    },
    features: {
      analytics: true,
      monitoring: true,
      debugging: false,
      serviceWorker: true
    },
    optimization: {
      bundleSplitting: true,
      treeshaking: true,
      minification: true,
      compression: true
    }
  }
};

export const getBuildConfig = (): BuildConfig => {
  const env = process.env.NODE_ENV || 'development';
  return configs[env] || configs.development;
};

export const config = getBuildConfig();