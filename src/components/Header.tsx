import Logo from "./Logo";
import UserMenu from "./UserMenu";
import Nav from "./Nav";
import SearchBar from "./SearchBar";
import Button from "./Button";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import { logout } from "../services/auth";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errors";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const { user } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Could not log out. Please try again."),
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen]);

  return (
    <section className="w-full">
      <div className="w-full h-20 flex items-center justify-between px-4 md:px-6">
        <Logo />
        <Nav className="hidden md:flex" />
        <div className="flex items-center gap-3">
          <SearchBar className="hidden md:flex w-48 lg:w-56" />
          <UserMenu className="hidden md:flex" />
          <Button
            ref={mobileMenuButtonRef}
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            size="icon"
            className="md:hidden border border-gray-300 flex items-center justify-center"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FaTimes aria-hidden="true" />
            ) : (
              <FaBars aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="md:hidden absolute left-0 right-0 top-20 bg-white px-4 pb-4 pt-3 flex flex-col gap-0 shadow-lg z-50"
        >
          <Nav
            className="flex flex-col gap-0"
            onNavigate={() => setIsMenuOpen(false)}
          />

          {!user ? (
            <Link
              to="/login"
              onClick={() => setIsMenuOpen(false)}
              className="text-left text-gray-700 px-3 py-2 rounded-md transition-colors
                                hover:bg-[var(--color-brand-navy)]/10"
            >
              Login / Sign Up
            </Link>
          ) : (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-left text-gray-700 font-medium font-[Karla] px-3 py-2 rounded-md transition-colors
                                hover:bg-[var(--color-brand-navy)]/10"
              >
                Dashboard
              </Link>

              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => {
                  setIsMenuOpen(false);
                  void handleLogout();
                }}
                className="text-left text-gray-700 font-medium font-[Karla] px-3 py-2 rounded-md transition-colors
                                hover:bg-[var(--color-brand-navy)]/10"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}
