import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, MapPin, PlusCircle, List, Calendar } from "lucide-react";

// Custom hook for authentication state
function useAuthStatus() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true);
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${authToken}` },
  });

        if (!response.ok) {
          throw new Error("Failed to fetch user data with provided token.");
        }

        const userData = await response.json();
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("User data fetch failed:", error);
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [location]);

  return { user, isLoggedIn, isLoading };
}

export default function Navbar() {
  const { user, isLoggedIn, isLoading } = useAuthStatus();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-200 shadow-sm">
      <nav className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-amber-900 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-amber-50 flex items-center gap-2"
          style={{ fontFamily: '"Caveat", cursive' }}
        >
          <MapPin className="h-6 w-6 text-amber-600" />
          GlobeTrotter
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Link to="/community" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl !text-amber-900 font-medium transition-all duration-200 hover:from-amber-200 hover:to-orange-200 hover:border-amber-300 hover:scale-105 shadow-sm">Community</Link>
          {/* My Trips dropdown - only when logged in */}
          {!isLoading && isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-xl text-amber-900 font-medium transition-all duration-200 hover:from-amber-200 hover:to-orange-200 hover:border-amber-300 hover:scale-105 shadow-sm">
                  My Trips
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-56 bg-white border border-amber-200 rounded-xl shadow-xl p-2"
              >
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link 
                    to="/itenary-section" 
                    className="flex items-center gap-3 px-3 py-2 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Calendar className="h-4 w-4 text-amber-600" />
                    Planned Trips
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link 
                    to="/newtrip" 
                    className="flex items-center gap-3 px-3 py-2 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <PlusCircle className="h-4 w-4 text-amber-600" />
                    Create New Trip
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link 
                    to="/triplisting" 
                    className="flex items-center gap-3 px-3 py-2 text-amber-900 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <List className="h-4 w-4 text-amber-600" />
                    List My Trips
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
          )}

          {/* Avatar if logged in, or sign up/login links if not */}
          {!isLoading && isLoggedIn ? (
            <Link
              to="/user-info"
              aria-label="Account"
              className="rounded-full p-1 hover:bg-amber-50 transition-all duration-200 hover:scale-110"
            >
              <Avatar className="h-10 w-10 border-2 border-amber-200 shadow-sm">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-900 font-semibold">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            
          ) : (
            !isLoading && (
              <div className="flex items-center gap-3">
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-xl font-medium text-amber-900 transition-all duration-200 hover:bg-amber-50 border border-transparent hover:border-amber-200"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:scale-105 shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
              </div>
            )
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-16 bg-amber-100 rounded-lg animate-pulse"></div>
              <div className="h-8 w-16 bg-amber-100 rounded-lg animate-pulse"></div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}