// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDrp1aUPwqSuBzyDeuJ0g851xs_z21tr3o",
  authDomain: "song-book-e72fb.firebaseapp.com",
  projectId: "song-book-e72fb",
  storageBucket: "song-book-e72fb.appspot.com",
  messagingSenderId: "619005878598",
  appId: "1:619005878598:web:21507b4a3f0f19cbe38547",
  measurementId: "G-NCD81L11C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);