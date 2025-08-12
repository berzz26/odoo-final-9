import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import NewTrip from "./pages/NewTrip";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ItenarySection from "./pages/ItenarySection";
import TripItenary from "./pages/TripItenary";
import Triplisting from "./pages/Triplisting";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import TripPage from "./pages/TripPage";


function Shell() {
  const full = true;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Navbar />
      <main className={full ? "w-full" : " w-full max-w-5xl px-4 py-6"}>
        <Outlet />
      </main>
    </div>
  );
}


export default function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Dashboard />} />
        <Route path="/trip/:id" element={<TripPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/newtrip" element={<NewTrip />} />
        <Route path="/itenary-section" element={<ItenarySection/>}/>
          <Route path="/trips/:tripId" element={<TripItenary />} />
          <Route path="/community" element={<Community/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="user-info" element={<Profile/>}/>
        <Route path="/triplisting" element={<Triplisting />} />
        {/* <Route path="/tripscard" element={<tripCard />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<div>Not found</div>} />
      </Route>
    </Routes>
  );
}