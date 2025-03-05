import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Ensure correct import
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Generate or retrieve device ID
  const getDeviceId = () => {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
  };

  // Auto-redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Logging in with:", email, password);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const deviceId = getDeviceId();
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const registeredDevice = userDoc.data().deviceId;

        if (registeredDevice && registeredDevice !== deviceId) {
          setError("You are already logged in on another device.");
          return;
        }
      }

      // Save or update device ID
      await setDoc(userRef, { deviceId }, { merge: true });

      console.log("Login successful:", user);
      navigate("/admin");
    } catch (err) {
      console.error("Login Error:", err.code, err.message);
      setError(err.message);
    }
  };

  return (
    <div className="h-dvh flex">
    <div className="login-form max-w-96 px-10 py-12 m-auto ring-1 ring-btnclr1 isolate aspect-video w-96 backdrop-blur-sm rounded-xl bg-white/40 shadow-lg ring-1 ring-black/5">
      <h1 className="text-3xl font-bold text-btnclr1">Log in</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-btnclr1/10 placeholder-black text-black w-full mt-1.5 mb-1.5 h-10 rounded-lg pl-2.5 pt-1.5 pb-1.5"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="bg-btnclr1/10 placeholder-black text-black w-full mt-1.5 mb-1.5 h-10 rounded-lg pl-2.5 pt-1.5 pb-1.5"
        />
        <button
          type="submit"
          className="text-white font-bold bg-gradient-to-r from-btnclr to-btnclr1 h-12 rounded-xl w-full mt-1.5 hover:shadow-md"
        >
          Login
        </button>
      </form>
      <a href="/"><h6 className="text-center pt-3 text-sm text-blue">Go To Home</h6></a>
    </div>
    </div>
  );
};

export default Login;