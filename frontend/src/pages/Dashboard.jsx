import React from 'react';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const handleNewTripClick = () => {
    navigate('/newtrip');
  };

  return (
    <div className="bg-[#FCEFCB] min-h-screen w-screen text-[#EAECEE] font-sans">

      <div className="p-4 md:p-8 space-y-8 container mx-auto">

        {/* Banner Section */}
        <div className="relative border-2 border-[#4A4E5A] rounded-lg h-56 md:h-64 overflow-hidden flex flex-col items-center justify-center text-center">

          <div
            className="absolute top-0 left-0 w-full h-full bg-center bg-cover blur-sm"
            style={{ backgroundImage: 'url("./public/dashboard.jpg")' }}
          ></div>


          <h2 className="text-3xl md:text-4xl text-black relative z-10" style={{ fontFamily: '"Caveat", cursive', fontSize: '3.5rem' }}>
            Plan Your Next Adventure
          </h2>
          <p className="text-black relative z-10, italic">Your journey begins here.</p>
        </div>

        {/* --- Filter Bar Section --- */}
        <div className="flex flex-col md:flex-row items-center gap-4 text-black">
          <input
            type="text"
            placeholder="Search destinations......"
            className="w-50 md:flex-grow !bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg p-2 focus:outline-none focus:border-[#8338EC]"
          />
          <button className="w-full h-15 md:w-auto !bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Group by</button>
          <button className="w-full h-15 md:w-auto !bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Filter</button>
          <button className="w-full h-15 md:w-auto !bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Sort by...</button>
        </div>

        <div>
          <h3 className="text-2xl text-black font-semibold mb-4 ">Popular Regional Selections</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
          </div>
        </div>


        <div>
          <h3 className="text-2xl text-black font-semibold mb-4">Your Previous Trips</h3>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg h-48 w-full md:w-48"></div>
            <div className="bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg h-48 w-full md:w-48"></div>
          </div>
        </div>

      </div>


      <button
        onClick={handleNewTripClick}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#8338EC] text-white rounded-full px-6 py-3 shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105 flex items-center gap-2"
      >
        <span className="font-semibold text-2xl">+</span>
        <span className="font-semibold">Plan a trip</span>
      </button>

    </div>
  );
};

export default Dashboard;