import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCTCVV1goaiI5ArrcZmWo2bW1mpzcNBCiw',
  authDomain: 'workout-app-fb622.firebaseapp.com',
  projectId: 'workout-app-fb622',
  storageBucket: 'workout-app-fb622.firebasestorage.app',
  messagingSenderId: '703130477762',
  appId: '1:703130477762:web:961cd7936329b68b14475b',
  measurementId: 'G-P3EYDQ00JN',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// inloggning och autentisering
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// databasen
export const db = getFirestore(app);
