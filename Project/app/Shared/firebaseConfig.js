// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDXp5GeK4_TYYqU3NdE7dIhivxgDv9BL2U",
  authDomain: "pinterest-clone-7b751.firebaseapp.com",
  projectId: "pinterest-clone-7b751",
  storageBucket: "pinterest-clone-7b751.appspot.com",
  messagingSenderId: "138209400644",
  appId: "1:138209400644:web:eeb3077cb9f8c012a72911",
  measurementId: "G-QKXL31ZCKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


 
export default app;