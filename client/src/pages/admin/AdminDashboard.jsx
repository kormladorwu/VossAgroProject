import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiService } from '../../api';
import { Users, ShoppingBag, DollarSign, Activity, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, subtext }) => {
    const colorClasses = {
        blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
        green: { bg: 'bg-green-50', text: 'text-green-600' },
        purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
        yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600' },
    };

    const { bg, text } = colorClasses[color] || colorClasses.blue;

    return (
        <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${bg}`}>
                    <Icon className={text} size={24} />
                </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
                {subtext}
            </div>
        </Card>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const statsData = await apiService.getAdminStats();
            setStats(statsData);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <LoadingSpinner size="large" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">System Overview & Statistics</p>
                </div>

                {stats && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Users"
                                value={stats.users.total}
                                icon={Users}
                                color="blue"
                                subtext={
                                    <>
                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium mr-2">{stats.users.farmers} Farmers</span>
                                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-medium">{stats.users.investors} Investors</span>
                                    </>
                                }
                            />
                            <StatCard
                                title="Products Listed"
                                value={stats.content.products}
                                icon={ShoppingBag}
                                color="green"
                                subtext={
                                    <span className="text-green-600 font-medium flex items-center">
                                        <CheckCircle size={12} className="mr-1" /> Active Listings
                                    </span>
                                }
                            />
                            <StatCard
                                title="Total Revenue"
                                value={`GHS ${stats.financials.revenue.toLocaleString()}`}
                                icon={DollarSign}
                                color="purple"
                                subtext={`From ${stats.financials.orders} completed orders`}
                            />
                            <StatCard
                                title="Funding Programs"
                                value={stats.content.funding}
                                icon={Activity}
                                color="yellow"
                                subtext="Across grants, loans & investments"
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">System Health</h3>
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    <CheckCircle size={16} className="mr-2" />
                                    <span>API Operational</span>
                                </div>
                                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                    <CheckCircle size={16} className="mr-2" />
                                    <span>Database Connected</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
