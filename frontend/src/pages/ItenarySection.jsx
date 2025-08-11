import react from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Link } from 'react-router-dom';
const TRIPS = [
    {
        id: "college-makeout",              // dynamic id
        title: "College Makeout",
        cover: "https://pbs.twimg.com/profile_images/490590018943983616/1QtYly1m.png",
    },
     {
        id: "college-makeout",              // dynamic id
        title: "College Makeout",
        cover: "https://pbs.twimg.com/profile_images/490590018943983616/1QtYly1m.png",
    },
];
export default function ItenarySection() {


    return (
        <div className='flex  min-h-screen w-screen bg-gray-50 p-6'>
            <div>
                <div className='text-4xl font-bold'>Let's create an itinary</div>
                <div className='italic'>You have the following planned trips.</div>

                <div className='my-10 flex gap-2'>
                    {TRIPS.map((t) => (
                        <Link key={t.id} to={`/trips/${t.id}`} className="block group">
                            <Card className="w-80 h-80 transition-transform group-hover:scale-105">
                                <CardHeader>
                                    <img
                                        src={t.cover}
                                        alt={t.title}
                                        className="h-40 w-full object-cover rounded-md"
                                    />
                                    <CardTitle className="py-2 text-center">
                                        {t.title}
                                    </CardTitle>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    )
}
