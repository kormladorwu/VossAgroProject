import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PasswordInput from '../../components/ui/PasswordInput';
import { regions } from '../../constants/regions';

/**
 * Validate password meets minimum requirements
 */
const validatePassword = (password) => {
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
    };

    const passed = Object.values(checks).filter(Boolean).length;
    return {
        isValid: passed >= 3, // At least 3 of 4 criteria
        checks,
        message: passed >= 3 ? '' : 'Password must be at least 8 characters with uppercase, lowercase, and numbers'
    };
};

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer',
        region: '',
        phone: ''
    });
    const [validationError, setValidationError] = useState(null);

    const { register, loading, error } = useAuth();
    const navigate = useNavigate();

    const passwordValidation = useMemo(() => validatePassword(formData.password), [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError(null);

        if (formData.password !== formData.confirmPassword) {
            setValidationError("Passwords do not match");
            return;
        }

        if (!passwordValidation.isValid) {
            setValidationError(passwordValidation.message);
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                region: formData.region,
                phone: formData.phone
            });

            // Always redirect to home after registration
            navigate('/');
        } catch (err) {
            // Error handled by context
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <Card className="max-w-md w-full space-y-8 p-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create your account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                                Sign in
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {(error || validationError) && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700" role="alert">
                                <p>{error || validationError}</p>
                            </div>
                        )}

                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">I am a...</label>
                                <select
                                    id="role"
                                    name="role"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                    value={formData.role}
                                    onChange={handleChange}
                                >
                                    <option value="buyer">Buyer</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="investor">Investor</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="region" className="block text-sm font-medium text-gray-700">Region</label>
                                <select
                                    id="region"
                                    name="region"
                                    required
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                                    value={formData.region}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a region</option>
                                    {regions.map((region) => (
                                        <option key={region.name} value={region.name}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        showStrength={true}
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                    <PasswordInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        required
                                        placeholder="Confirm"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                disabled={loading}
                            >
                                {loading ? <LoadingSpinner size="small" color="white" /> : 'Create Account'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default Register;
