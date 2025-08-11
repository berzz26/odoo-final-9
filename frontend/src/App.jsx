import { Routes, Route, Link } from 'react-router-dom'
import NewTrip from "./pages/NewTrip"
import Dashboard from "./pages/Dashboard"
export default function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
  <Link to="/newtrip">New Trip</Link>
      </nav>

      <Routes>
   <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/newtrip" element={<NewTrip />} />
        <Route path="*" element={<div style={{padding:16}}>Not found</div>} />
      </Routes>
    </>
  )
}
