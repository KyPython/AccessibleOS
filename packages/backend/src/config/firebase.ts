import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebase = () => {
  try {
    if (admin.apps.length === 0) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
      
      if (serviceAccount) {
        // Use service account key from environment variable
        const serviceAccountKey = JSON.parse(serviceAccount);
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountKey),
          projectId: process.env.FIREBASE_PROJECT_ID,
        });
      } else {
        // Use default credentials (for development)
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || 'accessibleos-dev',
        });
      }
      
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    throw error;
  }
};

initializeFirebase();

export const auth = admin.auth();
export const firestore = admin.firestore();
export const messaging = admin.messaging();

export default admin;