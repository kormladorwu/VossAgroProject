import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiService } from '../../api';
import { useToast } from '../../context/ToastContext';
import { MapPin, Ruler, Tag, User, Phone, Mail, Clock, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const data = await apiService.getBuyerInquiries();
            setInquiries(data);
        } catch (err) {
            console.error("Error fetching buyer inquiries:", err);
            toast.error("Failed to load your inquiries.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending':
                return { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', desc: 'The owner has not yet acknowledged your inquiry.' };
            case 'acknowledged':
                return { label: 'Acknowledged', color: 'bg-blue-100 text-blue-800', desc: 'The owner has seen your inquiry and is reviewing it.' };
            case 'contacted':
                return { label: 'Contacted', color: 'bg-purple-100 text-purple-800', desc: 'The owner has marked that they have reached out to you.' };
            case 'closed':
                return { label: 'Closed', color: 'bg-green-100 text-green-800', desc: 'This inquiry is closed. We hope you found what you were looking for!' };
            default:
                return { label: status, color: 'bg-gray-100 text-gray-800', desc: '' };
        }
    };

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">My Land Inquiries</h1>
                        <p className="text-gray-600">Track the status of lands you've expressed interest in.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="large" text="Loading your inquiries..." />
                        </div>
                    ) : inquiries.length === 0 ? (
                        <Card className="p-16 text-center">
                            <Info className="mx-auto text-gray-300 mb-4" size={48} />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No Inquiries Yet</h2>
                            <p className="text-gray-500 mb-8">You haven't inquired about any land listings yet.</p>
                            <Link to="/land">
                                <Button className="bg-green-600 hover:bg-green-700">Browse Land Listings</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {inquiries.map(inquiry => {
                                const status = getStatusInfo(inquiry.status);
                                return (
                                    <Card key={inquiry.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Land Thumbnail */}
                                            <div className="md:w-64 h-48 md:h-auto relative">
                                                <img
                                                    src={inquiry.land?.images?.[0] || "https://placehold.co/400x300?text=Land+Image"}
                                                    className="w-full h-full object-cover"
                                                    alt={inquiry.land?.title}
                                                />
                                                <div className="absolute top-2 left-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 p-6 flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{inquiry.land?.title}</h3>
                                                        <p className="text-sm text-gray-500 flex items-center">
                                                            <MapPin size={14} className="mr-1" /> {inquiry.land?.location}, {inquiry.land?.region}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-green-600">GHS {parseFloat(inquiry.land?.price).toLocaleString()}</p>
                                                        <p className="text-xs text-gray-400">{inquiry.land?.type === 'lease' ? 'per year' : 'total price'}</p>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start">
                                                    <Info size={18} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                                                    <p className="text-sm text-blue-800">{status.desc}</p>
                                                </div>

                                                <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100">
                                                    <div className="flex items-center text-sm text-gray-600">
                                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 mr-2">
                                                            <User size={16} />
                                                        </div>
                                                        <span>Owner: <span className="font-bold">{inquiry.land?.owner?.name}</span></span>
                                                    </div>
                                                    <div className="flex gap-3 w-full sm:w-auto">
                                                        <Link to={`/land/${inquiry.land?.id}`} className="flex-1 sm:flex-none">
                                                            <Button variant="outline" size="small" className="w-full">
                                                                View Listing
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="primary"
                                                            size="small"
                                                            className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                                                            onClick={() => toast.info("Please contact the owner directly via the details provided in the listing.")}
                                                        >
                                                            Contact Owner <ArrowRight size={14} className="ml-2" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MyInquiries;
