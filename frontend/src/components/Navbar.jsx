import React from 'react';

// You can use an icon from a library like react-icons
// import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav className="bg-[#1e1e1e] text-white p-4 font-sans border-b-2 border-gray-600">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Left Side: Brand Name */}
        <div className="text-xl font-bold">
          GlobalTrotter
        </div>

        {/* Middle Button */}
        <div>
          <button className="bg-[#5a4a1d] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-opacity-80 transition-colors">
            Productive Porpoise
          </button>
        </div>

        {/* Right Side: Language and Profile */}
        <div className="flex items-center space-x-4">
          <button className="bg-[#8a2be2] text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-opacity-80 transition-colors">
            Sanskrit
          </button>
          <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center">
            {/* You can place an initial or an icon here */}
            {/* Example with an icon: <FaUserCircle size={24} /> */}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;