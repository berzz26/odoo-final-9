import React, { useEffect, useState,useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

// TripCard now accepts an onDelete prop
const TripCard = ({ trip, onDelete }) => {
    // Format dates for display
    const formattedStartDate = new Date(trip.startDate).toLocaleDateString();
    const formattedEndDate = new Date(trip.endDate).toLocaleDateString();

    return (
        <div className="bg-white border-1 border-gray/40 shadow-md rounded-lg p-6 text-left mb-4 flex justify-between items-center">
            <div>
                <h3 className="text-xl font-bold text-black mb-2">{trip.name}</h3>
                <p className="text-gray-400">{trip.description || 'No description available.'}</p>
                <div className="text-sm text-gray-500 mt-4">
                    <span>{formattedStartDate}</span> - <span>{formattedEndDate}</span>
                </div>
            </div>
            {/* Delete button for the trip card */}
            <Button 
                variant="destructive" 
                size="icon" 
                onClick={() => onDelete(trip.id)}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [trips, setTrips] = useState([]);
    const [error, setError] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState(""); // State for the city field
    const [avatarUrl, setAvatarUrl] = useState(""); // State for the avatar URL

    // Corrected and fixed the handleTripDelete function
    const handleTripDelete = async (tripId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('Authorization token not found.');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trips/${tripId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete trip.");
            }

            // If deletion is successful, update the trips state by filtering out the deleted trip
            setTrips(currentTrips => currentTrips.filter(trip => trip.id !== tripId));
        } catch (err) {
            console.error("Error deleting trip:", err.message);
            setError("Failed to delete trip. Please try again.");
        }
    };


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
                    throw new Error('Failed to fetch trips.',response);
                }

                const data = await response.json();
                setTrips(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
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

    // Function to handle the file upload
    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Create a local URL for the selected image to display it immediately
            const newAvatarUrl = URL.createObjectURL(file);
            setAvatarUrl(newAvatarUrl);
            // In a real application, you would also handle the upload to a server here.
            // For example: uploadImage(file).then(url => setAvatarUrl(url));
        }
    };

    useEffect(() => {
        async function fetchUserData() {
            const authToken = localStorage.getItem("authToken");

            if (!authToken) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch("http://192.168.103.71:3000/api/auth/me", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${authToken}` },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data with provided token.");
                }

                const userData = await response.json();
                setUser(userData);

                setName(userData.name || "");
                setEmail(userData.email || "");
                setCountry(userData.country || "");
                setCity(userData.city || ""); // Set initial city value
                setAvatarUrl(userData.avatarUrl || ""); // Set initial avatar URL
            } catch (error) {
                console.error("User data fetch failed:", error);
                localStorage.removeItem("authToken");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUserData();
    }, [navigate]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p>User not found. Please log in.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-screen bg-white p-6 gap-6">
            <Card className="w-full max-w-6xl shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
                    <CardDescription>View and manage your account details.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="flex-shrink-0">
                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                                <Avatar className="h-48 w-48 border-2 border-black">
                                    <AvatarImage src={avatarUrl} alt="User Avatar" />
                                    <AvatarFallback className="text-4xl">{user.email?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                            </Label>
                            <Input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                        <div className="w-full">
                            <h1 className="text-2xl font-semibold mb-4">Welcome, {name}!</h1>
                            <p className="italic text-gray-600 mb-6">Here is your profile information.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-lg">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-lg">Email</Label>
                                    <Input
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country" className="text-lg">Country</Label>
                                    <Input
                                        id="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full border-gray-400"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-lg">City</Label>
                                    <Input
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full border-gray-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end p-6">
                    <Button className="">Save Profile</Button>
                </CardFooter>
            </Card>

            <Card className="w-full max-w-6xl shadow-lg text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Pre Planned Trips</CardTitle>
                    <CardDescription>View and manage your upcoming trips.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        {categorizedTrips.upcoming.length > 0 ? (
                            categorizedTrips.upcoming.map(trip => <TripCard key={trip.id} trip={trip} onDelete={handleTripDelete} />)
                        ) : (
                            <p className="text-gray-600">No upcoming trips.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
