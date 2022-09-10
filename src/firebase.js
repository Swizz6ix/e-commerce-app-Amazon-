import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBRJ4stu66sbRK1NzrdVjOVLLKmWOQVxeM",
  authDomain: "e-commerce-app-e5d1a.firebaseapp.com",
  projectId: "e-commerce-app-e5d1a",
  storageBucket: "e-commerce-app-e5d1a.appspot.com",
  messagingSenderId: "203130625043",
  appId: "1:203130625043:web:d13d961fcc7d1f4a4e73e6",
  measurementId: "G-44RW3TQND4"
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)

export {auth};
export default db;