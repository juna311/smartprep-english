import Button from './Button';
import { Link } from "react-router-dom";
import {useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';

interface UserMenuProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function UserMenu({className, style}:UserMenuProps) {
    const { user } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
      };
    return (
        <nav className={`flex items-center gap-3 ${className || ''}`} style={style}>
            <div className="relative group">
                <Button className="h-10 px-4 bg-[var(--color-brand-blue)] hover:opacity-90 text-white rounded-md font-medium font-[Karla] text-sm transition-colors flex items-center justify-center">
                    {user ? "Account" : "Login / Sign Up"}
                </Button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {!user ? (
                        <>
                        <Link
                            to="/login"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-blue)] transition-colors font-[Karla]"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-blue)] transition-colors font-[Karla]"
                        >
                            Sign Up
                        </Link>
                        </>
                    ) : (
                        <>
                        <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-blue)] transition-colors font-[Karla]"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[var(--color-brand-blue)] transition-colors font-[Karla]"
                        >
                            Logout
                        </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}