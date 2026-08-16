import Button from "./Button";
import { Link } from "react-router-dom";
import { useEffect, useId, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";
import { logout } from "../services/auth";
import toast from "react-hot-toast";
import { getErrorMessage } from "../utils/errors";

interface UserMenuProps {
  className?: string;
  style?: React.CSSProperties;
}

export default function UserMenu({ className, style }: UserMenuProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuId = useId();
  const triggerId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const shouldFocusFirstItem = useRef(false);

  const handleLogout = async () => {
    setIsOpen(false);
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
    if (!isOpen) return;

    if (shouldFocusFirstItem.current) {
      shouldFocusFirstItem.current = false;
      menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <nav
      aria-label="Account navigation"
      className={`flex items-center gap-3 ${className || ""}`}
      style={style}
    >
      <div
        ref={containerRef}
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => {
          if (!containerRef.current?.contains(document.activeElement)) {
            setIsOpen(false);
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsOpen(false);
          }
        }}
      >
        <Button
          ref={triggerRef}
          id={triggerId}
          type="button"
          aria-controls={menuId}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          onClick={() => setIsOpen((previous) => !previous)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              if (isOpen) {
                menuRef.current
                  ?.querySelector<HTMLElement>('[role="menuitem"]')
                  ?.focus();
              } else {
                shouldFocusFirstItem.current = true;
                setIsOpen(true);
              }
            }
          }}
          variant="primary"
          className="h-10 px-4 rounded-md font-medium font-[Karla] text-sm transition-colors flex items-center justify-center"
        >
          {user ? "Account" : "Login / Sign Up"}
        </Button>
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-labelledby={triggerId}
          className={`absolute right-0 top-full mt-1 w-48 overflow-hidden bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-200 z-10 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          {!user ? (
            <>
              <Link
                to="/login"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-navy)] transition-colors font-[Karla]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-navy)] transition-colors font-[Karla]"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/dashboard"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-navy)] transition-colors font-[Karla]"
              >
                Dashboard
              </Link>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-navy)] transition-colors font-[Karla]"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
