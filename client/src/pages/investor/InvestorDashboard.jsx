import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { PieChart, Users, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

const InvestorDashboard = () => {
    const [programs, setPrograms] = useState([]);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [applications, setApplications] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appLoading, setAppLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('applications');
    const { user } = useAuth();

    useEffect(() => {
        fetchMyPrograms();
    }, []);

    useEffect(() => {
        if (activeTab === 'summary') {
            fetchAllApplications();
        }
    }, [activeTab]);

    const fetchMyPrograms = async () => {
        try {
            const allPrograms = await apiService.getFundingPrograms();
            const myPrograms = allPrograms.filter(p => p.provider?.id === user.id);
            setPrograms(myPrograms);
            if (myPrograms.length > 0) {
                setSelectedProgram(myPrograms[0]);
                fetchApplications(myPrograms[0].id);
            }
        } catch (error) {
            console.error("Error fetching programs:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (programId) => {
        setAppLoading(true);
        try {
            const apps = await apiService.getProgramApplications(programId);
            setApplications(apps);
        } catch (error) {
            console.error("Error fetching applications:", error);
            setApplications([]);
        } finally {
            setAppLoading(false);
        }
    };

    const fetchAllApplications = async () => {
        setSummaryLoading(true);
        try {
            const apps = await apiService.getProviderApplications();
            setAllApplications(apps);
        } catch (error) {
            console.error("Error fetching all applications:", error);
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleProgramClick = (program) => {
        setSelectedProgram(program);
        setActiveTab('applications');
        fetchApplications(program.id);
    };

    const handleStatusUpdate = async (appId, newStatus) => {
        try {
            await apiService.updateApplicationStatus(appId, newStatus);
            // Refresh applications
            if (activeTab === 'applications') {
                fetchApplications(selectedProgram.id);
            } else {
                fetchAllApplications();
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status");
        }
    };

    const approvedApplications = allApplications.filter(app => app.status === 'approved');

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <LoadingSpinner size="large" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Investor Dashboard</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar: My Programs */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Programs</h2>
                        {programs.length === 0 ? (
                            <p className="text-gray-500">No active programs.</p>
                        ) : (
                            programs.map(program => (
                                <div
                                    key={program.id}
                                    onClick={() => handleProgramClick(program)}
                                    className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedProgram?.id === program.id && activeTab === 'applications'
                                        ? 'bg-green-100 border-l-4 border-green-600'
                                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    <h3 className="font-medium text-gray-900">{program.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{program.type.toUpperCase()}</p>
                                </div>
                            ))
                        )}
                        <Button className="w-full mt-4" onClick={() => window.location.href = '/add-funding'}>
                            + New Program
                        </Button>
                    </div>

                    {/* Main Content: Applications */}
                    <div className="lg:col-span-3">
                        <div className="flex space-x-4 mb-6">
                            <button
                                onClick={() => setActiveTab('applications')}
                                className={`pb-2 px-1 font-medium text-sm transition-colors border-b-2 ${activeTab === 'applications' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Program Applications
                            </button>
                            <button
                                onClick={() => setActiveTab('summary')}
                                className={`pb-2 px-1 font-medium text-sm transition-colors border-b-2 ${activeTab === 'summary' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Approved Summary
                            </button>
                        </div>

                        {activeTab === 'applications' ? (
                            selectedProgram ? (
                                <Card className="min-h-[500px] p-8">
                                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{selectedProgram.title}</h2>
                                            <p className="text-gray-500">Total Fund: GHS {parseFloat(selectedProgram.amount).toLocaleString()}</p>
                                        </div>
                                        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
                                            <Users size={20} className="text-blue-600" />
                                            <span className="font-bold text-blue-800">{applications.length} Applicants</span>
                                        </div>
                                    </div>

                                    {appLoading ? (
                                        <div className="flex justify-center py-12">
                                            <LoadingSpinner />
                                        </div>
                                    ) : applications.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500">
                                            No applications received for this program yet.
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {applications.map(app => (
                                                <div key={app.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900">{app.applicant?.name}</h3>
                                                            <p className="text-sm text-gray-500">{app.applicant?.email} • {app.applicant?.region}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${app.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {app.status}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 bg-gray-50 p-4 rounded-md">
                                                        <p className="text-sm text-gray-700 italic">"{app.proposal_text}"</p>
                                                        <p className="text-sm font-bold text-gray-900 mt-2">Requested: GHS {parseFloat(app.amount_requested).toLocaleString()}</p>
                                                    </div>

                                                    {app.status === 'pending' && (
                                                        <div className="mt-4 flex space-x-3 justify-end">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="text-red-600 border-red-200 hover:bg-red-50"
                                                                onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                            >
                                                                <XCircle size={16} className="mr-1" /> Reject
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                className="bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleStatusUpdate(app.id, 'approved')}
                                                            >
                                                                <CheckCircle size={16} className="mr-1" /> Approve
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-[500px] text-gray-500 bg-white rounded-lg border border-gray-200">
                                    <PieChart size={64} className="mb-4 text-gray-300" />
                                    <p>Select a program to view applications.</p>
                                </div>
                            )
                        ) : (
                            <Card className="min-h-[500px] p-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Approved Applicants Summary</h2>
                                {summaryLoading ? (
                                    <div className="flex justify-center py-12">
                                        <LoadingSpinner />
                                    </div>
                                ) : approvedApplications.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        No approved applicants yet.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {approvedApplications.map(app => (
                                                    <tr key={app.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-medium text-gray-900">{app.applicant?.name}</div>
                                                            <div className="text-sm text-gray-500">{app.applicant?.region}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{app.program?.title}</div>
                                                            <div className="text-sm text-gray-500">{app.program?.type}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm font-bold text-green-600">GHS {parseFloat(app.amount_requested).toLocaleString()}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{app.applicant?.email}</div>
                                                            <div className="text-sm text-gray-500">{app.applicant?.phone || 'No phone'}</div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default InvestorDashboard;
