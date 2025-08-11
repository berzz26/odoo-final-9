import { Routes, Route, Link, Outlet } from "react-router-dom"
import NewTrip from "./pages/NewTrip"
import Dashboard from "./pages/Dashboard"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
function Layout() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <header className="border-b bg-white">
        <div className="flex justify-center items-center w-full">
          <NavigationMenu className="w-full flex justify-center p-3">
            <NavigationMenuList className="flex gap-6 justify-center items-center">  
            <NavigationMenuItem>
              <NavigationMenuTrigger className="!bg-white hover:!border-0 hover:!bg-black/5">
                <Link to="/newtrip" className="!text-blue font-bold">My Trips</Link>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="!bg-white hover:!border-0 hover:!bg-black/5">
                <Link to="/explore" className="!text-blue font-bold">Explore</Link>
              </NavigationMenuTrigger>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link to="/" className="!text-[#135D66] font-bold">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <nav style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
  <Link to="/newtrip">New Trip</Link>
      </nav>

 
      <Routes>
   <Route path="/" element={<Dashboard />} />
  <Route path="/newtrip" element={<NewTrip />} />
  <Route path="/signup" element={<Signup />} />

  
        <Route path="*" element={<div style={{padding:16}}>Not found</div>} />
      </Routes>
    </>
  )
}
