import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiService } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MapPin, Ruler, Tag, User, Phone, Mail, Clock, CheckCircle, Trash2, ExternalLink, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandManagement = () => {
    const [activeTab, setActiveTab] = useState('inquiries'); // 'listings' or 'inquiries'
    const [listings, setListings] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const toast = useToast();

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'listings') {
                const data = await apiService.getLandListings({ owner_id: user.id });
                setListings(data);
            } else {
                const data = await apiService.getOwnerInquiries();
                setInquiries(data);
            }
        } catch (err) {
            console.error("Error fetching land management data:", err);
            toast.error("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteListing = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            await apiService.deleteLandListing(id);
            toast.success("Listing deleted successfully");
            fetchData();
        } catch (err) {
            toast.error("Failed to delete listing");
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await apiService.updateInquiryStatus(id, status);
            toast.success(`Inquiry marked as ${status}`);
            fetchData();
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'acknowledged': return 'bg-blue-100 text-blue-800';
            case 'contacted': return 'bg-purple-100 text-purple-800';
            case 'closed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Land Management</h1>
                        <p className="text-gray-600">Manage your land listings and track buyer inquiries.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-4 mb-8">
                        <button
                            onClick={() => setActiveTab('inquiries')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'inquiries' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            Inquiries Received
                        </button>
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'listings' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            My Listings
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <LoadingSpinner size="large" text="Loading..." />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {activeTab === 'listings' ? (
                                listings.length === 0 ? (
                                    <Card className="p-12 text-center">
                                        <p className="text-gray-500 mb-4">You haven't listed any land yet.</p>
                                        <Link to="/add-land">
                                            <Button>List Your First Land</Button>
                                        </Link>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {listings.map(listing => (
                                            <Card key={listing.id} className="overflow-hidden flex flex-col">
                                                <img
                                                    src={listing.images?.[0] || "https://placehold.co/400x200?text=Land+Image"}
                                                    className="h-48 w-full object-cover"
                                                    alt={listing.title}
                                                />
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-xl mb-2">{listing.title}</h3>
                                                    <div className="text-sm text-gray-500 space-y-2 mb-4">
                                                        <p className="flex items-center"><MapPin size={14} className="mr-2" /> {listing.location}, {listing.region}</p>
                                                        <p className="flex items-center"><Ruler size={14} className="mr-2" /> {listing.size} Acres</p>
                                                        <p className="flex items-center font-bold text-gray-900"><Tag size={14} className="mr-2" /> GHS {parseFloat(listing.price).toLocaleString()}</p>
                                                    </div>
                                                    <div className="mt-auto flex gap-2">
                                                        <Link to={`/land/${listing.id}`} className="flex-1">
                                                            <Button variant="outline" className="w-full">View</Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            className="text-red-600 border-red-100 hover:bg-red-50"
                                                            onClick={() => handleDeleteListing(listing.id)}
                                                        >
                                                            <Trash2 size={18} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )
                            ) : (
                                inquiries.length === 0 ? (
                                    <Card className="p-12 text-center">
                                        <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
                                        <p className="text-gray-500">No inquiries received yet.</p>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {inquiries.map(inquiry => (
                                            <Card key={inquiry.id} className="p-6">
                                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(inquiry.status)}`}>
                                                                {inquiry.status}
                                                            </span>
                                                            <span className="text-xs text-gray-400 flex items-center">
                                                                <Clock size={12} className="mr-1" /> {new Date(inquiry.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                                                            Inquiry for: <Link to={`/land/${inquiry.land?.id}`} className="text-green-600 hover:underline">{inquiry.land?.title}</Link>
                                                        </h3>
                                                        <div className="bg-gray-50 p-4 rounded-lg mt-4">
                                                            <p className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                                                                <User size={16} className="mr-2 text-green-600" /> Buyer: {inquiry.buyer?.name}
                                                            </p>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                                                <p className="flex items-center"><Mail size={14} className="mr-2" /> {inquiry.buyer?.email}</p>
                                                                <p className="flex items-center"><Phone size={14} className="mr-2" /> {inquiry.buyer?.phone || 'No phone'}</p>
                                                            </div>
                                                            {inquiry.message && (
                                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Message:</p>
                                                                    <p className="text-sm italic text-gray-600">"{inquiry.message}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 justify-center min-w-[200px]">
                                                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Update Status:</p>
                                                        {inquiry.status === 'pending' && (
                                                            <Button size="small" onClick={() => handleUpdateStatus(inquiry.id, 'acknowledged')}>
                                                                Acknowledge
                                                            </Button>
                                                        )}
                                                        {(inquiry.status === 'pending' || inquiry.status === 'acknowledged') && (
                                                            <Button size="small" variant="outline" onClick={() => handleUpdateStatus(inquiry.id, 'contacted')}>
                                                                Mark as Contacted
                                                            </Button>
                                                        )}
                                                        {inquiry.status !== 'closed' && (
                                                            <Button size="small" variant="outline" className="text-green-600 border-green-200" onClick={() => handleUpdateStatus(inquiry.id, 'closed')}>
                                                                Mark as Closed/Sold
                                                            </Button>
                                                        )}
                                                        {inquiry.status === 'closed' && (
                                                            <div className="flex items-center text-green-600 font-bold text-sm justify-center">
                                                                <CheckCircle size={16} className="mr-2" /> Deal Closed
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default LandManagement;
