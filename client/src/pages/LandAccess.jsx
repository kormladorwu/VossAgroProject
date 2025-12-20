import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { apiService } from "../api";
import { regions } from "../constants/regions";
import { useAuth } from "../context/AuthContext";
import { Plus, MapPin, Ruler, Tag } from "lucide-react";

const LandAccess = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all" or "my"

  const { user } = useAuth();

  useEffect(() => {
    fetchListings();
  }, [selectedRegion, selectedType, activeTab]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedRegion) params.region = selectedRegion;
      if (selectedType) params.type = selectedType;
      if (activeTab === "my" && user) params.owner_id = user.id;

      const data = await apiService.getLandListings(params);
      setListings(data);
    } catch (err) {
      console.error("Failed to fetch land listings", err);
      setError("Failed to load listings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this land listing?")) return;

    try {
      await apiService.deleteLandListing(id);
      fetchListings();
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert("Failed to delete listing. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Access Land for Farming
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Find arable land for lease or sale, or list your own land to support local agriculture.
            </p>
          </div>

          {/* Filters & Tabs */}
          <div className="mt-10 max-w-4xl mx-auto">
            {/* Tabs for Farmers */}
            {user?.role === 'farmer' && (
              <div className="flex justify-center mb-6">
                <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "all" ? "bg-green-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    All Lands
                  </button>
                  <button
                    onClick={() => setActiveTab("my")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "my" ? "bg-green-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    My Listings
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
              <select
                className="flex-1 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region.name} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
              <select
                className="flex-1 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="lease">For Lease</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* List Your Land Button (Farmer Only) */}
      {user?.role === 'farmer' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-end">
          <Link to="/add-land">
            <Button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
              <Plus size={20} />
              <span>List Your Land</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" text="Loading land listings..." />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-12">
            <p className="text-gray-500 text-lg">No land listings found matching your criteria.</p>
            {activeTab === 'my' && (
              <Link to="/add-land" className="text-green-600 font-medium mt-4 inline-block hover:underline">
                List your first land now →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {listings.map((listing) => (
              <Card key={listing.id} className="group relative flex flex-col h-full hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden bg-gray-200 relative">
                  <img
                    src={listing.images?.[0] || "https://placehold.co/400x200?text=Land+Image"}
                    className="h-48 w-full object-cover"
                    alt={listing.title}
                  />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${listing.type === 'sale' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
                    }`}>
                    For {listing.type === 'sale' ? 'Sale' : 'Lease'}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {listing.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={18} className="mr-2 text-green-500" />
                      {listing.location}, {listing.region}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Ruler size={18} className="mr-2 text-green-500" />
                      {listing.size} Acres
                    </div>
                    <div className="flex items-center text-sm text-gray-900 font-bold">
                      <Tag size={18} className="mr-2 text-green-500" />
                      GHS {parseFloat(listing.price).toLocaleString()} {listing.type === 'lease' ? '/ year' : ''}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1 leading-relaxed">
                    {listing.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                    {activeTab === 'my' ? (
                      <Button
                        onClick={() => handleDelete(listing.id)}
                        className="w-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100"
                        variant="outline"
                      >
                        Delete Listing
                      </Button>
                    ) : (
                      <Link to={`/land/${listing.id}`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700" variant="primary">
                          View Details
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

export default LandAccess;
