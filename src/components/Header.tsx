import Logo from './Logo';
import UserMenu from './UserMenu';
import Nav from './Nav';
import SearchBar from './SearchBar';
import Button from './Button';
import { Link } from "react-router-dom";
import { useState } from 'react';   
import {useAuth } from '../context/AuthContext';
import { supabase } from '../supabase/client';


export default function Header() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(prev => !prev);
    
    const { user } = useAuth();

    const handleLogout = async () => {
        await supabase.auth.signOut();
      };

  return (
        <section className="w-full">
            <div className="w-full h-20 flex items-center justify-between px-4 md:px-6">
                <Logo />
                <Nav className='hidden md:flex'/>
                <div className="flex items-center gap-3">
                    <SearchBar className="hidden md:flex w-48 lg:w-56" />
                    <UserMenu className="hidden md:flex"/>
                    <Button className='md:hidden p-2 rounded-md border border-gray-300 flex flex-col gap-1' onClick={toggleMenu}>
                        <span className="block w-5 h-[2px] bg-gray-800" />
                        <span className="block w-5 h-[2px] bg-gray-800" />
                        <span className="block w-5 h-[2px] bg-gray-800" />
                    </Button>
                </div>
            </div>
            {isMenuOpen && (
                <div 
                    className="md:hidden absolute left-0 right-0 top-20 bg-white px-4 pb-4 pt-3 flex flex-col gap-0 shadow-lg z-50">
                        <Nav className="flex flex-col gap-0" onNavigate ={() => setIsMenuOpen(false)} />

                        {!user ? (
                            <Link
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-left text-gray-700 px-3 py-2 rounded-md transition-colors
                                hover:bg-[var(--color-brand-blue)]/10"
                            >
                                Login / Sign Up
                            </Link>
                            ) : (
                            <>
                                <Link
                                to="/dashboard"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-left text-gray-700 font-medium font-[Karla] px-3 py-2 rounded-md transition-colors
                                hover:bg-[var(--color-brand-blue)]/10"
                                >
                                Dashboard
                                </Link>

                                <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="text-left text-gray-700 font-medium font-[Karla] px-3 py-2 rounded-md transition-colors
                                hover:bg-[var(--color-brand-blue)]/10"
                                >
                                Logout
                                </button>
                            </>
                        )}
                </div>
                )}
        </section>
  )
}