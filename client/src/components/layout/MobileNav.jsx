import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav({ isOpen, onClose, navLinks, actionButton }) {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center min-[900px]:hidden">
            <Button onClick={onClose} className="absolute top-4 right-4 p-2">
                <X size={24} />
            </Button>
            <nav className="flex flex-col space-y-8 text-xl text-center">
                {navLinks.map((link) => {
                    // Hide Funding Hub for buyers or unauthenticated users
                    if (link.path === '/funding' && (user?.role === 'buyer' || !isAuthenticated)) return null;

                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="hover:text-green-600 transition-colors"
                            onClick={onClose}
                        >
                            {link.label}
                        </Link>
                    );
                })}
                <div className="mt-8" onClick={onClose}>
                    {actionButton ? (
                        <div onClick={onClose}>{actionButton}</div>
                    ) : isAuthenticated ? (
                        <div className="flex flex-col space-y-4 w-full px-8">
                            <Link
                                to="/profile"
                                className="flex items-center justify-center space-x-2 text-green-700 font-medium py-2"
                                onClick={onClose}
                            >
                                <div className="bg-green-100 p-2 rounded-full">
                                    <User size={24} />
                                </div>
                                <span>My Profile</span>
                            </Link>

                            {user?.role === 'farmer' && (
                                <>
                                    <Link
                                        to="/my-funding"
                                        className="text-gray-700 hover:text-green-700 font-medium py-2"
                                        onClick={onClose}
                                    >
                                        My Funding
                                    </Link>
                                    <Link
                                        to="/land-management"
                                        className="text-gray-700 hover:text-green-700 font-medium py-2"
                                        onClick={onClose}
                                    >
                                        Land Management
                                    </Link>
                                </>
                            )}


                            {(user?.role === 'buyer' || user?.role === 'investor' || user?.role === 'farmer') && (
                                <Link
                                    to="/my-inquiries"
                                    className="text-gray-700 hover:text-green-700 font-medium py-2"
                                    onClick={onClose}
                                >
                                    My Inquiries
                                </Link>
                            )}

                            {user?.role === 'investor' && (
                                <Link
                                    to="/investor-dashboard"
                                    className="text-gray-700 hover:text-green-700 font-medium py-2"
                                    onClick={onClose}
                                >
                                    Investor Dashboard
                                </Link>
                            )}

                            {user?.role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className="text-gray-700 hover:text-green-700 font-medium py-2"
                                    onClick={onClose}
                                >
                                    Admin Dashboard
                                </Link>
                            )}

                            <div className="border-t border-gray-100 my-2"></div>
                            <button
                                onClick={() => {
                                    const isAdmin = user?.role === 'admin';
                                    onClose();
                                    logout();
                                    navigate(isAdmin ? '/admin/login' : '/login');
                                }}
                                className="text-red-600 font-medium py-2"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-4 w-full px-8">
                            <Link to="/login" onClick={onClose}>
                                <Button variant="outline" className="w-full text-green-700 border-green-700">Log In</Button>
                            </Link>
                            <Link to="/register" onClick={onClose}>
                                <Button className="w-full bg-green-700 text-white">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}
