import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { apiService } from '../api';
import { Calendar, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {/* Profile Info */}
                    <Card className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'farmer' ? 'bg-green-100 text-green-800' :
                                user.role === 'investor' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                                    <p className="mt-1 text-lg text-gray-900 font-medium">{user.name}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                                    <p className="mt-1 text-lg text-gray-900 font-medium">{user.email}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Region</h3>
                                    <p className="mt-1 text-lg text-gray-900 font-medium">{user.region || 'Not specified'}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                                    <p className="mt-1 text-lg text-gray-900 font-medium">{user.phone || 'Not specified'}</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-500 text-center italic">Manage your account settings and security from your dashboard.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
