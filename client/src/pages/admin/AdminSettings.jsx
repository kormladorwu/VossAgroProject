import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import { Settings, Bell, Lock, Globe } from 'lucide-react';

const AdminSettings = () => {
    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* General Settings */}
                    <Card className="p-6 bg-white shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-gray-100 rounded-lg mr-3">
                                <Globe className="text-gray-600" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">General</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Site Name</span>
                                <span className="text-sm font-medium text-gray-900">VossAgro</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Language</span>
                                <span className="text-sm font-medium text-gray-900">English</span>
                            </div>
                        </div>
                    </Card>

                    {/* Security Settings */}
                    <Card className="p-6 bg-white shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg mr-3">
                                <Lock className="text-blue-600" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Security</h3>
                        </div>
                        <div className="space-y-4">
                            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Change Password
                            </button>
                            <button className="w-full text-left text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Two-Factor Authentication
                            </button>
                        </div>
                    </Card>

                    {/* Notification Settings */}
                    <Card className="p-6 bg-white shadow-sm border border-gray-200">
                        <div className="flex items-center mb-4">
                            <div className="p-2 bg-yellow-50 rounded-lg mr-3">
                                <Bell className="text-yellow-600" size={20} />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Email Alerts</span>
                                <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                    <div className="w-3 h-3 bg-white rounded-full absolute right-1 top-1"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">System Updates</span>
                                <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer">
                                    <div className="w-3 h-3 bg-white rounded-full absolute left-1 top-1"></div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
