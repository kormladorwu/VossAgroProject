import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { apiService } from '../api';
import { MapPin, Ruler, Tag, Calendar, User, Phone, Mail, CheckCircle, ArrowLeft, Info } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const LandDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inquiryLoading, setInquiryLoading] = useState(false);

    useEffect(() => {
        fetchListing();
    }, [id]);

    const fetchListing = async () => {
        try {
            const data = await apiService.getLandListing(id);
            setListing(data);
        } catch (err) {
            console.error("Error fetching land listing:", err);
            setError("Could not find the land listing you're looking for.");
        } finally {
            setLoading(false);
        }
    };

    const handleInquiry = async () => {
        setInquiryLoading(true);
        try {
            await apiService.createLandInquiry({ land_id: id });
            toast.success("Success! Your inquiry has been sent to the owner. They will contact you soon.");
        } catch (err) {
            console.error("Error sending inquiry:", err);
            toast.error(err.message || "Failed to send inquiry. Please try again.");
        } finally {
            setInquiryLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <LoadingSpinner size="large" text="Loading land details..." />
                </div>
            </Layout>
        );
    }

    if (error || !listing) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto py-12 px-4 text-center">
                    <div className="bg-red-50 p-8 rounded-xl inline-block">
                        <Info className="mx-auto text-red-500 mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || "The listing may have been removed or is no longer available."}</p>
                        <Button onClick={() => navigate('/land')}>Back to Land Access</Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-gray-50 min-h-screen">
                {/* Hero Section with Image */}
                <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                    <img
                        src={listing.images && listing.images.length > 0 ? listing.images[0] : "https://placehold.co/1200x600?text=Land+Image"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 md:pb-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="mb-3 flex items-center text-white hover:text-green-400 transition-colors font-medium text-sm"
                            >
                                <ArrowLeft size={18} className="mr-2" /> Back to Listings
                            </button>
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                                {listing.title}
                            </h1>
                            <div className="flex items-center gap-2 mt-3 text-white/80 text-sm">
                                <MapPin size={16} />
                                <span>{listing.location}, {listing.region}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                                    <Ruler className="mx-auto text-green-600 mb-2" size={24} />
                                    <p className="text-2xl font-bold text-gray-900">{listing.size}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Acres</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                                    <Tag className="mx-auto text-green-600 mb-2" size={24} />
                                    <p className="text-2xl font-bold text-gray-900">GHS {parseFloat(listing.price).toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">{listing.type === 'lease' ? 'Per Year' : 'Total'}</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                                    <MapPin className="mx-auto text-green-600 mb-2" size={24} />
                                    <p className="text-lg font-bold text-gray-900 truncate">{listing.region}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Region</p>
                                </div>
                                <div className={`rounded-xl p-4 shadow-sm border text-center ${listing.type === 'sale' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                                    <CheckCircle className={`mx-auto mb-2 ${listing.type === 'sale' ? 'text-blue-600' : 'text-green-600'}`} size={24} />
                                    <p className={`text-lg font-bold ${listing.type === 'sale' ? 'text-blue-900' : 'text-green-900'}`}>
                                        For {listing.type === 'sale' ? 'Sale' : 'Lease'}
                                    </p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Type</p>
                                </div>
                            </div>

                            {/* Description Card */}
                            <Card className="p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">About this Land</h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {listing.description}
                                </p>
                            </Card>

                            {/* Land Specifications */}
                            <Card className="p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <Info size={20} className="mr-2 text-green-600" /> Land Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 flex items-center text-sm">
                                            <Ruler size={16} className="mr-2 text-gray-400" /> Size
                                        </span>
                                        <span className="font-semibold text-gray-900">{listing.size} Acres</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 flex items-center text-sm">
                                            <MapPin size={16} className="mr-2 text-gray-400" /> Location
                                        </span>
                                        <span className="font-semibold text-gray-900 text-right truncate ml-2">{listing.location}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 flex items-center text-sm">
                                            <MapPin size={16} className="mr-2 text-gray-400" /> Region
                                        </span>
                                        <span className="font-semibold text-gray-900">{listing.region}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600 flex items-center text-sm">
                                            <Tag size={16} className="mr-2 text-gray-400" /> Listing Type
                                        </span>
                                        <span className="font-semibold text-gray-900 capitalize">{listing.type}</span>
                                    </div>
                                </div>
                            </Card>

                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Owner Card */}
                            <Card className="p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Owner Information</h3>
                                <div className="flex items-center mb-4">
                                    <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 flex-shrink-0">
                                        <User size={28} />
                                    </div>
                                    <div className="ml-3 min-w-0">
                                        <p className="font-bold text-gray-900 truncate">{listing.owner?.name}</p>
                                        <p className="text-xs text-gray-500 flex items-center">
                                            <CheckCircle size={12} className="mr-1 text-green-500 flex-shrink-0" /> Verified Seller
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <Mail size={16} className="mr-3 text-green-600 flex-shrink-0" />
                                        <span className="truncate">{listing.owner?.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone size={16} className="mr-3 text-green-600 flex-shrink-0" />
                                        <span>{listing.owner?.phone || 'Not provided'}</span>
                                    </div>
                                </div>

                                {/* Price Highlight */}
                                <div className="bg-green-50 p-4 rounded-lg mb-4">
                                    <p className="text-xs text-green-700 font-medium uppercase tracking-wider mb-1">
                                        {listing.type === 'lease' ? 'Annual Lease' : 'Sale Price'}
                                    </p>
                                    <p className="text-2xl font-black text-green-900">
                                        GHS {parseFloat(listing.price).toLocaleString()}
                                        {listing.type === 'lease' && <span className="text-sm font-normal"> / year</span>}
                                    </p>
                                </div>

                                <Button
                                    className="w-full py-3 text-base font-bold bg-green-600 hover:bg-green-700"
                                    onClick={handleInquiry}
                                    disabled={inquiryLoading}
                                >
                                    {inquiryLoading ? <LoadingSpinner size="small" color="white" /> : "Inquire Now"}
                                </Button>
                                <p className="text-center text-xs text-gray-400 mt-3">
                                    The owner will receive your contact details to discuss this listing.
                                </p>
                            </Card>

                            {/* Help Card */}
                            <Card className="p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white border-none">
                                <h4 className="font-bold mb-2 flex items-center">
                                    <Info size={18} className="mr-2" /> Need Assistance?
                                </h4>
                                <p className="text-sm text-blue-100 mb-3">
                                    Our team can help with land verification and legal documentation.
                                </p>
                                <Link to="/ai" className="text-sm font-bold underline hover:text-white transition-colors">
                                    Ask VossAgro AI →
                                </Link>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LandDetail;
