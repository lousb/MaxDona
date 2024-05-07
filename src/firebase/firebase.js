import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "maxdona-840c5.firebaseapp.com",
    databaseURL: "https://maxdona-840c5-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "maxdona-840c5",
    storageBucket: "maxdona-840c5.appspot.com",
    messagingSenderId: "310610481612",
    appId: "1:310610481612:web:06100914213976eea68d69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);