// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// import { getAuth } from "firebase/auth";

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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

export { auth, db, app };
  