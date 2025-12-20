import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import MobileNav from './MobileNav';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../shop/CartDrawer';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/land', label: 'Land Access' },
    { path: '/funding', label: 'Funding Hub' },
    { path: '/ai', label: 'AI Insight' },
];

export default function Header({ title = 'VossAgro', actionButton }) {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (isProfileOpen && !event.target.closest('.relative.group')) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileOpen]);

    return (
        <>
            <header className="flex justify-between items-center p-6 shadow-md bg-white sticky top-0 z-40">
                <h1 className="text-2xl font-bold text-green-700">
                    <Link to="/">{title}</Link>
                </h1>

                {/* Desktop Navigation - shows at 900px+ */}
                <nav className="space-x-6 hidden min-[900px]:flex">
                    {navLinks.map((link) => {
                        // Hide Funding Hub for buyers or unauthenticated users
                        if (link.path === '/funding' && (user?.role === 'buyer' || !isAuthenticated)) return null;

                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`hover:text-green-600 transition-colors ${location.pathname === link.path ? 'text-green-700 font-semibold' : ''
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Mobile Menu Button - shows below 900px */}
                <div className="min-[900px]:hidden flex items-center space-x-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-gray-600 hover:text-green-600"
                    >
                        <ShoppingCart size={24} />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </button>
                    <Button onClick={() => setIsNavOpen(!isNavOpen)} className="p-2">
                        {isNavOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>

                {/* Desktop Action Button - shows at 900px+ */}
                <div className="hidden min-[900px]:flex items-center space-x-4">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2 text-gray-600 hover:text-green-600 mr-2"
                    >
                        <ShoppingCart size={24} />
                        {itemCount > 0 && (
                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {actionButton ? actionButton : isAuthenticated ? (
                        <div className="relative group">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-2 text-gray-700 hover:text-green-600 focus:outline-none"
                            >
                                <div className="bg-green-100 p-2 rounded-full">
                                    <User size={20} className="text-green-700" />
                                </div>
                                <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                                <svg className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        My Profile
                                    </Link>

                                    {user?.role === 'farmer' && (
                                        <>
                                            <Link
                                                to="/my-funding"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                My Funding
                                            </Link>
                                            <Link
                                                to="/land-management"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Land Management
                                            </Link>
                                        </>
                                    )}


                                    {(user?.role === 'buyer' || user?.role === 'investor' || user?.role === 'farmer') && (
                                        <Link
                                            to="/my-inquiries"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            My Inquiries
                                        </Link>
                                    )}

                                    {user?.role === 'investor' && (
                                        <Link
                                            to="/investor-dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Investor Dashboard
                                        </Link>
                                    )}

                                    {user?.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={() => {
                                            const isAdmin = user?.role === 'admin';
                                            setIsProfileOpen(false);
                                            logout();
                                            navigate(isAdmin ? '/admin/login' : '/login');
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex space-x-2">
                            <Link to="/login">
                                <Button variant="outline" className="text-green-700 border-green-700 hover:bg-green-50">Log In</Button>
                            </Link>
                            <Link to="/register">
                                <Button className="bg-green-700 hover:bg-green-800 text-white">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* Mobile Navigation Overlay */}
            <MobileNav
                isOpen={isNavOpen}
                onClose={() => setIsNavOpen(false)}
                navLinks={navLinks}
                actionButton={actionButton}
            />

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
