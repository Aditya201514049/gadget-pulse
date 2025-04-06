import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
export function initAdmin() {
  // Check if already initialized
  if (getApps().length === 0) {
    // Get credentials from environment variables
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString()
    );
    
    // Initialize the app
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  }
} 