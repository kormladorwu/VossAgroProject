// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API = {
    baseUrl: API_BASE_URL,
    products: `${API_BASE_URL}/api/products`,
    fundingPrograms: `${API_BASE_URL}/api/funding-programs`,
    fundingApplications: `${API_BASE_URL}/api/funding-applications`,
    landListings: `${API_BASE_URL}/api/land-listings`,
    landInquiries: `${API_BASE_URL}/api/land-inquiries`,
    aiInsights: `${API_BASE_URL}/api/ai/insights`,
    auth: {
        login: `${API_BASE_URL}/api/auth/login`,
        register: `${API_BASE_URL}/api/auth/register`,
        me: `${API_BASE_URL}/api/auth/me`,
    }
};

// Generic fetch helper
async function fetchAPI(url, options = {}) {
    const { headers: optionHeaders, ...restOptions } = options;
    const response = await fetch(url, {
        ...restOptions,
        headers: {
            'Content-Type': 'application/json',
            ...optionHeaders,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        // Throw the specific error message from the server if available
        throw new Error(error.error || error.message || `HTTP error! status: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// Helper to get the correct token based on active role
const getAuthToken = () => {
    const activeRole = localStorage.getItem('active_role');
    if (activeRole === 'admin') {
        return localStorage.getItem('admin_token');
    }
    return localStorage.getItem('user_token') || localStorage.getItem('admin_token');
};

// API service methods
export const apiService = {
    // Products
    getProducts: () => fetchAPI(API.products),
    getProduct: (id) => fetchAPI(`${API.products}/${id}`),
    createProduct: (productData) => {
        const token = getAuthToken();
        return fetchAPI(API.products, {
            method: 'POST',
            body: JSON.stringify(productData),
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    deleteProduct: (id) => {
        const token = getAuthToken();
        return fetchAPI(`${API.products}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Orders
    createOrder: (orderData) => {
        const token = getAuthToken();
        return fetchAPI(API.orders, {
            method: 'POST',
            body: JSON.stringify(orderData),
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    getMyOrders: () => {
        const token = getAuthToken();
        return fetchAPI(`${API.orders}/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Land Listings
    getLandListings: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return fetchAPI(`${API.landListings}${query ? `?${query}` : ''}`);
    },
    getLandListing: (id) => fetchAPI(`${API.landListings}/${id}`),
    createLandListing: (listingData) => {
        const token = getAuthToken();
        return fetchAPI(API.landListings, {
            method: 'POST',
            body: JSON.stringify(listingData),
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    deleteLandListing: (id) => {
        const token = getAuthToken();
        return fetchAPI(`${API.landListings}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Land Inquiries
    createLandInquiry: (inquiryData) => {
        const token = getAuthToken();
        return fetchAPI(API.landInquiries, {
            method: 'POST',
            body: JSON.stringify(inquiryData),
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    getOwnerInquiries: () => {
        const token = getAuthToken();
        return fetchAPI(`${API.landInquiries}/owner`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    getBuyerInquiries: () => {
        const token = getAuthToken();
        return fetchAPI(`${API.landInquiries}/my`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    updateInquiryStatus: (id, status) => {
        const token = getAuthToken();
        return fetchAPI(`${API.landInquiries}/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Funding Programs
    getFundingPrograms: () => fetchAPI(API.fundingPrograms),
    getFundingProgram: (id) => fetchAPI(`${API.fundingPrograms}/${id}`),
    createFundingProgram: (programData) => {
        const token = getAuthToken();
        return fetchAPI(API.fundingPrograms, {
            method: 'POST',
            body: JSON.stringify(programData),
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    deleteFundingProgram: (id) => {
        const token = getAuthToken();
        return fetchAPI(`${API.fundingPrograms}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Funding Applications
    applyForFunding: (applicationData) => {
        const token = getAuthToken();
        return fetchAPI(API.fundingApplications, {
            method: 'POST',
            body: JSON.stringify(applicationData),
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    getMyApplications: () => {
        const token = getAuthToken();
        return fetchAPI(`${API.fundingApplications}/my-applications`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    getProgramApplications: (programId) => {
        const token = getAuthToken();
        return fetchAPI(`${API.fundingApplications}/program/${programId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    getProviderApplications: () => {
        const token = getAuthToken();
        return fetchAPI(`${API.fundingApplications}/provider-applications`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    updateApplicationStatus: (id, status) => {
        const token = getAuthToken();
        return fetchAPI(`${API.fundingApplications}/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // Admin
    getAdminStats: () => {
        const token = getAuthToken();
        return fetchAPI(`${API.baseUrl}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    getAllUsers: () => {
        const token = getAuthToken();
        return fetchAPI(`${API.baseUrl}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    updateUserStatus: (id, data) => {
        const token = getAuthToken();
        return fetchAPI(`${API.baseUrl}/api/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${token}` }
        });
    },

    // AI Insights
    getAIInsight: (region) => fetchAPI(`${API.aiInsights}?region=${encodeURIComponent(region)}`),

    // Auth
    login: (credentials) => fetchAPI(API.auth.login, {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),
    register: (userData) => fetchAPI(API.auth.register, {
        method: 'POST',
        body: JSON.stringify(userData),
    }),
    getMe: (token) => fetchAPI(API.auth.me, {
        headers: { Authorization: `Bearer ${token}` }
    }),
};

export default apiService;
