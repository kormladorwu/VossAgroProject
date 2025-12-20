import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Modal from "../components/ui/Modal";
import { apiService } from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { Plus, Calendar, DollarSign, FileText } from "lucide-react";

const FundingHub = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);

  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchPrograms();
  }, [selectedType]);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await apiService.getFundingPrograms();

      // Client-side filtering
      let filtered = data;

      if (selectedType === 'my') {
        if (user) {
          // Filter by investor ID using provider_id
          filtered = filtered.filter(p => p.provider_id === user.id || (p.provider && p.provider.id === user.id));
        }
      } else if (selectedType) {
        filtered = filtered.filter(p => p.type === selectedType);
      }

      setPrograms(filtered);
    } catch (err) {
      console.error("Failed to fetch funding programs", err);
      setError("Failed to load funding opportunities. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (program) => {
    setProgramToDelete(program);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!programToDelete) return;

    try {
      await apiService.deleteFundingProgram(programToDelete.id);
      setPrograms(programs.filter(p => p.id !== programToDelete.id));
      toast.success('Program deleted successfully');
      setDeleteModalOpen(false);
      setProgramToDelete(null);
    } catch (err) {
      console.error("Failed to delete program", err);
      toast.error("Failed to delete program. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Funding Hub
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Discover grants, loans, and investment opportunities to grow your agribusiness.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-10 max-w-xl mx-auto">
            {/* Investor Toggle: All Programs vs My Programs */}
            {user?.role === 'investor' && (
              <div className="flex justify-center mb-6">
                <div className="bg-white p-1 rounded-lg shadow-sm inline-flex">
                  <button
                    onClick={() => { setSelectedType(''); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedType !== 'my' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    All Opportunities
                  </button>
                  <button
                    onClick={() => setSelectedType('my')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedType === 'my' ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    My Programs
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-md">
              <select
                className="w-full border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={selectedType === 'my' ? '' : selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={selectedType === 'my'}
              >
                <option value="">All Funding Types</option>
                <option value="grant">Grants (No Repayment)</option>
                <option value="loan">Loans</option>
                <option value="investment">Equity Investment</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Post Funding Button (Investor Only) */}
      {user?.role === 'investor' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-end">
          <Link to="/add-funding">
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Post Opportunity</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Funding Program"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{programToDelete?.title}</strong>? This action cannot be undone.</p>
      </Modal>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" text="Loading opportunities..." />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : programs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No funding opportunities found at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {programs.map((program) => (
              <Card key={program.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${program.type === 'grant' ? 'bg-green-100 text-green-800' :
                      program.type === 'loan' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                      {program.type}
                    </span>
                    {program.deadline && (
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar size={12} className="mr-1" />
                        Due: {new Date(program.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {program.title}
                  </h3>

                  <div className="flex items-center text-2xl font-bold text-green-600 mb-4">
                    <DollarSign size={24} className="mr-1" />
                    {parseFloat(program.amount).toLocaleString()} GHS
                  </div>

                  <p className="text-gray-600 mb-4 flex-1 line-clamp-4">
                    {program.description}
                  </p>

                  <div className="space-y-2 mb-6 text-sm text-gray-500">
                    <div className="flex items-start">
                      <FileText size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{program.requirements || "No specific requirements listed."}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    {selectedType === 'my' ? (
                      <Button
                        className="w-full bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        variant="outline"
                        onClick={() => handleDeleteClick(program)}
                      >
                        Delete Program
                      </Button>
                    ) : (
                      <Link to={`/funding/${program.id}`}>
                        <Button className="w-full" variant="outline">
                          View Details & Apply
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FundingHub;
