import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const FundingHub = lazy(() => import("./pages/FundingHub"));
const FundingDetail = lazy(() => import("./pages/FundingDetail"));
const LandAccess = lazy(() => import("./pages/LandAccess"));
const LandDetail = lazy(() => import("./pages/LandDetail"));
const AIInsight = lazy(() => import("./pages/AIInsight"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const MyApplications = lazy(() => import("./pages/farmer/MyApplications"));
const LandManagement = lazy(() => import("./pages/farmer/LandManagement"));
const AddProduct = lazy(() => import("./pages/farmer/AddProduct"));
const Checkout = lazy(() => import("./pages/shop/Checkout"));
const MyInquiries = lazy(() => import("./pages/shop/MyInquiries"));
const AddLandListing = lazy(() => import("./pages/farmer/AddLandListing"));
const AddFunding = lazy(() => import("./pages/investor/AddFunding"));
const InvestorDashboard = lazy(() => import("./pages/investor/InvestorDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
            <Suspense fallback={
              <div className="flex justify-center items-center h-screen">
                <LoadingSpinner size="large" text="Loading VossAgro..." />
              </div>
            }>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/land" element={<LandAccess />} />
                <Route path="/land/:id" element={<LandDetail />} />
                <Route path="/ai" element={<AIInsight />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Role-Protected Funding Routes */}
                <Route
                  path="/funding"
                  element={
                    <ProtectedRoute roles={['farmer', 'investor', 'admin']}>
                      <FundingHub />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/funding/:id"
                  element={
                    <ProtectedRoute roles={['farmer', 'investor', 'admin']}>
                      <FundingDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-funding"
                  element={
                    <ProtectedRoute roles={['farmer']}>
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Routes */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-product"
                  element={
                    <ProtectedRoute roles={['farmer']}>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/land-management"
                  element={
                    <ProtectedRoute roles={['farmer']}>
                      <LandManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-inquiries"
                  element={
                    <ProtectedRoute roles={['buyer', 'investor', 'farmer']}>
                      <MyInquiries />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-land"
                  element={
                    <ProtectedRoute>
                      <AddLandListing />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-funding"
                  element={
                    <ProtectedRoute roles={['investor']}>
                      <AddFunding />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/investor-dashboard"
                  element={
                    <ProtectedRoute roles={['investor']}>
                      <InvestorDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
