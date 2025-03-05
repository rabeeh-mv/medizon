// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase config object (Make sure it's correct)
const firebaseConfig = {
  apiKey: "AIzaSyC3rNYDFx3xR_E_GDVdBOtf02vnZxHg7Lw",
  authDomain: "medical-dcd96.firebaseapp.com",
  projectId: "medical-dcd96",
  storageBucket: "medical-dcd96.appspot.com",
  messagingSenderId: "106272272868",
  appId: "1:106272272868:web:ca54148a954bf828ca57f1",
  measurementId: "G-C24S279ER9"
};

// Ensure `app` is initialized before exporting auth and db
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

// const firebaseConfig = {
//   apiKey: "AIzaSyC3rNYDFx3xR_E_GDVdBOtf02vnZxHg7Lw",
//   authDomain: "medical-dcd96.firebaseapp.com",
//   projectId: "medical-dcd96",
//   storageBucket: "medical-dcd96.firebasestorage.app",
//   messagingSenderId: "106272272868",
//   appId: "1:106272272868:web:ca54148a954bf828ca57f1",
//   measurementId: "G-C24S279ER9"
// }