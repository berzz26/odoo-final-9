import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

try {
  const response = await fetch('https://odoo-final-9.onrender.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // If not, parse the error message from the response body
    // Use a separate try/catch for this to handle non-JSON error messages
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to authenticate.');
  }

  // If the response is OK, then parse the user data
  const user = await response.json();
  console.log(user);

} catch (error) {
  // Catch both network errors and the custom error thrown above
  console.error('Login failed:', error.message);
  // You can also handle displaying the error to the user here
}
// (The corrected useAuthStatus hook goes here)
function useAuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);
  }, [location]);
  return isLoggedIn;
}

export default function Navbar() {
  const isLoggedIn = useAuthStatus();
  const navigate = useNavigate();

  // This effect ensures the user is redirected to the dashboard after a successful login.
  // It should probably be in a parent component, but this will work for now.
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      navigate("/");
    }
  }, []); // Run only once on mount to handle initial load.

  // The rest of your Navbar component's render logic...
  const linkCls =
    "text-xl font-medium px-2 py-1 rounded-md transition-colors hover:bg-gray-500/10";
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
          {isLoggedIn && (
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
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isLoggedIn ? (
            <Link
              to="/account"
              aria-label="Account"
              className="rounded-full p-1 hover:bg-gray-500/10 transition-colors"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
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