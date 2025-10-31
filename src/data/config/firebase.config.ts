// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASHt-0Q9eeRC6MrQ5BcD69Vq4cY7xFxf4",
  authDomain: "movan-857e9.firebaseapp.com",
  databaseURL: "https://movan-857e9-default-rtdb.firebaseio.com",
  projectId: "movan-857e9",
  storageBucket: "movan-857e9.firebasestorage.app",
  messagingSenderId: "719398366977",
  appId: "1:719398366977:web:3b77813a5a10dd20fb3500",
  measurementId: "G-KFN6ETSRTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
// Note: For React Native with Expo, we use the web SDK
// Session persistence is handled automatically by Firebase
const auth = getAuth(app);
const database = getDatabase(app);

// Analytics is optional and only works in web/production builds
// It may not work in Expo Go, but is available for web deployment
let analytics: Analytics | null = null;
try {
  // Analytics may not be available in React Native environment
  analytics = getAnalytics(app);
} catch (error) {
  // Analytics not supported in this environment (e.g., React Native/Expo Go)
  console.warn('Firebase Analytics not available in this environment');
}

export { auth, database, analytics };
export default app;