// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRPLC-BBblrevbe8fRKT2Ftnq9RD3UAz4",
  authDomain: "nwitter-reloaded-c545b.firebaseapp.com",
  projectId: "nwitter-reloaded-c545b",
  storageBucket: "nwitter-reloaded-c545b.appspot.com",
  messagingSenderId: "47334525066",
  appId: "1:47334525066:web:859b72edc5be1262f4c573"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app)

export const db = getFirestore(app)