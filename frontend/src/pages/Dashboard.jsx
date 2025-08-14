import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Predefined scenic URLs for fallback cover photos and carousel
const scenicPhotos = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=720&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&h=720&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=720&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1080&h=720&fit=crop",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1080&h=720&fit=crop",
  "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1080&h=720&fit=crop",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1080&h=720&fit=crop",
  "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=1080&h=720&fit=crop"
];

// Journey quotes for hero carousel
const journeyQuotes = [
  {
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop",
    quote: "The world is a book and those who do not travel read only one page.",
    author: "Saint Augustine"
  },
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop",
    quote: "Adventure is worthwhile in itself.",
    author: "Amelia Earhart"
  },
  {
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop",
    quote: "Life is either a daring adventure or nothing at all.",
    author: "Helen Keller"
  },
  {
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=600&fit=crop",
    quote: "To travel is to live.",
    author: "Hans Christian Andersen"
  },
  {
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&h=600&fit=crop",
    quote: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien"
  }
];

const token = localStorage.getItem("authToken");

const Dashboard = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Function to get a random scenic photo for fallback
  const getRandomScenicPhoto = () => {
    return scenicPhotos[Math.floor(Math.random() * scenicPhotos.length)];
  };

  // Function to fetch all spots
  const fetchAllSpots = async () => {
    try {
      const response = await fetch(`http://13.202.224.27:3000/api/stop/getAllStop`, {
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
      setSpots(data);
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
         const authResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

          if (authResponse.ok) {
            setIsAuth(true);

            // Fetch trips after successful authentication
            const tripsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trips`, {
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
    fetchAllSpots();
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
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <p className="text-amber-800 ml-3">Loading...</p>
        </div>
      );
    }

    if (isAuth) {
      if (trips.length === 0) {
        return (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-amber-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-amber-800 text-lg">You haven't completed any trips yet.</p>
            <p className="text-amber-600 text-sm mt-2">Start planning your first adventure!</p>
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white border border-amber-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="relative">
                <img
                  src={trip.coverPhoto || getRandomScenicPhoto()}
                  alt={`Cover for ${trip.name}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-amber-900 mb-2">{trip.name}</h4>
                <p className="text-sm text-amber-700 mb-4 line-clamp-2">{trip.description}</p>
                <div className="flex items-center text-sm text-amber-600 mb-3">
                  <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                  </svg>
                  <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                </div>
                <div className="flex items-center text-sm text-amber-600">
                  <svg className="w-4 h-4 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="truncate">{trip.stops?.map(stop => stop.city).join(', ') || 'No stops specified'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Not authenticated, show carousel
      return (
        <div className="h-96 md:h-[400px] rounded-xl overflow-hidden shadow-xl">
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            className="carousel-container h-full"
          >
            {scenicPhotos.map((url, index) => (
              <div key={index} className="h-96 md:h-[400px]">
                <img src={url} alt={`Scenic view ${index + 1}`} className="object-cover h-full w-full" />
                <p className="legend bg-amber-900/80 text-white">Explore the world with us!</p>
              </div>
            ))}
          </Carousel>
        </div>
      );
    }
  };

  const renderPopularRegions = () => {
    const regions = [
      { name: 'Europe', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop' },
      { name: 'Asia', image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=400&h=300&fit=crop' },
      { name: 'Americas', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop' },
      { name: 'Africa', image: 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=400&h=300&fit=crop' },
      { name: 'Oceania', image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=300&fit=crop' },
    ];

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {regions.map((region, index) => (
          <div key={index} className="group relative bg-white border border-amber-200 rounded-xl h-32 overflow-hidden hover:border-amber-400 transition-all duration-300 cursor-pointer hover:scale-105 shadow-md hover:shadow-lg">
            <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2">
              <h4 className="text-white font-semibold text-sm truncate">{region.name}</h4>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen text-amber-900 font-sans">
      <div className="min-h-screen flex flex-col items-center justify-start">
        <div className="w-full max-w-screen px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-8 mx-auto">
        {/* Hero Carousel Section */}
        <div className="rounded-2xl overflow-hidden shadow-xl">
          <Carousel
            showArrows={true}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={6000}
            className="hero-carousel"
          >
            {journeyQuotes.map((item, index) => (
              <div key={index} className="relative h-96 md:h-[500px]">
                <img 
                  src={item.image} 
                  alt={`Journey quote ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6 md:px-12 max-w-4xl">
                    <h2 className="text-2xl md:text-4xl lg:text-5xl text-white font-bold mb-4 leading-tight" style={{ fontFamily: '"Caveat", cursive' }}>
                      "{item.quote}"
                    </h2>
                    <p className="text-amber-200 text-lg md:text-xl italic">— {item.author}</p>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

      

        {/* Popular Regional Selections */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <h3 className="text-2xl font-bold text-amber-900 mb-6">Popular Regional Selections</h3>
          {renderPopularRegions()}
        </div>

        {/* Previous Trips / Inspiration Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
          <h3 className="text-2xl font-bold text-amber-900 mb-6">
            {isAuth ? "Your Previous Trips" : "Get Inspired for Your Next Trip"}
          </h3>
          {renderContent()}
        </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleNewTripClick}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-full px-6 py-4 shadow-2xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-110 flex items-center gap-2 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Plan a trip</span>
      </button>
    </div>
  );
};

export default Dashboard;