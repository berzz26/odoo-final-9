import React, { useState, useEffect, useMemo } from 'react';

const TripCard = ({ trip }) => {

  const formattedStartDate = new Date(trip.startDate).toLocaleDateString();
  const formattedEndDate = new Date(trip.endDate).toLocaleDateString();

  return (
    <div className="bg-[#2D3039] border-2 border-[#4A4E5A] rounded-lg p-6 text-left">
      <h3 className="text-xl font-bold text-white mb-2">{trip.name}</h3>
      <p className="text-gray-400">{trip.description || 'No description available.'}</p>
      <div className="text-sm text-gray-500 mt-4">
        <span>{formattedStartDate}</span> - <span>{formattedEndDate}</span>
      </div>
    </div>
  );
};


const TripListing = () => {

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Retrieve the auth token from localStorage
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authorization token not found. Please log in.');
        }

        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trips`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trips.');
        }

        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []); // The empty dependency array ensures this runs only once

  // Categorize trips based on their dates
  const categorizedTrips = useMemo(() => {
    const now = new Date();
    const ongoing = [];
    const upcoming = [];
    const completed = [];

    trips.forEach(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);

      if (endDate < now) {
        completed.push(trip);
      } else if (startDate > now) {
        upcoming.push(trip);
      } else {
        ongoing.push(trip);
      }
    });

    return { ongoing, upcoming, completed };
  }, [trips]);

  // Show a loading message while fetching data
  if (loading) {
    return <div className="text-center text-white p-10">Loading trips...</div>;
  }

  // Show an error message if the fetch fails
  if (error) {
    return <div className="text-center text-red-500 p-10">Error: {error}</div>;
  }

   return (
    // THEME UPDATE: Changed main background and text colors
    <div className="bg-[#FCEFCB] min-h-screen w-screen text-black font-sans p-4 md:p-8">
      <div className="container mx-auto">
        
        {/* --- Filter Bar Section --- */}
        {/* THEME UPDATE: Changed background and text colors */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Search trips......" 
            className="w-full md:flex-grow bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg p-2 focus:outline-none focus:border-[#8338EC] placeholder-gray-700"
          />
          <button className="w-full text-white md:w-auto bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-700">Group by</button>
          <button className="w-full text-white md:w-auto bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-700">Filter</button>
          <button className="w-full text-white md:w-auto bg-[#FAD59A] border-2 border-[#4A4E5A] rounded-lg px-4 py-2 hover:border-gray-700">Sort by...</button>
        </div>

        {/* --- Trip Sections --- */}
        <div className="space-y-10">
          
          {/* Ongoing Section */}
          <div>
            {/* THEME UPDATED: Corrected text color class */}
            <h2 className="text-2xl text-black font-bold mb-4">Ongoing</h2>
            {categorizedTrips.ongoing.length > 0 ? (
              categorizedTrips.ongoing.map(trip => <TripCard key={trip.id} trip={trip} />)
            ) : (
              <p className="text-gray-600">No ongoing trips.</p>
            )}
          </div>

          {/* Up-coming Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Up-coming</h2>
            {categorizedTrips.upcoming.length > 0 ? (
              categorizedTrips.upcoming.map(trip => <TripCard key={trip.id} trip={trip} />)
            ) : (
              <p className="text-gray-600">No upcoming trips.</p>
            )}
          </div>

          {/* Completed Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Completed</h2>
            <div className="space-y-4">
              {categorizedTrips.completed.length > 0 ? (
                categorizedTrips.completed.map(trip => <TripCard key={trip.id} trip={trip} />)
              ) : (
                <p className="text-gray-600">No completed trips yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TripListing;
