import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Paste your config here from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDY0Px8cP1k32EKW7pYJxs9MsmjBrQL68M",
  authDomain: "count-down-timer-6e91d.firebaseapp.com",
  projectId: "count-down-timer-6e91d",
  storageBucket: "count-down-timer-6e91d.firebasestorage.app",
  messagingSenderId: "131009861361",
  appId: "1:131009861361:web:1d5d66bf4734c832763b50"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;