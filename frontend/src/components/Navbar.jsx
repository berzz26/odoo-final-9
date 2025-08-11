import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const TOKEN_KEY = "token";
function useAuthToken() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const check = () => setIsLoggedIn(!!localStorage.getItem(TOKEN_KEY));
    check();
    window.addEventListener("storage", check);
    window.addEventListener("focus", check);
    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("focus", check);
    };
  }, []);
  return isLoggedIn;
}

export default function Navbar() {
  const isLoggedIn = useAuthToken();

  const linkCls =
    "text-xl font-medium px-2 py-1 rounded-md transition-colors hover:bg-gray-500/10";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <nav className="mx-auto w-full max-w-5xl px-2 py-3 flex items-center">
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-semibold px-2 py-1 rounded-md transition-colors hover:bg-gray-500/10"
        >
          GlobalTrotter
        </Link>

        {/* Right */}
        <div className="ml-auto flex items-center gap-6">
          {/* My Trips dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
  className={`${linkCls} flex items-center gap-1
              !bg-white !text-[#646CFF] !text-xl  hover:bg-gray-100
             
              dark:bg-white dark:text-gray-900`}
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

          {/* Explore (plain link) */}
          {/* <Link to="/explore" className={linkCls}>
            Explore
          </Link> */}

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
