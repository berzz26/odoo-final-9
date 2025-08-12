
import React, { useState, useMemo } from 'react';
// Removed useNavigate as it's not used in this self-contained component.
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
};


// Main component for the multi-step new trip form.
function NewTrip() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  // State to manage which step of the form is currently active.
  const [currentStep, setCurrentStep] = useState('create'); // 'create', 'addStops', 'addActivities', 'addBudget', 'completed'
  const [tripId, setTripId] = useState(null); // To store the ID of the trip once created.
  const [createdStopIds, setCreatedStopIds] = useState([]); // To store IDs of created stops.

  // Centralized state for all form data across all steps.
  const [tripData, setTripData] = useState(initialState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Automatically calculate total activities cost and total budget.
  useMemo(() => {
      const activitiesCost = tripData.activities.reduce((total, activity) => total + (parseFloat(activity.cost) || 0), 0);
      const { transportCost, stayCost, mealsCost } = tripData.budget;
      const totalCost = (parseFloat(transportCost) || 0) + (parseFloat(stayCost) || 0) + activitiesCost + (parseFloat(mealsCost) || 0);

      setTripData(prev => ({
          ...prev,
          budget: {
              ...prev.budget,
              activitiesCost,
              totalCost,
          }
      }));
  }, [tripData.activities, tripData.budget.transportCost, tripData.budget.stayCost, tripData.budget.mealsCost]);


  // --- HANDLERS FOR INPUT CHANGES ---

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTripData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleActivityInputChange = (e) => {
      const { id, value } = e.target;
      setTripData(prev => ({
          ...prev,
          currentActivity: {
              ...prev.currentActivity,
              [id]: value,
          }
      }));
  };
  
  const handleBudgetInputChange = (e) => {
      const { id, value } = e.target;
      setTripData(prev => ({
          ...prev,
          budget: {
              ...prev.budget,
              [id]: value,
          }
      }));
  };
  
  const handleActivitySelectChange = (value) => {
       setTripData(prev => ({
          ...prev,
          currentActivity: {
              ...prev.currentActivity,
              category: value,
          }
      }));
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

  // --- API CALLS & STEP TRANSITIONS ---

  // Step 1: Create the basic trip entry.
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
    };

    try {
      const response = await fetch("http://192.168.103.71:3000/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(tripPayload),
      });

      if (!response.ok) throw new Error((await response.json()).message || "Failed to create trip.");
      
      const newTrip = await response.json();
      setTripId(newTrip.id); // Save the new trip's ID
      setCurrentStep('addStops'); // Move to the next step

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Create each stop individually with its own dates.
  const handleSaveStops = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token || !tripId) return;

      try {
          // Create a POST request for each stop in the list.
          const stopCreationPromises = tripData.stops.map(stop => {
              const stopPayload = {
                  city: stop.city,
                  country: tripData.country,
                  startDate: stop.startDate,
                  endDate: stop.endDate,
                  tripId: tripId,
              };
              return fetch(`http://192.168.103.71:3000/api/stop/${tripId}/stops`, {
                  method: 'POST',
                  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                  body: JSON.stringify(stopPayload)
              }).then(async res => {
                  if (!res.ok) {
                      const errorData = await res.json();
                      console.error("Error creating stop:", errorData);
                      throw new Error(`Failed to create stop: ${stop.city}`);
                  }
                  return res.json();
              });
          });

          const createdStops = await Promise.all(stopCreationPromises);
          setCreatedStopIds(createdStops.map(stop => stop.id)); // Save the new stop IDs
          setCurrentStep('addActivities'); // Move to the final step

      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };

  // Step 3: Create each activity and associate it with the first stop.
  const handleSaveActivities = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token || !tripId || createdStopIds.length === 0) {
          setError("Cannot save activities without a valid stop.");
          setLoading(false);
          return;
      }

      const firstStopId = createdStopIds[0]; // Associate all activities with the first stop.

      try {
          if (tripData.activities.length > 0) {
              const activityCreationPromises = tripData.activities.map(activity => {
                  const { id, ...activityData } = activity; // Exclude temp id from payload
                  const activityPayload = {
                      ...activityData,
                      cost: activityData.cost ? parseFloat(activityData.cost) : undefined,
                      duration: activityData.duration ? parseInt(activityData.duration, 10) : undefined,
                      stopId: firstStopId,
                      tripId: tripId, 
                  };
                  return fetch(`http://192.168.103.71:3000/api/activity/${tripId}/stops/${firstStopId}/activities`, {
                      method: 'POST',
                      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                      body: JSON.stringify(activityPayload)
                  }).then(async res => {
                      if (!res.ok) {
                          const errorData = await res.json();
                          console.error("Error creating activity:", errorData);
                          throw new Error(`Failed to create activity: ${activity.name}`);
                      }
                      return res.json();
                  });
              });
              await Promise.all(activityCreationPromises);
          }
          setCurrentStep('addBudget'); // Move to budget step regardless of whether activities were added

      } catch (err) {
          setError(err.message);
      } finally {
          setLoading(false);
      }
  };
  
  // Step 4: Save the budget for the trip.
  const handleSaveBudget = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token || !tripId) return;
      
      const { activitiesCost, ...budgetData } = tripData.budget;

      const budgetPayload = {
          tripId: tripId,
          transportCost: parseFloat(budgetData.transportCost) || 0,
          stayCost: parseFloat(budgetData.stayCost) || 0,
          activitiesCost: parseFloat(activitiesCost) || 0,
          mealsCost: parseFloat(budgetData.mealsCost) || 0,
          totalCost: parseFloat(budgetData.totalCost) || 0,
      };

      try {
          const response = await fetch(`http://192.168.103.71:3000/api/budget/${tripId}/addBudget`, {
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

  // Resets the form to its initial state to plan another trip.
  const handleStartOver = () => {
      setTripData(initialState);
      setCurrentStep('create');
      setTripId(null);
      setCreatedStopIds([]);
      setError(null);
  };

  // --- LOGIC FOR STOPS & ACTIVITIES ---

  const citiesForCountry = useMemo(() => (tripData.country ? COUNTRY_CITIES[tripData.country] ?? [] : []), [tripData.country]);
  const remainingCities = useMemo(() => citiesForCountry.filter((c) => !tripData.stops.some(s => s.city === c)), [citiesForCountry, tripData.stops]);
  
  const handleAddStop = () => {
    if (!tripData.city) return;
    const newStop = {
        id: crypto.randomUUID(), // Temp ID for React key
        city: tripData.city,
        startDate: tripData.start, // Default to trip start date
        endDate: tripData.end, // Default to trip end date
    };
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
                  // Ensure end date is not before start date
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
    const newActivity = {
        id: crypto.randomUUID(),
        ...tripData.currentActivity
    };
    setTripData(prev => ({ 
        ...prev, 
        activities: [...prev.activities, newActivity], 
        currentActivity: initialActivityState 
    }));
  };

  const handleRemoveActivity = (activityIdToRemove) => {
    setTripData(prev => ({ ...prev, activities: prev.activities.filter((a) => a.id !== activityIdToRemove)}));
  };

  // --- DYNAMIC CONTENT FOR EACH STEP ---

  const renderStepContent = () => {
    switch (currentStep) {
      case 'create':
        return <CreateTripStep data={tripData} onInputChange={handleInputChange} onDateChange={handleDateChange} today={today} />;
      case 'addStops':
        return <AddStopsStep data={tripData} onDataChange={setTripData} cities={remainingCities} onAdd={handleAddStop} onRemove={handleRemoveStop} onStopDateChange={handleStopDateChange} />;
      case 'addActivities':
        return <AddActivitiesStep data={tripData.currentActivity} onInputChange={handleActivityInputChange} onSelectChange={handleActivitySelectChange} onAdd={handleAddActivity} onRemove={handleRemoveActivity} addedActivities={tripData.activities} />;
      case 'addBudget':
        return <AddBudgetStep budget={tripData.budget} onInputChange={handleBudgetInputChange} />;
      case 'completed':
        return <CompletionStep tripName={tripData.name} />;
      default:
        return null;
    }
  };

  const renderFooter = () => {
    switch (currentStep) {
      case 'create':
        return <Button onClick={handleCreateTrip} disabled={!tripData.name || !tripData.start || !tripData.end || loading} size="lg" className="h-11 px-6 text-base">{loading ? "Creating..." : "Save & Continue"}</Button>;
      case 'addStops':
        return <Button onClick={handleSaveStops} disabled={tripData.stops.length === 0 || loading} size="lg" className="h-11 px-6 text-base">{loading ? "Saving..." : "Save & Continue"}</Button>;
      case 'addActivities':
        return <Button onClick={handleSaveActivities} disabled={loading} size="lg" className="h-11 px-6 text-base">{loading ? "Saving Activities..." : "Continue to Budget"}</Button>;
      case 'addBudget':
        return <Button onClick={handleSaveBudget} disabled={loading} size="lg" className="h-11 px-6 text-base">{loading ? "Saving Budget..." : "Finish & Create Trip"}</Button>;
      case 'completed':
        return <Button onClick={handleStartOver} size="lg" className="h-11 px-6 text-base">Plan Another Trip</Button>;
      default:
        return null;
    }
  };

  return (
    <section className="flex justify-center min-h-screen w-screen bg-gray-50 p-6">
      <Card className="w-full max-w-3xl h-min p-8 shadow-lg flex flex-col rounded-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            {currentStep === 'create' && 'Let’s Plan a New Trip! ✈️'}
            {currentStep === 'addStops' && 'Where Are You Going? �'}
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

        <CardContent>
          {renderStepContent()}
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 pt-6">
          {renderFooter()}
        </CardFooter>
      </Card>
    </section>
  );
}

// --- SUB-COMPONENTS FOR EACH STEP ---

const CreateTripStep = ({ data, onInputChange, onDateChange, today }) => (
  <div className="space-y-8">
    <div className="space-y-2">
      <Label htmlFor="name" className="text-base">Trip name</Label>
      <Input id="name" placeholder="e.g. Summer Vacation" value={data.name} onChange={onInputChange} className="h-11 text-base" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="description" className="text-base">Description (optional)</Label>
      <Input id="description" placeholder="e.g., A relaxing trip to the mountains." value={data.description} onChange={onInputChange} className="h-11 text-base" />
    </div>
    <div className="space-y-2">
      <Label htmlFor="coverPhoto" className="text-base">Cover Photo URL (optional)</Label>
      <Input id="coverPhoto" type="url" placeholder="https://example.com/photo.jpg" value={data.coverPhoto} onChange={onInputChange} className="h-11 text-base" />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="start" className="text-base">Trip Start Date</Label>
        <Input id="start" type="date" min={today} value={data.start} onChange={(e) => onDateChange('start', e.target.value)} className="h-11 text-base" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end" className="text-base">Trip End Date</Label>
        <Input id="end" type="date" min={data.start || today} value={data.end} onChange={(e) => onDateChange('end', e.target.value)} disabled={!data.start} className="h-11 text-base" />
      </div>
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
            <div className="flex gap-3">
                <Select value={data.city} onValueChange={(val) => onDataChange(prev => ({ ...prev, city: val }))} disabled={!data.country || cities.length === 0}>
                    <SelectTrigger className="w-full !bg-white h-11 text-base">
                        <SelectValue placeholder={data.country ? (cities.length ? "Choose a city" : "All cities added") : "Select a country first"} />
                    </SelectTrigger>
                    <SelectContent>{cities.map((ct) => <SelectItem key={ct} value={ct} className="text-base">{ct}</SelectItem>)}</SelectContent>
                </Select>
                <Button type="button" className="!border-2 h-11 px-5 text-base" onClick={onAdd} disabled={!data.city}>Add stop</Button>
            </div>
        </div>

        {data.stops.length > 0 && (
            <div className="space-y-4">
                <Label className="text-base">Your Stops</Label>
                {data.stops.map((stop) => (
                    <div key={stop.id} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold text-lg">{stop.city}</p>
                            <button type="button" onClick={() => onRemove(stop.id)} aria-label={`Remove ${stop.city}`} className="p-1 rounded-full hover:bg-red-100 text-red-500"><X size={16} /></button>
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
                <Input id="name" placeholder="e.g., Visit the Eiffel Tower" value={data.name} onChange={onInputChange} className="h-11 text-base" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="description" className="text-base">Description (optional)</Label>
                <Input id="description" placeholder="e.g., A guided tour of the famous landmark." value={data.description} onChange={onInputChange} className="h-11 text-base" />
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
                 <div className="space-y-2">
                    <Label htmlFor="duration" className="text-base">Duration in minutes (optional)</Label>
                    <Input id="duration" type="number" placeholder="e.g., 120" value={data.duration} onChange={onInputChange} className="h-11 text-base" />
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="button" className="!border-2 h-11 px-5 text-base" onClick={onAdd} disabled={!data.name.trim()}>Add Activity</Button>
            </div>
        </div>

        {addedActivities.length > 0 && (
            <div className="space-y-4">
                <Label className="text-base">Your Activities</Label>
                {addedActivities.map((act) => (
                    <div key={act.id} className="p-4 border rounded-lg space-y-2 bg-white">
                         <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-lg">{act.name}</p>
                                {act.description && <p className="text-sm text-gray-600">{act.description}</p>}
                            </div>
                            <button type="button" onClick={() => onRemove(act.id)} aria-label={`Remove ${act.name}`} className="p-1 rounded-full hover:bg-red-100 text-red-500 flex-shrink-0"><X size={16} /></button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-800">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="activitiesCost" className="text-base">Activities Cost</Label>
                <Input id="activitiesCost" type="number" value={budget.activitiesCost} disabled className="h-11 text-base bg-gray-100" />
            </div>
        </div>
        <div className="pt-4 border-t">
            <div className="flex justify-end items-center">
                 <p className="text-lg font-semibold">Total Estimated Cost: <span className="text-2xl font-bold text-green-600">${budget.totalCost.toFixed(2)}</span></p>
            </div>
        </div>
    </div>
);


const CompletionStep = ({ tripName }) => (
  <div className="text-center py-8">
    <h2 className="text-2xl font-semibold">Congratulations!</h2>
    <p className="text-gray-600 mt-2">Your new trip, "{tripName}", is ready to go.</p>
    <p className="text-gray-600 mt-1">Have an amazing adventure!</p>
  </div>
);


// The main App component that renders our NewTrip flow.
export default function App() {
  return <NewTrip />;
}
