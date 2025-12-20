import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';
import { apiService } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Calendar, DollarSign, FileText, User, ArrowLeft, CheckCircle } from 'lucide-react';

const FundingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const toast = useToast();

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applyModalOpen, setApplyModalOpen] = useState(false);
    const [applying, setApplying] = useState(false);
    const [proposalText, setProposalText] = useState('');
    const [amountRequested, setAmountRequested] = useState('');

    useEffect(() => {
        fetchProgram();
    }, [id]);

    const fetchProgram = async () => {
        setLoading(true);
        try {
            const data = await apiService.getFundingProgram(id);
            setProgram(data);
        } catch (err) {
            console.error('Failed to fetch funding program', err);
            setError('Failed to load funding program details.');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!user) {
            toast.error('Please log in to apply for funding');
            navigate('/login', { state: { from: { pathname: `/funding/${id}` } } });
            return;
        }

        if (!proposalText.trim()) {
            toast.error('Please provide a proposal describing why you need this funding');
            return;
        }

        if (!amountRequested || parseFloat(amountRequested) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        setApplying(true);
        try {
            await apiService.applyForFunding({
                program_id: id,
                proposal_text: proposalText,
                amount_requested: parseFloat(amountRequested)
            });
            toast.success('Application submitted successfully!');
            setApplyModalOpen(false);
            setProposalText('');
            setAmountRequested('');
        } catch (err) {
            console.error('Failed to apply', err);
            toast.error(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-96">
                    <LoadingSpinner size="large" text="Loading program details..." />
                </div>
            </Layout>
        );
    }

    if (error || !program) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto py-12 px-4">
                    <Card className="p-8 text-center">
                        <p className="text-red-600 mb-4">{error || 'Program not found'}</p>
                        <Link to="/funding">
                            <Button variant="outline">Back to Funding Hub</Button>
                        </Link>
                    </Card>
                </div>
            </Layout>
        );
    }

    const typeColors = {
        grant: 'bg-green-100 text-green-800',
        loan: 'bg-blue-100 text-blue-800',
        investment: 'bg-purple-100 text-purple-800'
    };

    return (
        <Layout>
            {/* Header */}
            <div className="bg-green-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/funding" className="inline-flex items-center text-green-600 hover:text-green-800 mb-4">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Funding Hub
                    </Link>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <span className={`inline-block px-3 py-1 text-sm font-bold rounded-full uppercase mb-3 ${typeColors[program.type] || 'bg-gray-100 text-gray-800'}`}>
                                {program.type}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900">{program.title}</h1>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600 flex items-center">
                                <DollarSign size={28} />
                                {parseFloat(program.amount).toLocaleString()} GHS
                            </div>
                            {program.type === 'loan' && program.interest_rate > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                    Interest Rate: {program.interest_rate}%
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-700 whitespace-pre-line">{program.description}</p>
                        </Card>

                        {program.requirements && (
                            <Card className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                    <FileText size={20} className="mr-2 text-green-600" />
                                    Requirements & Eligibility
                                </h2>
                                <p className="text-gray-700 whitespace-pre-line">{program.requirements}</p>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Program Details</h3>
                            <div className="space-y-4">
                                {program.deadline && (
                                    <div className="flex items-center text-gray-600">
                                        <Calendar size={18} className="mr-3 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Application Deadline</p>
                                            <p className="font-medium">{new Date(program.deadline).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                )}
                                {program.provider && (
                                    <div className="flex items-center text-gray-600">
                                        <User size={18} className="mr-3 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Posted by</p>
                                            <p className="font-medium">{program.provider.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Apply Button - Show for farmers and buyers, not for investor who owns the program */}
                        {user?.role !== 'investor' && (
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                                onClick={() => user ? setApplyModalOpen(true) : navigate('/login', { state: { from: { pathname: `/funding/${id}` } } })}
                            >
                                Apply Now
                            </Button>
                        )}

                        {!user && (
                            <p className="text-center text-sm text-gray-500">
                                <Link to="/login" className="text-green-600 hover:text-green-800">Log in</Link> to apply for this funding opportunity
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Apply Modal */}
            <Modal
                isOpen={applyModalOpen}
                onClose={() => setApplyModalOpen(false)}
                title="Apply for Funding"
                footer={
                    <>
                        <Button variant="outline" onClick={() => setApplyModalOpen(false)} disabled={applying}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleApply}
                            disabled={applying}
                        >
                            {applying ? <LoadingSpinner size="small" color="white" /> : 'Submit Application'}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="font-medium text-green-800">{program.title}</p>
                        <p className="text-sm text-green-600">Total Fund: GHS {parseFloat(program.amount).toLocaleString()}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Amount Requested (GHS)
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            max={program.amount}
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="e.g. 5000"
                            value={amountRequested}
                            onChange={(e) => setAmountRequested(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Funding Proposal
                        </label>
                        <textarea
                            rows={6}
                            required
                            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            placeholder="Describe how you will use this funding to grow your agribusiness..."
                            value={proposalText}
                            onChange={(e) => setProposalText(e.target.value)}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Be specific about your goals and how this funding will help you achieve them.
                        </p>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
};

export default FundingDetail;
