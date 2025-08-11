import react from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Link } from 'react-router-dom';


export default function TripItenary() {
    return (
        <div className="grid min-h-screen w-screen place-items-start bg-gray-50 px-6">
            <Card className="w-full transition-transform group-hover:scale-105">
                <CardHeader className="text-center">
                    <CardTitle className="py-2 text-4xl">Itinery Plan</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}

