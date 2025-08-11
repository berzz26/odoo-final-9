import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// The COUNTRY_CITIES object is fine as is.
const COUNTRY_CITIES = {
  India: ["Goa", "Mumbai", "Delhi", "Bengaluru", "Jaipur", "Kochi", "Pune", "Hyderabad"],
  USA: ["New York", "Los Angeles", "Chicago", "Seattle"],
  UK: ["London", "Manchester", "Edinburgh", "Birmingham"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah"],
};

export default function NewTrip() {
  const navigate = useNavigate();
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // Centralize all form state into a single object
  const [tripData, setTripData] = useState({
    name: "",
    description: "",
    coverPhoto: "",
    country: "",
    stops: [],
    start: "",
    end: "",
    city: "", // Temporary state for the city select
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to update tripData state
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTripData(prev => ({ ...prev, [id]: value }));
  };

  const handleDateChange = (id, value) => {
    setTripData(prev => {
      const newDates = { ...prev, [id]: value };
      // Ensure end date is not before start date.
      if (id === 'start' && newDates.end && newDates.end < value) {
        newDates.end = value;
      }
      return newDates;
    });
  };

  const citiesForCountry = useMemo(
    () => (tripData.country ? (COUNTRY_CITIES)[tripData.country] ?? [] : []),
    [tripData.country]
  );

  const remainingCities = useMemo(
    () => citiesForCountry.filter((c) => !tripData.stops.includes(c)),
    [citiesForCountry, tripData.stops]
  );

  const canAddStop = tripData.country && tripData.city && !tripData.stops.includes(tripData.city);
  const isFormValid = tripData.name && tripData.country && tripData.stops.length > 0 && tripData.start && tripData.end;

  const handleAddStop = () => {
    if (!canAddStop) return;
    setTripData(prev => ({
      ...prev,
      stops: [...prev.stops, prev.city],
      city: "", // Clear the city selection after adding
    }));
  };

  const handleRemoveStop = (toRemove) => {
    setTripData(prev => ({
      ...prev,
      stops: prev.stops.filter((s) => s !== toRemove),
    }));
  };

  const handleCreateTrip = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Authentication token not found. Please log in.");
      setLoading(false);
      navigate('/login');
      return;
    }

    const tripPayload = {
      name: tripData.name,
      description: tripData.description || undefined,
      startDate: tripData.start,
      endDate: tripData.end,
      coverPhoto: tripData.coverPhoto || undefined,
      // The backend will handle the stops and country based on the trip data.
      // We don't send the stops directly in the initial payload.
    };

    try {
      const response = await fetch("http://localhost:3000/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tripPayload),
      });

<<<<<<< HEAD
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create trip.");
      }
=======
    const handleCreateTrip = () => {
        console.log("Creating new trip:", {
            name: tripName,
            country,
            stops,
            startDate: start,
            endDate: end,
            coverPhoto: "",
        });
    };
>>>>>>> 31b7b8d6a032ba8f4f8d5ffbefc245f20da04771

      const newTrip = await response.json();
      console.log("Trip created successfully:", newTrip);
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
      console.error("Error creating trip:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center min-h-screen w-screen bg-gray-50 p-6">
      <Card className="w-full max-w-3xl h-min p-8 shadow-lg flex flex-col rounded-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Let’s Plan a New Trip! ✈️</CardTitle>
          <CardDescription className="text-base">
            Fill in the details below to start planning your next journey.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">Trip name</Label>
              <Input
                id="name"
                placeholder="e.g. India Food Trail"
                value={tripData.name}
                onChange={(e) => setTripData(prev => ({ ...prev, name: e.target.value }))}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base">Description (optional)</Label>
              <Input
                id="description"
                placeholder="e.g., Exploring cities, culture, and food across Europe."
                value={tripData.description}
                onChange={(e) => setTripData(prev => ({ ...prev, description: e.target.value }))}
                className="h-11 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverPhoto" className="text-base">Cover Photo URL (optional)</Label>
              <Input
                id="coverPhoto"
                type="url"
                placeholder="https://example.com/europe.jpg"
                value={tripData.coverPhoto}
                onChange={(e) => setTripData(prev => ({ ...prev, coverPhoto: e.target.value }))}
                className="h-11 text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="start" className="text-base">Start date</Label>
                <Input
                  id="start"
                  type="date"
                  min={today}
                  value={tripData.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="h-11 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end" className="text-base">End date</Label>
                <Input
                  id="end"
                  type="date"
                  min={tripData.start || today}
                  value={tripData.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  disabled={!tripData.start}
                  className="h-11 text-base"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Country</Label>
              <Select
                value={tripData.country}
                onValueChange={(val) => {
                  setTripData(prev => ({
                    ...prev,
                    country: val,
                    city: "",
                    stops: [],
                  }));
                }}
              >
                <SelectTrigger className="w-full !bg-white h-11 text-base" aria-label="Select country for your trip">
                  <SelectValue placeholder="Choose a country" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(COUNTRY_CITIES).map((c) => (
                    <SelectItem key={c} value={c} className="text-base">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Stops (cities)</Label>
              <div className="flex gap-3">
                <Select
                  value={tripData.city}
                  onValueChange={(val) => setTripData(prev => ({ ...prev, city: val }))}
                  disabled={!tripData.country || remainingCities.length === 0}
                >
                  <SelectTrigger className="w-full !bg-white h-11 text-base" aria-label="Select city to add to your stops">
                    <SelectValue
                      placeholder={
                        tripData.country
                          ? remainingCities.length ? "Choose a city" : "All cities added"
                          : "Select a country first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {remainingCities.map((ct) => (
                      <SelectItem key={ct} value={ct} className="text-base">{ct}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  className="!border-2 h-11 px-5 text-base"
                  onClick={handleAddStop}
                  disabled={!canAddStop}
                >
                  Add stop
                </Button>
              </div>

              {tripData.stops.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tripData.stops.map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs leading-none"
                    >
                      <span className="truncate max-w-[120px]">{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStop(s)}
                        aria-label={`Remove ${s}`}
                        title="Remove"
                        className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-transparent hover:bg-foreground/10 focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}

          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-6">
          <Button
            onClick={handleCreateTrip}
            disabled={!isFormValid || loading}
            size="lg"
            className="h-11 px-6 text-base"
          >
            {loading ? "Creating..." : "Create Trip"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}