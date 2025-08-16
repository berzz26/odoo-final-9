import React, { useState, useMemo } from 'react';
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

// This object maps countries to their respective cities.
const COUNTRY_CITIES = {
  India: ["Goa", "Mumbai", "Delhi", "Bengaluru", "Jaipur", "Kochi", "Pune", "Hyderabad"],
  USA: ["New York", "Los Angeles", "Chicago", "Seattle"],
  UK: ["London", "Manchester", "Edinburgh", "Birmingham"],
  UAE: ["Dubai", "Abu Dhabi", "Sharjah"],
};

const ACTIVITY_CATEGORIES = ["Sightseeing", "Food", "Adventure", "Shopping", "Relaxation", "Nightlife"];

// Define the initial state structure for easy resetting.
const initialActivityState = {
  name: "",
  description: "",
  category: "",
  cost: "",
  duration: "",
};

const initialBudgetState = {
  transportCost: 0,
  stayCost: 0,
  activitiesCost: 0,
  mealsCost: 0,
  totalCost: 0,
};

const initialState = {
  name: "",
  description: "",
  coverPhoto: "",
  start: "",
  end: "",
  country: "",
  stops: [], // Will now hold objects: {id, city, startDate, endDate}
  city: "",
  activities: [], // Will now hold full activity objects
  currentActivity: initialActivityState,
  budget: initialBudgetState,
  isPublic: true,
};


// Main component for the multi-step new trip form.
function NewTrip() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const [currentStep, setCurrentStep] = useState('create');
  const [tripId, setTripId] = useState(null);
  const [createdStopIds, setCreatedStopIds] = useState([]);
  const [tripData, setTripData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useMemo(() => {
    const activitiesCost = tripData.activities.reduce((total, activity) => total + (parseFloat(activity.cost) || 0), 0);
    const { transportCost, stayCost, mealsCost } = tripData.budget;
    const totalCost = (parseFloat(transportCost) || 0) + (parseFloat(stayCost) || 0) + activitiesCost + (parseFloat(mealsCost) || 0);

    setTripData(prev => ({
      ...prev,
      budget: { ...prev.budget, activitiesCost, totalCost }
    }));
  }, [tripData.activities, tripData.budget.transportCost, tripData.budget.stayCost, tripData.budget.mealsCost]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTripData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setTripData(prev => ({ ...prev, isPublic: checked }));
  };

  const handleActivityInputChange = (e) => {
    const { id, value } = e.target;
    setTripData(prev => ({ ...prev, currentActivity: { ...prev.currentActivity, [id]: value } }));
  };

  const handleBudgetInputChange = (e) => {
    const { id, value } = e.target;
    setTripData(prev => ({ ...prev, budget: { ...prev.budget, [id]: value } }));
  };

  const handleActivitySelectChange = (value) => {
    setTripData(prev => ({ ...prev, currentActivity: { ...prev.currentActivity, category: value } }));
  };

  const handleDateChange = (id, value) => {
    setTripData(prev => {
      const newDates = { ...prev, [id]: value };
      if (id === 'start' && newDates.end && newDates.end < value) {
        newDates.end = value;
      }
      return newDates;
    });
  };

  const handleCreateTrip = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }
    const tripPayload = {
      name: tripData.name,
      description: tripData.description || undefined,
      startDate: tripData.start,
      endDate: tripData.end,
      coverPhoto: tripData.coverPhoto || undefined,
      isPublic: tripData.isPublic,
    };
    try {
      const response = await fetch(`/api/trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(tripPayload),
      });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to create trip.");
      const newTrip = await response.json();
      setTripId(newTrip.id);
      setCurrentStep('addStops');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStops = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token || !tripId) return;
    try {
      const stopCreationPromises = tripData.stops.map(stop => {
        const stopPayload = { city: stop.city, country: tripData.country, startDate: stop.startDate, endDate: stop.endDate, tripId: tripId };
        return fetch(`/api/stop/${tripId}/stops`, {
          method: 'POST',
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(stopPayload)
        }).then(async res => {
          if (!res.ok) throw new Error(`Failed to create stop: ${stop.city}`);
          return res.json();
        });
      });
      const createdStops = await Promise.all(stopCreationPromises);
      setCreatedStopIds(createdStops.map(stop => stop.id));
      setCurrentStep('addActivities');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveActivities = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token || !tripId || createdStopIds.length === 0) {
      setError("Cannot save activities without a valid stop.");
      setLoading(false);
      return;
    }
    const firstStopId = createdStopIds[0];
    try {
      if (tripData.activities.length > 0) {
        const activityCreationPromises = tripData.activities.map(activity => {
          const { id, ...activityData } = activity;
          const activityPayload = { ...activityData, cost: activityData.cost ? parseFloat(activityData.cost) : undefined, duration: activityData.duration ? parseInt(activityData.duration, 10) : undefined, stopId: firstStopId, tripId: tripId };
          return fetch(`/api/activity/${tripId}/stops/${firstStopId}/activities`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(activityPayload)
          }).then(async res => {
            if (!res.ok) throw new Error(`Failed to create activity: ${activity.name}`);
            return res.json();
          });
        });
        await Promise.all(activityCreationPromises);
      }
      setCurrentStep('addBudget');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBudget = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");
    if (!token || !tripId) return;
    const { activitiesCost, ...budgetData } = tripData.budget;
    const budgetPayload = { tripId: tripId, transportCost: parseFloat(budgetData.transportCost) || 0, stayCost: parseFloat(budgetData.stayCost) || 0, activitiesCost: parseFloat(activitiesCost) || 0, mealsCost: parseFloat(budgetData.mealsCost) || 0, totalCost: parseFloat(budgetData.totalCost) || 0 };
    try {
      const response = await fetch(`/api/budget/${tripId}/addBudget`, {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(budgetPayload)
      });
      if (!response.ok) throw new Error((await response.json()).message || "Failed to save budget.");
      setCurrentStep('completed');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    setTripData(initialState);
    setCurrentStep('create');
    setTripId(null);
    setCreatedStopIds([]);
    setError(null);
  };

  const citiesForCountry = useMemo(() => (tripData.country ? COUNTRY_CITIES[tripData.country] ?? [] : []), [tripData.country]);
  const remainingCities = useMemo(() => citiesForCountry.filter((c) => !tripData.stops.some(s => s.city === c)), [citiesForCountry, tripData.stops]);

  const handleAddStop = () => {
    if (!tripData.city) return;
    const newStop = { id: crypto.randomUUID(), city: tripData.city, startDate: tripData.start, endDate: tripData.end };
    setTripData(prev => ({ ...prev, stops: [...prev.stops, newStop], city: "" }));
  };

  const handleRemoveStop = (stopIdToRemove) => {
    setTripData(prev => ({ ...prev, stops: prev.stops.filter((s) => s.id !== stopIdToRemove) }));
  };

  const handleStopDateChange = (stopId, field, value) => {
    setTripData(prev => ({
      ...prev,
      stops: prev.stops.map(stop => {
        if (stop.id === stopId) {
          const updatedStop = { ...stop, [field]: value };
          if (field === 'startDate' && updatedStop.endDate < value) {
            updatedStop.endDate = value;
          }
          return updatedStop;
        }
        return stop;
      })
    }));
  };

  const handleAddActivity = () => {
    if (!tripData.currentActivity.name.trim()) return;
    const newActivity = { id: crypto.randomUUID(), ...tripData.currentActivity };
    setTripData(prev => ({ ...prev, activities: [...prev.activities, newActivity], currentActivity: initialActivityState }));
  };

  const handleRemoveActivity = (activityIdToRemove) => {
    setTripData(prev => ({ ...prev, activities: prev.activities.filter((a) => a.id !== activityIdToRemove) }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'create': return <CreateTripStep data={tripData} onInputChange={handleInputChange} onDateChange={handleDateChange} onCheckboxChange={handleCheckboxChange} today={today} />;
      case 'addStops': return <AddStopsStep data={tripData} onDataChange={setTripData} cities={remainingCities} onAdd={handleAddStop} onRemove={handleRemoveStop} onStopDateChange={handleStopDateChange} />;
      case 'addActivities': return <AddActivitiesStep data={tripData.currentActivity} onInputChange={handleActivityInputChange} onSelectChange={handleActivitySelectChange} onAdd={handleAddActivity} onRemove={handleRemoveActivity} addedActivities={tripData.activities} />;
      case 'addBudget': return <AddBudgetStep budget={tripData.budget} onInputChange={handleBudgetInputChange} />;
      case 'completed': return <CompletionStep tripName={tripData.name} />;
      default: return null;
    }
  };

  const renderFooter = () => {
    const buttonClass = "w-full sm:w-auto h-11 px-6 text-base";
    switch (currentStep) {
      case 'create': return <Button onClick={handleCreateTrip} disabled={!tripData.name || !tripData.start || !tripData.end || loading} size="lg" className={buttonClass}>{loading ? "Creating..." : "Save & Continue"}</Button>;
      case 'addStops': return <Button onClick={handleSaveStops} disabled={tripData.stops.length === 0 || loading} size="lg" className={buttonClass}>{loading ? "Saving..." : "Save & Continue"}</Button>;
      case 'addActivities': return <Button onClick={handleSaveActivities} disabled={loading} size="lg" className={buttonClass}>{loading ? "Saving Activities..." : "Continue to Budget"}</Button>;
      case 'addBudget': return <Button onClick={handleSaveBudget} disabled={loading} size="lg" className={buttonClass}>{loading ? "Saving Budget..." : "Finish & Create Trip"}</Button>;
      case 'completed': return <Button onClick={handleStartOver} size="lg" className={buttonClass}>Plan Another Trip</Button>;
      default: return null;
    }
  };

  return (
    <section className="flex justify-center min-h-screen w-screen bg-[#FCEFCB] p-4 sm:p-6">
      <Card className="w-full max-w-3xl h-min p-4 sm:p-6 md:p-8 shadow-lg flex flex-col rounded-3xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            {currentStep === 'create' && 'Let’s Plan a New Trip! ✈️'}
            {currentStep === 'addStops' && 'Where Are You Going? 🌍'}
            {currentStep === 'addActivities' && 'What Will You Do? 🗺️'}
            {currentStep === 'addBudget' && 'What\'s Your Budget? 💰'}
            {currentStep === 'completed' && 'Trip Planned! 🎉'}
          </CardTitle>
          <CardDescription className="text-base">
            {currentStep === 'create' && 'Fill in the basic details to get started.'}
            {currentStep === 'addStops' && 'Select a country, add cities, and set dates for each stop.'}
            {currentStep === 'addActivities' && 'List some of the activities you have planned.'}
            {currentStep === 'addBudget' && 'Enter your estimated costs for the trip.'}
            {currentStep === 'completed' && `Your trip "${tripData.name}" has been created successfully.`}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-grow">
          {renderStepContent()}
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-end gap-2 pt-6 mt-auto">
          {renderFooter()}
        </CardFooter>
      </Card>
    </section>
  );
}

// --- SUB-COMPONENTS FOR EACH STEP ---

const CreateTripStep = ({ data, onInputChange, onDateChange, onCheckboxChange, today }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="name" className="text-base">Trip name</Label>
      <Input id="name" placeholder="e.g. Summer Vacation" value={data.name} onChange={onInputChange} className="h-11 text-base" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="description" className="text-base">Description (optional)</Label>
      <Input id="description" placeholder="A relaxing trip to the mountains." value={data.description} onChange={onInputChange} className="h-11 text-base" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="coverPhoto" className="text-base">Cover Photo URL (optional)</Label>
      <Input id="coverPhoto" type="url" placeholder="https://example.com/photo.jpg" value={data.coverPhoto} onChange={onInputChange} className="h-11 text-base" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
      <div className="space-y-2">
        <Label htmlFor="start" className="text-base">Trip Start Date</Label>
        <Input id="start" type="date" min={today} value={data.start} onChange={(e) => onDateChange('start', e.target.value)} className="h-11 text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end" className="text-base">Trip End Date</Label>
        <Input id="end" type="date" min={data.start || today} value={data.end} onChange={(e) => onDateChange('end', e.target.value)} disabled={!data.start} className="h-11 text-base" />
      </div>
    </div>
    <div className="flex items-center space-x-2 pt-2">
      <input id="isPublic" type="checkbox" checked={data.isPublic} onChange={onCheckboxChange} className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded" />
      <Label htmlFor="isPublic" className="text-base cursor-pointer">Make Itinerary Public</Label>
    </div>
  </div>
);

const AddStopsStep = ({ data, onDataChange, cities, onAdd, onRemove, onStopDateChange }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Label className="text-base">Country</Label>
      <Select value={data.country} onValueChange={(val) => onDataChange(prev => ({ ...prev, country: val, city: "", stops: [] }))}>
        <SelectTrigger className="w-full !bg-white h-11 text-base"><SelectValue placeholder="Choose a country" /></SelectTrigger>
        <SelectContent>{Object.keys(COUNTRY_CITIES).map((c) => <SelectItem key={c} value={c} className="text-base">{c}</SelectItem>)}</SelectContent>
      </Select>
    </div>
    <div className="space-y-3">
      <Label className="text-base">Add a City</Label>
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={data.city} onValueChange={(val) => onDataChange(prev => ({ ...prev, city: val }))} disabled={!data.country || cities.length === 0}>
          <SelectTrigger className="w-full !bg-white h-11 text-base">
            <SelectValue placeholder={data.country ? (cities.length ? "Choose a city" : "All cities added") : "Select a country first"} />
          </SelectTrigger>
          <SelectContent>{cities.map((ct) => <SelectItem key={ct} value={ct} className="text-base">{ct}</SelectItem>)}</SelectContent>
        </Select>
        <Button type="button" className="!border-2 h-11 px-5 text-base w-full sm:w-auto flex-shrink-0" onClick={onAdd} disabled={!data.city}>Add stop</Button>
      </div>
    </div>
    {data.stops.length > 0 && (
      <div className="space-y-4 pt-2">
        <Label className="text-base font-semibold">Your Stops</Label>
        {data.stops.map((stop) => (
          <div key={stop.id} className="p-4 border rounded-lg space-y-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">{stop.city}</p>
              <button type="button" onClick={() => onRemove(stop.id)} aria-label={`Remove ${stop.city}`} className="p-1 rounded-full hover:bg-red-100 text-red-500"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor={`start-${stop.id}`} className="text-sm">Start Date</Label>
                <Input id={`start-${stop.id}`} type="date" value={stop.startDate} min={data.start} max={data.end} onChange={(e) => onStopDateChange(stop.id, 'startDate', e.target.value)} className="h-10 text-sm" />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`end-${stop.id}`} className="text-sm">End Date</Label>
                <Input id={`end-${stop.id}`} type="date" value={stop.endDate} min={stop.startDate} max={data.end} onChange={(e) => onStopDateChange(stop.id, 'endDate', e.target.value)} className="h-10 text-sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AddActivitiesStep = ({ data, onInputChange, onSelectChange, onAdd, onRemove, addedActivities }) => (
  <div className="space-y-6">
    <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-base">Activity Name</Label>
        <Input id="name" placeholder="e.g., Visit the Gateway of India" value={data.name} onChange={onInputChange} className="h-11 text-base" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-base">Category</Label>
          <Select value={data.category} onValueChange={onSelectChange}>
            <SelectTrigger className="w-full !bg-white h-11 text-base"><SelectValue placeholder="Choose a category" /></SelectTrigger>
            <SelectContent>{ACTIVITY_CATEGORIES.map((c) => <SelectItem key={c} value={c} className="text-base">{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost" className="text-base">Cost (optional)</Label>
          <Input id="cost" type="number" placeholder="e.g., 50" value={data.cost} onChange={onInputChange} className="h-11 text-base" />
        </div>
      </div>
      <div className="flex justify-end pt-2">
        <Button type="button" className="!border-2 h-11 px-5 text-base w-full sm:w-auto" onClick={onAdd} disabled={!data.name.trim()}>Add Activity</Button>
      </div>
    </div>
    {addedActivities.length > 0 && (
      <div className="space-y-4 pt-2">
        <Label className="text-base font-semibold">Your Activities</Label>
        {addedActivities.map((act) => (
          <div key={act.id} className="p-4 border rounded-lg space-y-2 bg-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">{act.name}</p>
                {act.description && <p className="text-sm text-gray-600">{act.description}</p>}
              </div>
              <button type="button" onClick={() => onRemove(act.id)} aria-label={`Remove ${act.name}`} className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0 ml-2"><X size={18} /></button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-800 pt-1">
              {act.category && <Badge variant="outline">{act.category}</Badge>}
              {act.cost && <span>Cost: ${act.cost}</span>}
              {act.duration && <span>Duration: {act.duration} min</span>}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AddBudgetStep = ({ budget, onInputChange }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
      <div className="space-y-2">
        <Label htmlFor="transportCost" className="text-base">Transport Cost</Label>
        <Input id="transportCost" type="number" placeholder="e.g., 500" value={budget.transportCost} onChange={onInputChange} className="h-11 text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stayCost" className="text-base">Accommodation Cost</Label>
        <Input id="stayCost" type="number" placeholder="e.g., 1000" value={budget.stayCost} onChange={onInputChange} className="h-11 text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="mealsCost" className="text-base">Meals Cost</Label>
        <Input id="mealsCost" type="number" placeholder="e.g., 300" value={budget.mealsCost} onChange={onInputChange} className="h-11 text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="activitiesCost" className="text-base">Activities Cost (Auto-calculated)</Label>
        <Input id="activitiesCost" type="number" value={budget.activitiesCost} disabled className="h-11 text-base bg-gray-100 cursor-not-allowed" />
      </div>
    </div>
    <div className="pt-4 border-t">
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-baseline gap-2 text-right">
        <p className="text-md sm:text-lg font-semibold">Total Estimated Cost:</p>
        <span className="text-2xl sm:text-3xl font-bold text-green-600">${budget.totalCost.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const CompletionStep = ({ tripName }) => (
  <div className="text-center py-8">
    <h2 className="text-xl sm:text-2xl font-semibold">Congratulations!</h2>
    <p className="text-gray-600 mt-2">Your new trip, "{tripName}", is ready to go.</p>
    <p className="text-gray-600 mt-1">Have an amazing adventure!</p>
  </div>
);

export default function App() {
  return <NewTrip />;
}