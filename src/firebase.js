// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3rNYDFx3xR_E_GDVdBOtf02vnZxHg7Lw",
  authDomain: "medical-dcd96.firebaseapp.com",
  projectId: "medical-dcd96",
  storageBucket: "medical-dcd96.firebasestorage.app",
  messagingSenderId: "106272272868",
  appId: "1:106272272868:web:ca54148a954bf828ca57f1",
  measurementId: "G-C24S279ER9"
}
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCWs7gNJHvy5-I1yzFnPkzCLxI7ZIjMgV4",
//   authDomain: "sample-fc1ba.firebaseapp.com",
//   projectId: "sample-fc1ba",
//   storageBucket: "sample-fc1ba.firebasestorage.app",
//   messagingSenderId: "1016573512316",
//   appId: "1:1016573512316:web:9a874d60e9cad0cb5f97f9",
//   measurementId: "G-YZHZ9HRG4L"
// };