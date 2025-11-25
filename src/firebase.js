import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCVUq6dL8kqxQLVzZ8VJ_5jKONjmQegdkU",
  authDomain: "popcorn-browse.firebaseapp.com",
  projectId: "popcorn-browse",
  storageBucket: "popcorn-browse.firebasestorage.app",
  messagingSenderId: "714457412646",
  appId: "1:714457412646:web:db6687b4f36f9ad687e2e7",
  measurementId: "G-MJCHJEEBTT"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export { signInWithPopup, signOut, onAuthStateChanged };
export { doc, setDoc, deleteDoc, getDoc, collection, getDocs };
