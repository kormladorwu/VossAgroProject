import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = ({ children, roles = [] }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="large" text="Verifying access..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but save the attempted location
        // Use the path to determine if we should go to admin login or general login
        const loginPath = location.pathname.startsWith('/admin') ? '/admin/login' : '/login';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    if (roles.length > 0 && !roles.includes(user.role)) {
        console.log("ProtectedRoute: Role mismatch. User role:", user.role, "Required:", roles);
        // User authenticated but not authorized
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
