import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardHeader, CardTitle,
} from "@/components/ui/card";

// The component is now responsible for fetching its own data.
export default function ItenarySection() {
    // State for storing trips, loading status, and potential errors
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                // Retrieve the auth token from localStorage
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authorization token not found. Please log in.');
                }

               
                const response = await fetch(`/api/trips`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch trips.');
                }

                const data = await response.json();
                // Set the fetched data to state
                setTrips(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []); 

    return (
  <div className="flex min-h-screen w-screen bg-[#FCEFCB] p-4 sm:p-6">
    <div className="w-full max-w-7xl mx-auto">
      <div className="text-2xl sm:text-3xl md:text-4xl italic text-center sm:text-left">
        You have the following planned trips.
      </div>

      <div className="my-8 sm:my-10">
        {/* Conditional Rendering */}
        {loading && <p className="text-center">Loading trips...</p>}

        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.length > 0 ? (
              trips.map((t) => (
                <Link key={t.id} to={`/trips/${t.id}`} className="group">
                  <Card className="w-full h-full transition-transform group-hover:scale-105">
                    <CardHeader>
                      <img
                        src={t.coverPhoto}
                        alt={t.name}
                        className="h-40 sm:h-48 md:h-56 w-full object-cover rounded-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found";
                        }}
                      />
                      <CardTitle className="py-2 text-center text-base sm:text-lg md:text-xl">
                        {t.name}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="text-center">No trips found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

}