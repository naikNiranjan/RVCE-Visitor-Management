import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import Constants from 'expo-constants';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || "AIzaSyA3ysGTUgUrKSTS5XH8Nvb_NlstbSlPHE4",
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || "rv-visitor-management.firebaseapp.com",
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || "rv-visitor-management",
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || "rv-visitor-management.firebasestorage.app",
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || "659878986292",
  appId: Constants.expoConfig?.extra?.firebaseAppId || "1:659878986292:web:10e0f58c20029d16084061",
  measurementId: "G-34Y88G8X56"
};

// Initialize Firebase only if it hasn't been initialized already
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app; 