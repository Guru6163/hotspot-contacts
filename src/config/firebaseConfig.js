import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAobV60b9QdP-s4tR2ya9zP45Y7dELN64M",
    authDomain: "todo-1ab50.firebaseapp.com",
    projectId: "todo-1ab50",
    storageBucket: "todo-1ab50.appspot.com",
    messagingSenderId: "921620333914",
    appId: "1:921620333914:web:e1a607fdead12a99be5f63"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

