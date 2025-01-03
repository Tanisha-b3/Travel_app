import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // Correct import for Firestore

const firebaseConfig = {
  apiKey: "AIzaSyChwEu5PVDtn9FZWenmkIbJj71GWPfGUiM",
  authDomain: "tripgenerator-18bf3.firebaseapp.com",
  projectId: "tripgenerator-18bf3",
  storageBucket: "tripgenerator-18bf3.appspot.com",
  messagingSenderId: "620849457540",
  appId: "1:620849457540:web:c8abff464d314577b715d1",
  measurementId: "G-THMJQ9CW2T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  // Correct method name for Firestore
