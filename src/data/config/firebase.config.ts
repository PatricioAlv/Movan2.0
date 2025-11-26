import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics, Analytics, isSupported } from 'firebase/analytics';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Inicializar Auth con persistencia en AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const database = getDatabase(app);
let analytics: Analytics | null = null;

// Inicializar Analytics solo si está soportado
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(() => {
  console.log('Firebase Analytics no está disponible en este entorno');
});

export { auth, database, analytics };
export default app;