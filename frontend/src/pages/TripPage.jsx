import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Import Button component

export default function TripPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false); // New state for the saving button
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTripDetails = async () => {
            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/community/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch trip details.");
                }

                const data = await response.json();
                setTrip(data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching trip details:", err);
                setError(err.message);
                setIsLoading(false);
            }
        };

        if (id) {
            fetchTripDetails();
        }
    }, [id, navigate]);

    // New function to handle saving the trip
    const handleSaveTrip = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem("authToken");

            if (!token) {
                alert("You must be logged in to save trips.");
                navigate("/login");
                setIsSaving(false);
                return;
            }

            if (!trip) {
                throw new Error("Trip data is not available to save.");
            }

            // Create a new trip object based on the data available in the 'trip' state
            const newTripPayload = {
                name: trip.name, // The name of the community trip
                description: trip.description, // The description
                startDate: trip.startDate,
                endDate: trip.endDate,
                coverPhoto: trip.coverPhoto || "",
                // Re-map stops and activities to strip out IDs, which are not needed for a new trip
                stops: (trip.stops || []).map(stop => ({
                    city: stop.city,
                    country: stop.country,
                    startDate: stop.startDate,
                    endDate: stop.endDate,
                    activities: (stop.activities || []).map(activity => ({
                        name: activity.name,
                        description: activity.description,
                        category: activity.category,
                        cost: activity.cost,
                        duration: activity.duration,
                    })),
                })),
                // Re-assemble the budget object, providing defaults if not present
                budget: {
                    transportCost: trip.budget?.transportCost || 0,
                    stayCost: trip.budget?.stayCost || 0,
                    activitiesCost: trip.budget?.activitiesCost || 0,
                    mealsCost: trip.budget?.mealsCost || 0,
                    totalCost: trip.budget?.totalCost || 0,
                },
            };

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trips`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(newTripPayload), // Send the newly constructed payload
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Log the full error to understand what the backend validation is failing on
                console.error("Backend Error:", errorData);
                throw new Error(errorData.message || `Failed to save the trip: ${response.statusText}`);
            }

            alert("Trip saved successfully to your trips!");

        } catch (err) {
            console.error("Error saving trip:", err);
            alert(`Error: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center p-8">Loading trip details...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    if (!trip) {
        return <div className="text-center p-8">Trip not found.</div>;
    }

    const avgRating = trip.rating.length > 0
        ? (trip.rating.reduce((sum, r) => sum + r.score, 0) / trip.rating.length).toFixed(1)
        : "N/A";

    return (
        <div className="flex flex-col items-center w-screen bg-white p-6 gap-6">
            <div className="w-full">
                <Link to="/community" className="text-blue-600 hover:underline flex items-center gap-1">
                    <span aria-hidden="true">&larr;</span> Back to Community
                </Link>
            </div>

            {/* Trip Header */}
            <Card className="w-full">
                <CardHeader className="p-0">
                    {trip.coverPhoto && (
                        <img
                            src={trip.coverPhoto}
                            alt={`${trip.name} cover photo`}
                            className="w-full h-64 object-cover rounded-t-lg"
                        />
                    )}
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col">
                            <CardTitle className="text-4xl font-bold">{trip.name}</CardTitle>
                            <CardDescription className="text-lg mt-2">{trip.description}</CardDescription>
                            <div className="flex items-center gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8 border-2 border-black">
                                        <AvatarImage src={trip.user.avatarUrl} alt="User Avatar" />
                                        <AvatarFallback>{trip.user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span>by {trip.user.name}</span>
                                </div>
                                <span>|</span>
                                <span className="text-yellow-500 font-semibold text-lg">
                                    ★ {avgRating}
                                </span>
                            </div>
                        </div>
                        <Button onClick={handleSaveTrip} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save Trip"}
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Itinerary Section */}
            <h2 className="text-3xl font-bold mt-8 w-full">Itinerary</h2>
            {trip.stops.length > 0 ? (
                <div className="space-y-6 w-full">
                    {trip.stops.map((stop) => (
                        <Card className="w-full" key={stop.id}>
                            <CardHeader>
                                <CardTitle className="text-2xl">{stop.city}, {stop.country}</CardTitle>
                                <CardDescription>
                                    {format(new Date(stop.startDate), "MMM d")} -{" "}
                                    {format(new Date(stop.endDate), "MMM d, yyyy")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {stop.activities.map((activity) => (
                                        <li key={activity.id} className="border-l-2 pl-4">
                                            <h4 className="font-semibold">{activity.name}</h4>
                                            <p className="text-sm text-gray-600">{activity.description}</p>
                                            <div className="flex text-xs text-gray-500 gap-4 mt-1">
                                                <span>{activity.category}</span>
                                                <span>{activity.cost > 0 ? `$${activity.cost}` : 'Free'}</span>
                                                <span>{activity.duration} mins</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="w-full">No itinerary stops for this trip yet.</p>
            )}

            {/* Budget Section */}
            {trip.budget && (
                <>
                    <h2 className="text-3xl font-bold mt-8 w-full">Budget Overview</h2>
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Total Estimated Cost</CardTitle>
                            <div className="text-4xl font-bold text-green-600">
                                ${trip.budget.totalCost}
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="flex justify-between items-center">
                                <span>Transport:</span>
                                <span>${trip.budget.transportCost}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Accommodation:</span>
                                <span>${trip.budget.stayCost}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Activities:</span>
                                <span>${trip.budget.activitiesCost}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Meals:</span>
                                <span>${trip.budget.mealsCost}</span>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}