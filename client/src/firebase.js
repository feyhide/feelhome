// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Print environment variables to verify their values
console.log('Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
console.log('Firebase Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
console.log('Firebase Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
console.log('Firebase Storage Bucket:', import.meta.env.VITE_FIREBASE_STORAGE_BUCKET);
console.log('Firebase Messaging Sender ID:', import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID);
console.log('Firebase App ID:', import.meta.env.VITE_FIREBASE_APP_ID);
console.log('Firebase Measurement ID:', import.meta.env.VITE_FIREBASE_MEASUREMENT_ID);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Analytics if in a browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  console.log('Firebase Analytics initialized');
}

// Debugging: Print the Firebase configuration to ensure all values are loaded
console.log('Firebase Config:', firebaseConfig);
console.log('Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY);
