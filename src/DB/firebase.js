// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo2GYeJW0gsKZ24A1TYO1TjIVft302Z9E",
  authDomain: "testgram-461e2.firebaseapp.com",
  databaseURL:
    "https://testgram-461e2-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "testgram-461e2",
  storageBucket: "testgram-461e2.appspot.com",
  messagingSenderId: "502769179065",
  appId: "1:502769179065:web:5080e0ebe84452a15dfe68",
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
const dbFire = getFirestore(firebaseApp);
