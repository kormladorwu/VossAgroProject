import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiService } from '../../api';
import { Calendar, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

const MyApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && (user.role === 'farmer' || user.role === 'buyer')) {
            fetchApplications();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchApplications = async () => {
        try {
            const data = await apiService.getMyApplications();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        approved: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        under_review: 'bg-blue-100 text-blue-800'
    };

    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'approved': return <CheckCircle size={16} className="mr-1" />;
            case 'rejected': return <XCircle size={16} className="mr-1" />;
            case 'pending':
            case 'under_review': return <Clock size={16} className="mr-1" />;
            default: return null;
        }
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Funding Portal</h1>
                    <p className="mt-2 text-gray-600">Track and manage your funding applications and financial support.</p>
                </div>

                <Card className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <FileText className="mr-2 text-green-600" />
                        Application History
                    </h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner size="medium" />
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 text-lg">You haven't applied for any funding yet.</p>
                            <p className="text-gray-400 text-sm mt-1">Explore available opportunities in the Funding Hub.</p>
                            <Button
                                className="mt-6 bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => window.location.href = '/funding'}
                            >
                                Browse Funding Opportunities
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {applications.map((app) => (
                                <div key={app.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-xl">{app.program?.title}</h3>
                                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                                <Calendar size={14} className="mr-1" />
                                                Submitted on {new Date(app.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase flex items-center shadow-sm ${statusColors[app.status]}`}>
                                            <StatusIcon status={app.status} />
                                            {app.status.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg text-sm mb-4 border border-gray-100">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Your Proposal</h4>
                                        <p className="text-gray-700 leading-relaxed italic">"{app.proposal_text}"</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                                        <div className="text-sm">
                                            <span className="text-gray-500">Requested Amount:</span>
                                            <span className="ml-2 font-bold text-gray-900 text-lg">GHS {parseFloat(app.amount_requested).toLocaleString()}</span>
                                        </div>

                                        {app.status === 'approved' && (
                                            <div className="w-full p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
                                                <p className="text-green-800 text-sm leading-relaxed">
                                                    🎉 <strong>Congratulations!</strong> Your application has been <strong>provisionally approved</strong>. We are impressed with your proposal! Our team will contact you soon for a final verification and interview to finalize the details. Please note that final funding is subject to the successful completion of this review phase.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </Layout>
    );
};

export default MyApplications;
