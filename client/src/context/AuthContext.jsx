import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiService } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper to get token key based on role type
const getTokenKey = (isAdmin = false) => isAdmin ? 'admin_token' : 'user_token';

// Helper to decode JWT and check expiration
const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        // Try user token first, then admin token
        const userToken = localStorage.getItem('user_token');
        const adminToken = localStorage.getItem('admin_token');
        return userToken || adminToken;
    });
    const [activeRole, setActiveRole] = useState(() => {
        // Check explicit active role preference first
        const storedRole = localStorage.getItem('active_role');
        if (storedRole && localStorage.getItem(`${storedRole}_token`)) {
            return storedRole;
        }
        // Fallback: Determine based on which token exists
        if (localStorage.getItem('admin_token')) return 'admin';
        if (localStorage.getItem('user_token')) return 'user';
        return null;
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            // Prevent running if no active role is set or if already loading (unless initial load)
            if (!activeRole) {
                setLoading(false);
                return;
            }

            console.log("AuthContext: Loading user. ActiveRole:", activeRole);
            const currentToken = activeRole === 'admin'
                ? localStorage.getItem('admin_token')
                : localStorage.getItem('user_token');

            console.log("AuthContext: Token found:", !!currentToken);

            if (currentToken && isTokenValid(currentToken)) {
                try {
                    // Avoid re-fetching if we already have the user and it matches the role
                    if (user && ((activeRole === 'admin' && (user.role === 'admin' || user.role === 'moderator')) || (activeRole === 'user' && user.role !== 'admin'))) {
                        setLoading(false);
                        return;
                    }

                    const userData = await apiService.getMe(currentToken);
                    console.log("AuthContext: User loaded:", userData);

                    // Only update state if data actually changed to avoid re-renders
                    if (!user || user.id !== userData.id) {
                        setUser(userData);
                        setToken(currentToken);
                    }
                } catch (err) {
                    console.error("Failed to load user", err);
                    // Clear invalid token but be careful not to trigger loop
                    localStorage.removeItem(getTokenKey(activeRole === 'admin'));
                    setToken(null);
                    setUser(null);
                    // Do NOT reset activeRole here to avoid infinite loop of effect re-running
                }
            } else if (currentToken) {
                // Token expired
                console.log("Token expired, logging out");
                localStorage.removeItem(getTokenKey(activeRole === 'admin'));
                setToken(null);
                setUser(null);
            }
            setLoading(false);
        };

        loadUser();
        // Removed activeRole from dependency array to prevent loop, 
        // but we need to listen to token changes or manual role switches.
        // A better approach is to listen to a specific trigger or just mount.
        // For now, we'll keep activeRole but ensure state updates inside don't cause a cycle.
    }, [activeRole]);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiService.login({ email, password });
            const isAdmin = data.role === 'admin' || data.role === 'moderator';
            const tokenKey = getTokenKey(isAdmin);

            localStorage.setItem(tokenKey, data.token);
            const newRole = isAdmin ? 'admin' : 'user';
            localStorage.setItem('active_role', newRole);

            setToken(data.token);
            setUser(data);
            setActiveRole(newRole);
            return data;
        } catch (err) {
            setError(err.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiService.register(userData);
            localStorage.setItem('user_token', data.token);
            localStorage.setItem('active_role', 'user');
            setToken(data.token);
            setUser(data);
            setActiveRole('user');
            return data;
        } catch (err) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Only logout the active role
        if (activeRole === 'admin') {
            localStorage.removeItem('admin_token');
        } else {
            localStorage.removeItem('user_token');
        }
        localStorage.removeItem('active_role');
        setToken(null);
        setUser(null);
        setActiveRole(null);
    };

    const logoutAll = () => {
        // Logout from all sessions
        localStorage.removeItem('user_token');
        localStorage.removeItem('admin_token');
        setToken(null);
        setUser(null);
        setActiveRole(null);
    };

    // Switch between user and admin sessions
    const switchSession = async (toAdmin = false) => {
        const targetToken = localStorage.getItem(getTokenKey(toAdmin));
        if (targetToken && isTokenValid(targetToken)) {
            try {
                const userData = await apiService.getMe(targetToken);
                setUser(userData);
                setToken(targetToken);
                const newRole = toAdmin ? 'admin' : 'user';
                localStorage.setItem('active_role', newRole);
                setActiveRole(newRole);
                return true;
            } catch {
                return false;
            }
        }
        return false;
    };

    // Get current token for API calls
    const getCurrentToken = () => {
        return activeRole === 'admin'
            ? localStorage.getItem('admin_token')
            : localStorage.getItem('user_token');
    };

    const value = {
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        logoutAll,
        switchSession,
        getCurrentToken,
        activeRole,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'moderator',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
