import {
    Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react";

// Country -> Cities map
const COUNTRY_CITIES = {
    India: ["Goa", "Mumbai", "Delhi", "Bengaluru", "Jaipur", "Kochi", "Pune", "Hyderabad"],
    USA: ["New York", "Los Angeles", "Chicago", "Seattle"],
    UK: ["London", "Manchester", "Edinburgh", "Birmingham"],
    UAE: ["Dubai", "Abu Dhabi", "Sharjah"],
};

export default function NewTrip() {
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);

    const [tripName, setTripName] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");       // current selection
    const [stops, setStops] = useState([]); // added stops
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const citiesForCountry = useMemo(
        () => (country ? COUNTRY_CITIES[country] ?? [] : []),
        [country]
    );

    const remainingCities = useMemo(
        () => citiesForCountry.filter((c) => !stops.includes(c)),
        [citiesForCountry, stops]
    );

    const canAddStop = country && city && !stops.includes(city);
    const isFormValid = tripName && country && stops.length > 0 && start && end;

    const handleAddStop = () => {
        if (!canAddStop) return;
        setStops((prev) => [...prev, city]);
        setCity(""); // reset current selection
    };

    const handleRemoveStop = (toRemove) => {
        setStops((prev) => prev.filter((s) => s !== toRemove));
    };

    const handleCreateTrip = () => {
        console.log("Creating new trip:", {
            name: tripName,
            country,
            stops,       // array of cities
            startDate: start,
            endDate: end,
        });
    };

    return (
        <section className="flex justify-center min-h-screen w-screen bg-gray-50 p-2 m-2">
            <Card className="w-300 h-min p-5 shadow-lg flex flex-col rounded-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Let’s Plan a New Trip!</CardTitle>
                    <CardDescription>Fill in the details below to start planning your next journey.</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="trip-name">Trip name</Label>
                            <Input
                                id="trip-name"
                                placeholder="e.g. India Food Trail"
                                value={tripName}
                                onChange={(e) => setTripName(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-date">Start date</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    min={today}
                                    value={start}
                                    onChange={(e) => {
                                        const newStartDate = e.target.value;
                                        setStart(newStartDate);
                                        if (end && newStartDate && end < newStartDate) {
                                            setEnd(newStartDate);
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-date">End date</Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    min={start || today}
                                    value={end}
                                    onChange={(e) => setEnd(e.target.value)}
                                    disabled={!start}
                                />
                            </div>
                        </div>

                        {/* Country */}
                        <div className="space-y-2">
                            <Label>Country</Label>
                            <Select
                                value={country}
                                onValueChange={(val) => {
                                    setCountry(val);
                                    setCity("");
                                    setStops([]); // reset stops when country changes
                                }}
                            >
                                <SelectTrigger className="w-full !bg-white" aria-label="Select country">
                                    <SelectValue placeholder="Choose a country" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(COUNTRY_CITIES).map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Stops (Cities) */}
                        <div className="space-y-3">
                            <Label>Stops (cities)</Label>
                            <div className="flex gap-2">
                                <Select
                                    value={city}
                                    onValueChange={setCity}
                                    disabled={!country || remainingCities.length === 0}
                                >
                                    <SelectTrigger className="w-full !bg-white" aria-label="Select city">
                                        <SelectValue
                                            placeholder={
                                                country
                                                    ? remainingCities.length ? "Choose a city" : "All cities added"
                                                    : "Select a country first"
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {remainingCities.map((ct) => (
                                            <SelectItem key={ct} value={ct}>{ct}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button type="button" className="!border-2 " onClick={handleAddStop} disabled={!canAddStop}>
                                    Add stop
                                </Button>
                            </div>

                            {stops.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {stops.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {stops.map((s) => (
                                                <Badge
                                                    key={s}
                                                    variant="secondary"
                                                    className="inline-flex items-center gap-1 pr-1 leading-none"
                                                >
                                                    <span>{s}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveStop(s)}
                                                        aria-label={`Remove ${s}`}
                                                        title="Remove"
                                                        className="!bg-black/20 rounded-full"
                    
                                                    >
                                                        X
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            )}

                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-2 pt-6">
                    <Button onClick={handleCreateTrip} disabled={!isFormValid} size="lg">
                        Create Trip
                    </Button>
                </CardFooter>
            </Card>
        </section>
    );
}
