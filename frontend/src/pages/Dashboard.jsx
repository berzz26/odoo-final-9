import React from 'react';

const Dashboard = () => {
  return (
    // THEME UPDATE: Main background and text colors changed
    <div className="bg-[#1E212B] min-h-screen text-[#EAECEE] font-sans">
      
      {/* --- Navbar Section --- */}
      {/* THEME UPDATE: Surface and border colors changed */}
      <nav className="bg-[#2D3039] text-white p-4 font-sans border-b-2 border-[#4A4E5A]">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">GlobalTrotter</div>
          <div className="flex items-center space-x-4">
            {/* THEME UPDATE: Unified accent color */}
            <button className="bg-[#8338EC] text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-opacity-80 transition-colors">
              Sanskrit
            </button>
            <div className="w-9 h-9 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </nav>
      
      <div className="p-4 md:p-8 space-y-8">

        {/* --- Banner Section --- */}
        {/* THEME UPDATE: Surface and border colors changed */}
        <div className="relative bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-64 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl text-gray-400" style={{ fontFamily: '"Caveat", cursive' }}>
            Banner Image
          </h2>
          <div className="mt-4">
            {/* THEME UPDATE: Unified accent color */}
            <span className="bg-[#8338EC] text-white px-4 py-1 rounded-full text-sm font-semibold">
              Busy Caterpillar
            </span>
          </div>
          <svg className="absolute text-[#8338EC] w-8 h-8 bottom-4 left-1/2 transform -translate-x-1/2 translate-y-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>

        {/* --- Filter Bar Section --- */}
        <div className="relative flex items-center gap-4 mt-8">
          {/* THEME UPDATE: Surface, border, and focus colors changed */}
          <input 
            type="text" 
            placeholder="Search bar ......" 
            className="flex-grow bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg p-2 focus:outline-none focus:border-[#8338EC]"
          />
          <button className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Group by</button>
          <button className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Filter</button>
          <button className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-400">Sort by...</button>
          {/* THEME UPDATE: Unified accent color */}
          <span className="absolute -top-6 left-20 bg-[#8338EC] text-white px-3 py-1 text-sm rounded-full font-semibold">
            Cheerful Hare
          </span>
        </div>

        {/* --- Regional Selections Section --- */}
        <div className="relative">
          <h3 className="text-2xl font-semibold mb-4">Shark, Regional Selections</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
            <div className="relative">
              <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-32 w-full"></div>
              <svg className="absolute text-[#8338EC] w-8 h-8 -top-2 -right-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 12h14" /></svg>
              {/* THEME UPDATE: Unified accent color */}
              <span className="absolute -bottom-5 right-0 bg-[#8338EC] text-white px-3 py-1 text-sm rounded-full font-semibold whitespace-nowrap">
                Hiren Sarvaiya
              </span>
            </div>
          </div>
        </div>
        
        {/* --- Previous Trips Section --- */}
        <div className="relative">
          <h3 className="text-2xl font-semibold mb-4">Previous Trips</h3>
          <div className="flex gap-6">
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-48 w-40"></div>
            <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg h-48 w-40"></div>
          </div>
          {/* THEME UPDATE: All tags now use the unified accent color */}
          <span className="absolute top-16 left-24 bg-[#8338EC] text-white px-3 py-1 text-sm rounded-full font-semibold whitespace-nowrap">
            Authentic Hornet
          </span>
          <span className="absolute top-32 left-8 bg-[#8338EC] text-white px-3 py-1 text-sm rounded-full font-semibold whitespace-nowrap">
            Green Hippopotamus
          </span>
          <span className="absolute top-52 left-40 bg-[#8338EC] text-white px-3 py-1 text-sm rounded-full font-semibold whitespace-nowrap">
            Accomplished Jaguar
          </span>
        </div>

      </div>

      {/* --- Floating Action Button --- */}
      {/* THEME UPDATE: Surface and border colors changed */}
      <button className="fixed bottom-8 right-8 bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 flex items-center gap-2 hover:border-[#EAECEE] transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
        Plan a trip
      </button>

    </div>
  );
};

export default Dashboard;