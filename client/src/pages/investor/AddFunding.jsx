import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { apiService } from '../../api';

const AddFunding = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: '',
        type: 'grant',
        deadline: '',
        requirements: '',
        interest_rate: '0'
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
            const programData = {
                ...formData,
                amount: parseFloat(formData.amount),
                interest_rate: formData.type === 'grant' ? 0 : parseFloat(formData.interest_rate),
                deadline: formData.deadline || null,
                requirements: formData.requirements || null
            };

            await apiService.createFundingProgram(programData);
            navigate('/funding');
        } catch (err) {
            console.error(err);
            setError('Failed to create funding program. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <Card className="p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Post Funding Opportunity</h1>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program Title</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Smallholder Farmer Grant 2025"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the funding opportunity..."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Total Amount (GHS)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    min="0"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.amount}
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
                                    <option value="grant">Grant (No Repayment)</option>
                                    <option value="loan">Loan (Repayable)</option>
                                    <option value="investment">Equity Investment</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Application Deadline</label>
                                <input
                                    type="date"
                                    name="deadline"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                                <input
                                    type="number"
                                    name="interest_rate"
                                    min="0"
                                    step="0.1"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.interest_rate}
                                    onChange={handleChange}
                                    disabled={formData.type === 'grant'}
                                />
                                {formData.type === 'grant' && <p className="text-xs text-gray-500 mt-1">Not applicable for grants</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Requirements & Eligibility</label>
                            <textarea
                                name="requirements"
                                rows={3}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                value={formData.requirements}
                                onChange={handleChange}
                                placeholder="List eligibility criteria..."
                            />
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button
                                type="button"
                                variant="outline"
                                className="mr-3"
                                onClick={() => navigate('/funding')}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? <LoadingSpinner size="small" color="white" /> : 'Post Opportunity'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default AddFunding;
