import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SignUp from "./SignUp";

const Logouting = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign out
      localStorage.removeItem("deviceId"); // Remove stored device ID
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <>
    <button
      onClick={handleLogout}
      className="text-white font-bold bg-red-500 hover:bg-red-600 h-12 rounded-xl px-6"
    >
      Logout
    </button>
    </>
  );
};

export default Logouting;
