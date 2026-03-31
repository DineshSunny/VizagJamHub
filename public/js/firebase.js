// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBdBQ7wvLJkeGyMByazMigfDO9MRZEhl0",
  authDomain: "vizagjamhub-d428a.firebaseapp.com",
  projectId: "vizagjamhub-d428a",
  storageBucket: "vizagjamhub-d428a.firebasestorage.app",
  messagingSenderId: "577169499041",
  appId: "1:577169499041:web:2d5ed9a35f62dbe847a1e0",
  measurementId: "G-50M7EK2Y5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);