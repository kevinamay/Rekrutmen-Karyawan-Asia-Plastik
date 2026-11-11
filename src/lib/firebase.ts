import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDD8yEaEJpOrsZp2mpMUUOZXRwWloCVU80",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "rekrutmenasia.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "rekrutmenasia",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "rekrutmenasia.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "182410685917",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:182410685917:web:46bd24f070c078e7a15a34"
};

const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || "default";

// Initialize Firebase once
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app, databaseId);

export { app, auth, db, firebaseConfig };

