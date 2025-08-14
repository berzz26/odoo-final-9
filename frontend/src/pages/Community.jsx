import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Community() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]); // 1. Use useState to store the posts

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const token = localStorage.getItem("authToken");

                // Optional: redirect to login if no token is found
                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(`/api/community`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json(); // Use a different variable name to avoid confusion with the function scope

                if (!response.ok) {
                    throw new Error(data?.message || "Failed to fetch posts");
                }
                
                setPosts(data.data); // 2. Update the state with the fetched data
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };

        fetchAllPosts(); // 3. Call the async function inside useEffect
    }, [navigate]);

    return (
        <div className="flex flex-col items-center w-screen bg-[#FCEFCB] p-6 gap-6">
            {posts.map((trip) => (
                <Link key={trip.id} to={`/api/trip/${trip.id}`} className="w-full hover:scale-101 transition">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">{trip.name}</CardTitle>
                            <CardDescription>{trip.description}</CardDescription>
                            <CardDescription>by {trip.user.name}</CardDescription>
                            <Avatar className="h-8 w-8 border-2 border-black">
                                <AvatarImage src={trip.user.avatarUrl} alt="User Avatar" />
                                <AvatarFallback>{trip.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <span className="italic">Saves: {trip.avgRating}</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}