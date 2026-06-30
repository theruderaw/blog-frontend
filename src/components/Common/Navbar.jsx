import { useState } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../Auth/supabaseClient';

function Navbar() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    // Added state to control mobile responsive menu toggle
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            navigate('/mainpage/', { replace: true });
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    if (loading) return null;

    return (
        <nav className="bg-black text-white shadow-sm mb-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    {/* Left: Brand logo */}
                    <div className="flex-shrink-0">
                        <Link className="text-xl font-bold tracking-wider" to={user ? "/home/" : "/mainpage/"}>
                            MyApplication
                        </Link>
                    </div>

                    {/* Center/Right: Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-4 flex-1 justify-between ml-10">
                        <ul className="flex space-x-4">
                            {!user ? (
                                <>
                                    <li>
                                        <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition" to="/">Main Page</Link>
                                    </li>
                                    <li>
                                        <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition" to="/library/">Library</Link>
                                    </li>
                                    <li>
                                        <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition" to="/message/">Send Message</Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition" to="/home/">Home</Link>
                                    </li>
                                    <li>
                                        <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition" to="/dashboard/">Dashboard</Link>
                                    </li>
                                    <li>
                                        <Link className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition" to="/settings/">Settings</Link>
                                    </li>
                                </>
                            )}
                        </ul>

                        {/* Desktop Action Buttons */}
                        <div className="flex items-center">
                            {!user ? (
                                <button 
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition text-sm" 
                                    onClick={() => navigate('/login/')}
                                >
                                    Sign In
                                </button>
                            ) : (
                                <button 
                                    className="border border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-medium py-2 px-4 rounded transition text-sm" 
                                    onClick={handleLogout}
                                >
                                    Log Out
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Mobile Hamburger Button Menu */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Dropdown Panel links */}
            <div className={`${isOpen ? 'block' : 'hidden'} lg:hidden bg-zinc-950 px-2 pt-2 pb-4 space-y-1`}>
                {!user ? (
                    <>
                        <Link className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" to="/" onClick={() => setIsOpen(false)}>Main Page</Link>
                        <Link className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" to="/library/" onClick={() => setIsOpen(false)}>Library</Link>
                        <Link className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" to="/message/" onClick={() => setIsOpen(false)}>Send Message</Link>
                        <button className="w-full text-left mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded text-base" onClick={() => { navigate('/login/'); setIsOpen(false); }}>Sign In</button>
                    </>
                ) : (
                    <>
                        <Link className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" to="/home/" onClick={() => setIsOpen(false)}>Home</Link>
                        <Link className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" to="/dashboard/" onClick={() => setIsOpen(false)}>Dashboard</Link>
                        <Link className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium" to="/settings/" onClick={() => setIsOpen(false)}>Settings</Link>
                        <button className="w-full text-left mt-2 border border-red-600 text-red-500 hover:bg-red-600 hover:text-white font-medium py-2 px-3 rounded text-base" onClick={() => { handleLogout(); setIsOpen(false); }}>Log Out</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;