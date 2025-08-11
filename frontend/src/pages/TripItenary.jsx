import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';


const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
});

const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h` : ''} ${mins > 0 ? `${mins}m` : ''}`.trim();
};


export default function TripItineraryPage() {
    const { tripId } = useParams(); 
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('Authorization token not found. Please log in.');
                }
                
              
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trips/${tripId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });

                if (!response.ok) {
                   
                    if(response.status === 404) {
                         throw new Error('Trip not found.');
                    }
                    throw new Error('Failed to fetch trip details.');
                }
                const data = await response.json();
                setTrip(data);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (tripId) {
            fetchTripDetails();
        }
    }, [tripId]); 

  
    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><p>Loading Itinerary...</p></div>;
    }

  
    if (error) {
        return <div className="flex justify-center items-center min-h-screen text-red-500"><p>Error: {error}</p></div>;
    }

   
    if (!trip) {
        return <div className="flex justify-center items-center min-h-screen"><p>Could not find trip data.</p></div>;
    }

   
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
               
                <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:underline mb-6">
                    <ArrowLeft size={16} />
                    Back to All Trips
                </Link>

             
                <header className="mb-8">
                    <img 
                        src={trip.coverPhoto} 
                        alt={trip.name} 
                        className="w-screen h-64 object-cover rounded-lg mb-4 shadow-lg"
                        onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1200x400/EEE/31343C?text=Image+Not+Available'; }}
                    />
                    <h1 className="text-4xl font-extrabold text-gray-900">{trip.name}</h1>
                    <p className="text-lg text-gray-600 mt-2">{trip.description}</p>
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <Calendar size={16} />
                        <span>{formatDate(trip.startDate)}</span> to <span>{formatDate(trip.endDate)}</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-3xl font-bold">Itinerary Plan</h2>
                        {trip.stops.map(stop => (
                            <Card key={stop.id} className="overflow-hidden">
                                <CardHeader className="bg-gray-100">
                                    <CardTitle className="flex items-center gap-3">
                                        <MapPin className="text-blue-500" />
                                        <span>{stop.city}, {stop.country}</span>
                                    </CardTitle>
                                    <div className="text-sm text-gray-500 flex items-center gap-2 pt-1">
                                        <Calendar size={14} />
                                        {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <h4 className="font-semibold mb-3 text-lg">Activities:</h4>
                                    <ul className="space-y-3">
                                        {stop.activities.map(activity => (
                                            <li key={activity.id} className="flex justify-between items-start p-3 bg-white rounded-md border">
                                                <div>
                                                    <p className="font-medium text-gray-800">{activity.name}</p>
                                                    <p className="text-sm text-gray-500">{activity.category}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0 ml-4">
                                                    <p className="font-semibold text-green-700">${activity.cost}</p>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 justify-end">
                                                        <Clock size={12} /> {formatDuration(activity.duration)}
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* --- Budget Section (Right/Side Column) --- */}
                    <aside className="lg:col-span-1">
                        <Card className="sticky top-8 shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-2xl">
                                    <DollarSign className="text-green-600" />
                                    Budget Breakdown
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex justify-between py-1 border-b"><span>Transportation:</span> <strong>${trip.budget.transportCost}</strong></li>
                                    <li className="flex justify-between py-1 border-b"><span>Accommodation:</span> <strong>${trip.budget.stayCost}</strong></li>
                                    <li className="flex justify-between py-1 border-b"><span>Activities:</span> <strong>${trip.budget.activitiesCost}</strong></li>
                                    <li className="flex justify-between py-1"><span>Meals:</span> <strong>${trip.budget.mealsCost}</strong></li>
                                </ul>
                                <hr className="my-4" />
                                <div className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Total Est. Cost:</span>
                                    <span>${trip.budget.totalCost}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </div>
        </div>
    );
}