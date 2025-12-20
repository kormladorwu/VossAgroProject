import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Modal from "../components/ui/Modal";
import { apiService } from "../api";
import { regions } from "../constants/regions";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { Plus, ShoppingCart } from "lucide-react";

const Marketplace = () => {
  const location = useLocation();

  // Helper to get initial state from URL
  const getInitialParam = (key) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || "";
  };

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(() => getInitialParam('region'));
  const [selectedCategory, setSelectedCategory] = useState(() => getInitialParam('category'));
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const toast = useToast();

  // Sync state with query parameters when they change (e.g. back/forward navigation)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const regionParam = params.get('region') || "";
    const categoryParam = params.get('category') || "";

    if (regionParam !== selectedRegion) setSelectedRegion(regionParam);
    if (categoryParam !== selectedCategory) setSelectedCategory(categoryParam);
  }, [location.search]);

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleDeleteClick = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await apiService.deleteProduct(productToDelete.id);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      toast.success('Product deleted successfully');
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      console.error("Failed to delete product", err);
      toast.error("Failed to delete product. Please try again.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedRegion, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducts();

      // Client-side filtering for immediate feedback
      let filtered = data;

      // Handle "My Products" filter
      if (searchTerm.startsWith('my:')) {
        // Filter by current user ID using seller_id or seller.id
        if (user) {
          filtered = filtered.filter(p => p.seller_id === user.id || (p.seller && p.seller.id === user.id));
        }
        const realSearch = searchTerm.replace('my:', '');
        if (realSearch) filtered = filtered.filter(p => p.name.toLowerCase().includes(realSearch.toLowerCase()));
      } else {
        if (searchTerm) filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }

      if (selectedRegion) filtered = filtered.filter(p => p.region === selectedRegion);
      if (selectedCategory) filtered = filtered.filter(p => p.category === selectedCategory);

      setProducts(filtered);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Vegetables", "Fruits", "Tubers", "Grains", "Livestock"];

  return (
    <Layout>
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Fresh from the Farm
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Directly connect with local farmers and buy fresh, high-quality produce.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-10 max-w-3xl mx-auto">
            {/* Farmer Toggle: All Products vs My Products */}
            {user?.role === 'farmer' && (
              <div className="flex justify-center mb-6">
                <div className="bg-white p-1 rounded-lg shadow-sm inline-flex">
                  <button
                    onClick={() => { setSearchTerm(''); setSelectedRegion(''); setSelectedCategory(''); }}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${!searchTerm.startsWith('my:') ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => setSearchTerm('my:')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${searchTerm.startsWith('my:') ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    My Products
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg shadow-md flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Search produce..."
                className="flex-1 border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={searchTerm.replace('my:', '')}
                onChange={(e) => setSearchTerm(searchTerm.startsWith('my:') ? 'my:' + e.target.value : e.target.value)}
              />
              <select
                className="border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
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
                className="border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Button (Farmer Only) */}
      {user?.role === 'farmer' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex justify-end">
          <Link to="/add-product">
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>List New Produce</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Product"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        <p>Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This action cannot be undone.</p>
      </Modal>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" text="Loading fresh produce..." />
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <Card key={product.id} className="group flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 relative">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/300?text=No+Image"}
                    alt={product.name}
                    className="h-48 w-full object-cover object-center group-hover:opacity-75"
                  />
                  {product.freshness_score && (
                    <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                      {product.freshness_score}% Fresh
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/products/${product.id}`} className="hover:text-green-600">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{product.region}</p>
                    </div>
                    <p className="text-lg font-medium text-gray-900">GHS {product.price}</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {product.quantity_available} {product.unit} available
                    </span>
                    <span className="text-xs text-gray-400">
                      Seller: {product.seller?.name || 'Unknown'}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {searchTerm.startsWith('my:') ? (
                      <Button
                        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        onClick={(e) => handleDeleteClick(product, e)}
                      >
                        <span>Delete Product</span>
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </Button>
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

export default Marketplace;
