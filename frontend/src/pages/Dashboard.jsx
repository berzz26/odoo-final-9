import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Placeholder data for the carousel since it was not defined
const scenicPhotos = [
  "https://images.unsplash.com/photo-1501785888041-af3ef285b947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNTY3MHwwfDF8c2VhcmNofDR8fHRyYXZlbHxlbnwwfHx8fDE2Mzc3NjY4Mzg&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1506197603052-3be9359e7311?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNTY3MHwwfDF8c2VhcmNofDIyfHx0cmF2ZWx8ZW58MHx8fHwxNjM3NzY2ODM4&ixlib=rb-1.2.1&q=80&w=1080",
  "https://images.unsplash.com/photo-1476514525535-07fb1b520282?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNTY3MHwwfDF8c2VhcmNofDQwfHx0cmF2ZWx8ZW58MHx8fHwxNjM3NzY2ODM4&ixlib=rb-1.2.1&q=80&w=1080"
];
const token = localStorage.getItem("authToken")
const Dashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [spots, setSpots] = useState([]); // New state to hold fetched spots
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Function to fetch all spots
  const fetchAllSpots = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/stop/getAllStop`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch all spots.");
      }
      const data = await response.json();
      setSpots(data); // Set the fetched data to the spots state
    } catch (error) {
      console.error("Error fetching all spots:", error.message);
    }
  };

  // useEffect to handle authentication and fetching user trips
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      if (token) {
        try {
          // Check authentication
          const authResponse = await fetch('http://192.168.103.71:3000/api/auth/me', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (authResponse.ok) {
            setIsAuth(true);

            // Fetch trips after successful authentication
            const tripsResponse = await fetch('http://192.168.103.71:3000/api/trips', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (!tripsResponse.ok) {
              throw new Error('Failed to fetch trips');
            } else {
              const data = await tripsResponse.json();
              const currentDate = new Date();
              const pastTrips = data.filter(trip => new Date(trip.endDate) < currentDate);
              const sortedTrips = pastTrips.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
              setTrips(sortedTrips);
            }
          } else {
            setIsAuth(false);
            navigate('/login');
          }
        } catch (error) {
          console.error("Authentication or trip fetch failed:", error);
          setIsAuth(false);
          navigate('/login');
        } finally {
          setLoading(false);
        }
      } else {
        setIsAuth(false);
        navigate('/login');
        setLoading(false);
      }
    };

    checkAuthAndFetchData();
    fetchAllSpots(); // Call the fetchAllSpots function
  }, [navigate]);

  const handleNewTripClick = () => {
    navigate('/newtrip');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-gray-400">Loading...</p>;
    }

    if (isAuth) {
      if (trips.length === 0) {
        return <p className="text-gray-400">You haven't completed any trips yet.</p>;
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 !bg-[#FCEFCB]">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-[#2D3039] border border-[#4A4E5A] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img
                src={trip.coverPhoto}
                alt={`Cover for ${trip.name}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h4 className="text-xl font-bold mb-1">{trip.name}</h4>
                <p className="text-sm text-gray-400 mb-2">{trip.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  {/* Corrected SVG path for the calendar icon */}
                  <svg className="w-4 h-4 mr-1 text-[#8338EC]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                  <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1 text-[#8338EC]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                  <span>{trip.stops.map(stop => stop.city).join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Not authenticated, show carousel
      return (
        <div className="h-96 md:h-[400px] rounded-lg overflow-hidden shadow-xl">
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            className="carousel-container"
          >
            {scenicPhotos.map((url, index) => (
              <div key={index}>
                <img src={url} alt={`Scenic view ${index + 1}`} className="object-cover h-96 w-full" />
                <p className="legend">Explore the world with us!</p>
              </div>
            ))}
          </Carousel>
        </div>
      );
    }
  };

  return (
    <div className="bg-[#FCEFCB] min-h-screen w-screen text-[#EAECEE] font-sans">
      <div className="p-4 md:p-8 space-y-8 container mx-auto max-w-6xl">
        <div className="bg-[#2D3039] border border-[#4A4E5A] rounded-lg p-10 md:p-12 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl md:text-6xl text-white font-bold tracking-tight" style={{ fontFamily: '"Caveat", cursive' }}>
            Plan Your Next Adventure 
          </h2>
          <p className="text-gray-400 mt-4 text-lg italic">Your journey begins here.</p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch gap-4">
          <input
            type="text"
            placeholder="Search destinations..."
            className="w-full md:flex-grow bg-[#FAD59A] border border-[#4A4E5A] rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#8338EC] transition-colors"
          />
          <button className="w-full md:w-auto !bg-[#FAD59A] border border-[#4A4E5A] rounded-lg px-6 py-3 hover:border-[#000000] transition-colors text-black">Group by</button>
          <button className="w-full md:w-auto !bg-[#FAD59A] border border-[#4A4E5A] rounded-lg px-6 py-3 hover:border-[#000000] transition-colors text-black ">Filter</button>
          <button className="w-full md:w-auto !bg-[#FAD59A] border border-[#4A4E5A] rounded-lg px-6 py-3 hover:border-[#000000] transition-colors text-black">Sort by</button>
        </div>


        <div>
          <h3 className="text-2xl font-bold mb-4 text-black">
            {isAuth ? "Your Previous Trips" : "Get Inspired for Your Next Trip"}
          </h3>
          {renderContent()}
        </div>
      </div>

      <button
        onClick={handleNewTripClick}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-[#8338EC] text-white font-semibold rounded-full px-6 py-4 shadow-xl hover:bg-opacity-90 transition-transform hover:scale-105 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Plan a trip</span>
      </button>
    </div>
  );
};

export default Dashboard;
