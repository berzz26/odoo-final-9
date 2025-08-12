import React, { useState, useEffect, useMemo } from 'react';

// Add this to your global HTML or CSS:
// <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&family=Merriweather&display=swap" rel="stylesheet" />

const TripCard = ({ trip }) => {
  const formattedStartDate = new Date(trip.startDate).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const formattedEndDate = new Date(trip.endDate).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const fallbackPhotos = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=720&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&h=720&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1080&h=720&fit=crop"
  ];
  const coverPhoto = trip.coverPhoto || fallbackPhotos[Math.floor(Math.random() * fallbackPhotos.length)];

  return (
    <div className="bg-white border border-amber-300 rounded-lg shadow-md hover:shadow-xl transition-transform duration-300 hover:scale-105 overflow-hidden">
      <div className="relative h-48 w-full">
        <img
          src={coverPhoto}
          alt={`Cover for ${trip.name}`}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>
      <div className="p-6">
        <h3
          className="text-2xl font-bold text-amber-900 mb-3"
         
        >
          {trip.name}
        </h3>
        <p
          className="text-amber-700 mb-5 leading-relaxed"
          style={{ fontFamily: "'Merriweather', serif", fontSize: '1rem' }}
        >
          {trip.description || "No description available."}
        </p>
        <div
          className="flex justify-between text-sm text-amber-500 mb-3"
          
        >
          <span>{formattedStartDate}</span>
          <span>—</span>
          <span>{formattedEndDate}</span>
        </div>
        <div
          className="text-sm text-amber-600 truncate"
          
        >
          {trip.stops?.map(stop => stop.city).join(", ") || "No stops specified"}
        </div>
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
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Authorization token not found. Please log in.');

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trips`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch trips.');

        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const categorizedTrips = useMemo(() => {
    const now = new Date();
    const ongoing = [];
    const upcoming = [];
    const completed = [];

    trips.forEach(trip => {
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      if (endDate < now) completed.push(trip);
      else if (startDate > now) upcoming.push(trip);
      else ongoing.push(trip);
    });

    return { ongoing, upcoming, completed };
  }, [trips]);

  if (loading) return <div className="text-center text-amber-600 p-10" >Loading trips...</div>;
  if (error) return <div className="text-center text-red-600 p-10" >Error: {error}</div>;

  return (
    <div className="bg-[#FDF6E3] min-h-screen w-screen text-amber-900  p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search trips..."
            className="flex-grow p-3 rounded-lg border border-amber-300 bg-amber-50 placeholder-amber-600
              focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition
             text-amber-900"
            
          />
          {['Group by', 'Filter', 'Sort by'].map((label) => (
            <button
              key={label}
              className="px-6 py-3 !bg-amber-100 text-amber-900 rounded-lg font-semibold hover:bg-amber-200 transition"
             
            >
              {label}
            </button>
          ))}
        </div>

        {/* Trip Sections */}
        <div className="space-y-12">

          {/* Ongoing */}
          <section>
            <h2
              className="text-4xl font-bold text-amber-700 mb-6"
             
            >
              Ongoing
            </h2>
            {categorizedTrips.ongoing.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categorizedTrips.ongoing.map(trip => <TripCard key={trip.id} trip={trip} />)}
              </div>
            ) : (
              <p className="text-amber-600 italic">No ongoing trips.</p>
            )}
          </section>

          {/* Upcoming */}
          <section>
            <h2
              className="text-4xl font-bold text-amber-700 mb-6"
             
            >
              Upcoming
            </h2>
            {categorizedTrips.upcoming.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categorizedTrips.upcoming.map(trip => <TripCard key={trip.id} trip={trip} />)}
              </div>
            ) : (
              <p className="text-amber-600 italic ">No upcoming trips.</p>
            )}
          </section>

          {/* Completed */}
          <section>
            <h2
              className="text-4xl font-bold text-amber-700 mb-6"
             
            >
              Completed
            </h2>
            {categorizedTrips.completed.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {categorizedTrips.completed.map(trip => <TripCard key={trip.id} trip={trip} />)}
              </div>
            ) : (
              <p className="text-amber-600 italic ">No completed trips yet.</p>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default TripListing;
