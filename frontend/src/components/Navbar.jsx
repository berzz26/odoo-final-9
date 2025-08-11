import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

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
        const response = await fetch("http://192.168.103.71:3000/api/auth/me", {
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
  const linkCls = "text-xl font-medium px-2 py-1 rounded-md transition-colors hover:bg-gray-500/10";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto w-full max-w-5xl px-2 py-3 flex items-center">
        <Link
          to="/"
          className="text-xl font-semibold px-2 py-1 rounded-md transition-colors hover:bg-gray-500/10"
        >
          GlobalTrotter
        </Link>
        <div className="ml-auto flex items-center gap-6">
          {/* My Trips dropdown - only when logged in */}
          {!isLoading && isLoggedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`${linkCls} flex items-center gap-1 !bg-white !text-[#646CFF] !text-xl hover:bg-gray-100 dark:bg-white dark:text-gray-900`}
                >
                  My Trips
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/itenary-section">Planned trips</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/newtrip">Create new trip</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/triplisting">List My Trips</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Avatar if logged in, or sign up/login links if not */}
          {!isLoading && isLoggedIn ? (
            <Link
              to="/account"
              aria-label="Account"
              className="rounded-full p-1 hover:bg-gray-500/10 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/signup"
                className="px-3 py-1.5 rounded-md font-semibold text-xl transition-colors hover:bg-gray-500/10"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md font-semibold text-xl transition-colors hover:bg-gray-500/10"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
