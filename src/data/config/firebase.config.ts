import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyASHt-0Q9eeRC6MrQ5BcD69Vq4cY7xFxf4",
  authDomain: "movan-857e9.firebaseapp.com",
  databaseURL: "https://movan-857e9-default-rtdb.firebaseio.com",
  projectId: "movan-857e9",
  storageBucket: "movan-857e9.firebasestorage.app",
  messagingSenderId: "719398366977",
  appId: "1:719398366977:web:2598c8ad4f199dbffb3500",
  measurementId: "G-0G0MSDHHFV"
};
//mandar para un .env!!!!!!!!!

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
let analytics: Analytics | null = null;

try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn('Firebase Analytics not available in this environment');
}

export { auth, database, analytics };
export default app;