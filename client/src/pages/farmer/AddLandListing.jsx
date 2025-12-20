import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiService } from '../../api';
import { regions } from '../../constants/regions';

const AddLandListing = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        region: '',
        size: '',
        price: '',
        type: 'lease',
        image_url: ''
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
            const listingData = {
                ...formData,
                size: parseFloat(formData.size),
                price: parseFloat(formData.price),
                images: formData.image_url ? [formData.image_url] : []
            };

            await apiService.createLandListing(listingData);
            navigate('/land');
        } catch (err) {
            console.error(err);
            setError('Failed to create listing. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Card className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">List Your Land</h1>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Listing Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. 5 Acres Fertile Land for Lease"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the land, soil type, water access, etc."
                            />
                        </div>

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
                                <label className="block text-sm font-medium text-gray-700">Specific Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Near Koforidua"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Size (Acres)</label>
                                <input
                                    type="number"
                                    name="size"
                                    required
                                    min="0.1"
                                    step="0.1"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.size}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (GHS)</label>
                                <input
                                    type="number"
                                    name="price"
                                    required
                                    min="0"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    name="type"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.type}
                                    onChange={handleChange}
                                >
                                    <option value="lease">For Lease</option>
                                    <option value="sale">For Sale</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input
                                type="url"
                                name="image_url"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://example.com/land.jpg"
                            />
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="mr-3"
                                onClick={() => navigate('/land')}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <LoadingSpinner size="small" color="white" /> : 'Create Listing'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default AddLandListing;
