import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiService } from '../../api';
import { regions } from '../../constants/regions';
import { useAuth } from '../../context/AuthContext';

const AddProduct = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'Vegetables',
        description: '',
        price: '',
        unit: 'kg',
        quantity_available: '',
        region: user?.region || '',
        harvest_date: '',
        image_url: '' // For now, simple URL input. Later: File upload
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Format data for API
            const productData = {
                ...formData,
                price: formData.price ? parseFloat(formData.price) : 0,
                quantity_available: formData.quantity_available ? parseInt(formData.quantity_available) : 0,
                harvest_date: formData.harvest_date || null,
                images: formData.image_url ? [formData.image_url] : [] // Wrap single URL in array
            };

            await apiService.createProduct(productData);
            navigate('/marketplace');
        } catch (err) {
            console.error(err);
            setError('Failed to create product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Card className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">List New Produce</h1>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Fresh Tomatoes"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="Vegetables">Vegetables</option>
                                    <option value="Fruits">Fruits</option>
                                    <option value="Tubers">Tubers (Yam, Cassava)</option>
                                    <option value="Grains">Grains (Rice, Maize)</option>
                                    <option value="Livestock">Livestock</option>
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your produce..."
                            />
                        </div>

                        {/* Pricing & Quantity */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (GHS)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    step="0.01"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Unit</label>
                                <select
                                    name="unit"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.unit}
                                    onChange={handleChange}
                                >
                                    <option value="kg">kg</option>
                                    <option value="bag">bag</option>
                                    <option value="box">box</option>
                                    <option value="ton">ton</option>
                                    <option value="piece">piece</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quantity Available</label>
                                <input
                                    type="number"
                                    name="quantity_available"
                                    required
                                    min="1"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.quantity_available}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Region & Date */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Region</label>
                                <select
                                    name="region"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.region}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Region</option>
                                    {regions.map(r => (
                                        <option key={r.name} value={r.name}>{r.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Harvest Date</label>
                                <input
                                    type="date"
                                    name="harvest_date"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.harvest_date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Image URL (Temporary) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="url"
                                name="image_url"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/image.jpg"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                * We will add direct file upload later. For now, paste a link.
                            </p>
                        </div>

                        {/* AI Freshness Placeholder */}
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-blue-900">AI Freshness Check</h4>
                                    <p className="text-sm text-blue-700">Upload an image to get an instant quality score.</p>
                                </div>
                                <Button type="button" variant="outline" size="sm" disabled>
                                    Analyze (Coming Soon)
                                </Button>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="mr-3"
                                onClick={() => navigate('/marketplace')}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <LoadingSpinner size="small" color="white" /> : 'List Product'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default AddProduct;
