// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// import { initializeApp, applicationDefault, cert } from 'firebase/app';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqWw0yjC9gk6C2SC_HZQffUZOXQydgC0I",
  authDomain: "project2-pokem-bootcamp.firebaseapp.com",
  databaseURL:
    "https://project2-pokem-bootcamp-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "project2-pokem-bootcamp",
  storageBucket: "project2-pokem-bootcamp.appspot.com",
  messagingSenderId: "1036526742191",
  appId: "1:1036526742191:web:883ea8e38296fa10f2425a",
};

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// create auth context

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the database service and export the reference for other modules
export const auth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
export const firestore = getFirestore(firebaseApp);
