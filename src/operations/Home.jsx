import React from 'react';
import { FaSearch, FaUser } from 'react-icons/fa'; // Import search icon

const Home = () => {
  return (
    <div className="font-sans min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Moving Gradient Background */}
      <div className="absolute inset-0 z-0 animate-moving-gradient"></div>

      {/* Admin Login Button (Top-Left) */}
      <div className="absolute top-6 right-6 z-20">
        <button className="flex items-center bg-white text-green-700 px-4 py-2 rounded-lg  shadow-sm hover:bg-green-50 transition bg-opacity- duration-300 border border-green-100">
          <FaUser className="mr-2" />
           Login
        </button>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-2xl relative z-10">
        <h1 className="text-5xl font-bold mb-6 text-white">
          Welcome to <span className="text-green-300">MediZone</span>
        </h1>
        <p className="text-xl text-gray-200 mb-8">
          Your trusted partner in health and wellness. We provide personalized care to keep you and your family healthy.
        </p>
        {/* Search Input Field with Icon Button */}
        <div className="flex items-center justify-center">
          <input
            type="text"
            placeholder="Enter your id "
            className="w-64 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white bg-opacity-20 text-white placeholder-gray-300"
          />
          <button className="bg-green-300 text-white px-6 py-3 rounded-r-lg hover:bg-green-700 transition duration-300 flex items-center">
            <FaSearch className="text-lg" />
          </button>
        </div>
      </section>
      

     {/* Footer */}
     <footer className="mt-16 text-center text-gray-200 relative z-10">
        <p className="text-sm">&copy; 2023 MediZone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;