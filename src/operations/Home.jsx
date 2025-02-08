import React, { useState } from 'react';
import { FaSearch, FaUser, FaDna, FaHeartbeat } from 'react-icons/fa';

const Home = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="font-sans min-h-screen flex flex-col justify-center items-center px-4 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-96 h-96 bg-green-500 rounded-full filter blur-[150px] opacity-20 top-1/4 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full filter blur-[150px] opacity-20 bottom-1/4 -right-48 animate-pulse delay-1000"></div>
      </div>

      {/* Floating DNA Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <FaDna
            key={i}
            className={`absolute text-green-300 opacity-10 animate-float-slow`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 30 + 20}px`,
              animationDelay: `${i * 1.5}s`
            }}
          />
        ))}
      </div>

      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
        <div className="flex items-center">
          <FaHeartbeat className="text-green-400 text-3xl mr-2" />
          <span className="text-white text-xl font-bold">MediZone</span>
        </div>
        <button className="flex items-center bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition duration-300 backdrop-blur-sm border border-white/20">
          <FaUser className="mr-2" />
          Login
        </button>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-3xl relative z-10 transform transition-all duration-500">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 text-transparent bg-clip-text">
          Welcome to MediZone
        </h1>
        <p className="text-xl text-gray-300 mb-12 leading-relaxed">
          Your intelligent healthcare companion. Experience the future of medical care with advanced AI-driven diagnostics and personalized wellness tracking.
        </p>

        {/* Search Component */}
        <div className={`transform transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}>
          <div className="relative flex items-center justify-center">
            <div className={`absolute inset-0 bg-green-400 rounded-2xl opacity-20 blur-lg transition-all duration-500 ${isSearchFocused ? 'scale-105' : ''}`}></div>
            <input
              type="text"
              placeholder="Enter your ID to access your medical records..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-96 px-6 py-4 rounded-l-2xl border-0 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/10 text-white placeholder-gray-400 backdrop-blur-sm"
            />
            <button className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-8 py-4 rounded-r-2xl hover:opacity-90 transition duration-300 flex items-center group">
              <FaSearch className="text-lg group-hover:scale-110 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {['AI Diagnostics', 'Real-time Monitoring', 'Secure Records'].map((feature, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-400/30 transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className="text-green-400 mb-4">
                <FaHeartbeat className="text-2xl mx-auto" />
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">{feature}</h3>
              <p className="text-gray-400 text-sm">Experience the next generation of healthcare technology.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-400 backdrop-blur-sm bg-black/20">
        <p className="text-sm">
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