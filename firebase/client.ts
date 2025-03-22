// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAykuxiY_g-YMCERCtD21fEcL6bUcbWThs",
  authDomain: "interviewprep-b67f0.firebaseapp.com",
  projectId: "interviewprep-b67f0",
  storageBucket: "interviewprep-b67f0.firebasestorage.app",
  messagingSenderId: "199001032609",
  appId: "1:199001032609:web:5e1678e6e0bac241246de0",
  measurementId: "G-FRT5Z4K4W2",
};

// Initialize Firebase only once
const app = !getApps()?.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
