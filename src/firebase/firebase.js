import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKmIbrvoFtccYQvUQu3u6gSltSkzRr8wo",
  authDomain: "foundatcvv.firebaseapp.com",
  projectId: "foundatcvv",
  storageBucket: "foundatcvv.firebasestorage.app",
  messagingSenderId: "82319851757",
  appId: "1:82319851757:web:2468b6eb1483d82617cce4",
  measurementId: "G-BGZY3SQ28P"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

