import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3hkX__gpXWMM-FoWBF21j9VHI8F3B-8E",
  authDomain: "habits-tracker-dd402.firebaseapp.com",
  projectId: "habits-tracker-dd402",
  storageBucket: "habits-tracker-dd402.firebasestorage.app",
  messagingSenderId: "145489464484",
  appId: "1:145489464484:web:c22e2f094ae9ed8a36aa31",
  measurementId: "G-123PLYWH72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth };
