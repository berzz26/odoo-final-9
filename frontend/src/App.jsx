import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import NewTrip from "./pages/NewTrip";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Login from "./pages/Login";
import ItenarySection from "./pages/ItenarySection";
import TripItenary from "./pages/TripItenary";
import Triplisting from "./pages/Triplisting";



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
        <Route path="/" element={<Dashboard />} />
        <Route path="/newtrip" element={<NewTrip />} />
        <Route path="/itenary-section" element={<ItenarySection/>}/>
          <Route path="/trips/:tripId" element={<TripItenary />} />
        <Route path="/signup" element={<Signup/>}/>
<<<<<<< HEAD
        <Route path="/triplisting" element={<Triplisting />} />
        {/* <Route path="/tripcard" element={<tripCard />} /> */}
=======
        <Route path="/login" element={<Login />} />
>>>>>>> 53191b7826ee8202768031ae7dea5b74c3709fe1
        <Route path="*" element={<div>Not found</div>} />
      </Route>
    </Routes>
  );
}