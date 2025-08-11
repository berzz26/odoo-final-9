import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
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

                // Fetch data from the backend endpoint
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trips`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch trips.');
                }

                const data = await response.json();
                // Assuming the API returns an array of objects with { id, title, cover }
                setTrips(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <div className='flex min-h-screen w-screen bg-gray-50 p-6'>
            <div>
                <div className='text-4xl font-bold'>Let's create an itinary</div>
                <div className='italic'>You have the following planned trips.</div>

                <div className='my-10'>
                    {/* Conditional Rendering based on fetch state */}
                    {loading && <p className="text-center">Loading trips...</p>}
                    
                    {error && <p className="text-center text-red-500">Error: {error}</p>}
                    
                    {!loading && !error && (
                        <div className='flex flex-wrap gap-4'>
                            {trips.length > 0 ? (
                                trips.map((t) => (
                                    <Link key={t.id} to={`/trips/${t.id}`} className="block group">
                                        <Card className="w-80 h-80 transition-transform group-hover:scale-105">
                                            <CardHeader>
                                                <img
                                                    src={t.cover} // Assumes 'cover' property exists in fetched data
                                                    alt={t.title} // Assumes 'title' property exists
                                                    className="h-40 w-full object-cover rounded-md"
                                                />
                                                <CardTitle className="py-2 text-center">
                                                    {t.title}
                                                </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))
                            ) : (
                                <p>No trips found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}