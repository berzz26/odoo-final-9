import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Community() {
    const navigate = useNavigate();

    //   useEffect(() => {
    //     const token = localStorage.getItem("authToken");
    //     if (!token) navigate("/login");
    //   }, [navigate]);

    return (
        <div className="flex flex-col items-center w-screen bg-white p-6 gap-6">
            <Link to="" className="w-full hover:scale-101 transition">
                <Card className="">
                    <CardHeader>
                        <CardTitle className="text-2xl">Hello</CardTitle>
                        <CardDescription>I went on this after my breakup</CardDescription>
                        <CardDescription>by harshil  </CardDescription>
                        <Avatar className="h-8 w-8 border-2 border-black">
                            <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                            <AvatarFallback className="text-4xl">

                            </AvatarFallback>
                        </Avatar>
                    </CardHeader>
                    <CardContent>Ratings</CardContent>
                </Card>
            </Link>
        </div>
    );
}
