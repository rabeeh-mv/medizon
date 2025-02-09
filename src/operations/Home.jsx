import React, { useState } from 'react';
import { FaSearch, FaUser, FaDna, FaHeartbeat } from 'react-icons/fa';
import { Link, Links } from 'react-router';

const Home = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="font-sans min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-green-500 rounded-full filter blur-[150px] opacity-20 top-1/4 -left-32 md:-left-48 animate-pulse"></div>
        <div className="absolute w-64 md:w-96 h-64 md:h-96 bg-blue-500 rounded-full filter blur-[150px] opacity-20 bottom-1/4 -right-32 md:-right-48 animate-pulse delay-1000"></div>
      </div>

      {/* Floating DNA Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <FaDna
            key={i}
            className="absolute text-green-300 opacity-10 animate-float-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 20}px`,
              animationDelay: `${i * 1.5}s`
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-20">
        <div className="flex items-center">
          <FaHeartbeat className="text-green-400 text-2xl md:text-3xl mr-2" />
          <span className="text-white text-lg md:text-xl font-bold">MediZone</span>
        </div>
        <button  className="flex items-center bg-white/10 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl hover:bg-white/20 transition duration-300 backdrop-blur-sm border border-white/20 text-sm md:text-base">
          <FaUser className="mr-2" />
          {/* <Links> */}
          <a href="/admin">Login</a>
          {/* </Links> */}
        </button>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-3xl relative z-10 transform transition-all duration-500 mt-20 md:mt-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 text-transparent bg-clip-text px-4">
          Welcome to MediZone
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 md:mb-12 leading-relaxed px-4">
          Your intelligent healthcare companion. Experience the future of medical care with advanced AI-driven diagnostics and personalized wellness tracking.
        </p>

        {/* Search Component */}
        <div className={`transform transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''} px-4`}>
          <div className="relative flex items-center justify-center">
            <div className={`absolute inset-0 bg-green-400 rounded-2xl opacity-20 blur-lg transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}></div>
            <input
              type="text"
              placeholder="Enter your ID..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full md:w-96 px-4 md:px-6 py-3 md:py-4 rounded-l-2xl border-0 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm text-sm md:text-base"
            />
            <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-r-2xl hover:opacity-90 transition duration-300 flex items-center group">
              <FaSearch className="text-base md:text-lg group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-12 md:mt-16 px-4">
          {['AI Diagnostics', 'Real-time Monitoring', 'Secure Records'].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/10 hover:border-green-400/30 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="text-green-400 mb-3 md:mb-4">
                <FaHeartbeat className="text-xl md:text-2xl mx-auto" />
              </div>
              <h3 className="text-white text-base md:text-lg font-semibold mb-2">{feature}</h3>
              <p className="text-gray-400 text-xs md:text-sm">Experience the next generation of healthcare technology.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-center text-gray-400 backdrop-blur-sm bg-black/20">
        <p className="text-xs md:text-sm">
          © {new Date().getFullYear()} MediZone. Advancing Healthcare Through Technology.
        </p>
      </footer>
    </div>
  );
};

// Add these custom animations to your global CSS or Tailwind config
const styles = `
@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.animate-float-slow {
  animation: float-slow 6s infinite ease-in-out;
}
`;

export default Home;