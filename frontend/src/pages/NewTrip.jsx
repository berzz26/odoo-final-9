import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";

const PLACES = [
  "Goa",
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Jaipur",
  "Kochi",
  "Pune",
  "Hyderabad",
];

export default function NewTrip() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const isFormValid = tripName && destination && start && end;

  const handleCreateTrip = () => {
    console.log("Creating new trip:", {
        name: tripName,
        destination,
        startDate: start,
        endDate: end,
    });
  }

  return (
    <section className="flex w-full items-center justify-center bg-gray-50 min-h-screen p-0">
      <Card className="w-full h-screen shadow-lg flex flex-col justify-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Let’s Plan a New Trip!</CardTitle>
          <CardDescription>
            Fill in the details below to start planning your next journey.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="trip-name">Trip name</Label>
              <Input
                id="trip-name"
                placeholder="e.g. Goa Getaway"
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

            <div className="space-y-2">
              <Label>Destination</Label>
              <Select value={destination} onValueChange={setDestination}>
                <SelectTrigger
                  className="w-full !bg-white"
                  aria-label="Select destination"
                >
                  <SelectValue placeholder="Choose a place" />
                </SelectTrigger>
                <SelectContent>
                  {PLACES.map((place) => (
                    <SelectItem key={place} value={place}>
                      {place}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
