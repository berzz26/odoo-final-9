import React from 'react';

const Dashboard = () => {
  return (
    // The main container is set to full screen width and height
    <div className="bg-[#1E212B] min-h-screen w-screen text-[#EAECEE] font-sans">
      
      {/* --- Navbar Section --- */}
      <nav className="bg-[#2D3039] text-white p-4 font-sans border-b-2 border-[#4A4E5A]">
        {/* The container is centered with responsive padding */}
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-xl font-bold">GlobalTrotter</div>
          <div className="flex items-center space-x-4">
            {/* Auth buttons */}
            <button className="bg-[#8338EC] text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-opacity-80 transition-colors">
              SignUp
            </button>
            <button className="bg-[#8338EC] text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-opacity-80 transition-colors">
              Login
            </button>
            {/* Placeholder for a user profile icon */}
            <div className="hidden md:block w-9 h-9 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </nav>
      
      {/* Main content area with responsive padding */}
      <div className="p-4 w-screen md:p-8 space-y-8 container mx-auto">

        {/* --- Banner Section --- */}
        <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-56 md:h-64 flex flex-col items-center justify-center text-center">
          <h2 className="text-3xl md:text-4xl text-gray-400" style={{ fontFamily: '"Caveat", cursive' }}>
            Plan Your Next Adventure
          </h2>
          <p className="text-gray-400 mt-2">Your journey begins here.</p>
        </div>

        {/* --- Filter Bar Section --- */}
        {/* On mobile, filters stack vertically. On medium screens and up, they are in a row. */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <input 
            type="text" 
            placeholder="Search destinations......" 
            className="w-full md:flex-grow bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg p-2 focus:outline-none focus:border-[#8338EC]"
          />
          <button className="w-full md:w-auto bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Group by</button>
          <button className="w-full md:w-auto bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Filter</button>
          <button className="w-full md:w-auto bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Sort by...</button>
        </div>

        {/* --- Regional Selections Section --- */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Popular Regional Selections</h3>
          {/* Responsive grid: 2 cols on mobile, 3 on small screens, 5 on large screens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
          </div>
        </div>
        
        {/* --- Previous Trips Section --- */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Your Previous Trips</h3>
          {/* On mobile, cards stack. On medium screens and up, they are in a row. */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-48 w-full md:w-48"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-48 w-full md:w-48"></div>
          </div>
        </div>

      </div>

      {/* --- Floating Action Button --- */}
      <button className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#8338EC] text-white rounded-full px-6 py-3 shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 flex items-center gap-2">
        <span className="font-semibold text-2xl">+</span>
        <span className="font-semibold">Plan a trip</span>
      </button>


    </div>
  );
};

export default Dashboard;
