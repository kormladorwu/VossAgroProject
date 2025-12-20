import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../api';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const total = getCartTotal();

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);

        try {
            // Prepare order data
            const orderData = {
                total_amount: total,
                items: cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            // Call API to create order
            await apiService.createOrder(orderData);

            // Clear cart and show success
            clearCart();
            setSuccess(true);

            // Redirect after delay
            setTimeout(() => {
                navigate('/profile');
            }, 3000);

        } catch (err) {
            console.error('Checkout failed:', err);
            setError('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0 && !success) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
                    <Button onClick={() => navigate('/marketplace')} className="mt-4">
                        Go to Marketplace
                    </Button>
                </div>
            </Layout>
        );
    }

    if (success) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
                    <div className="rounded-full bg-green-100 p-6 inline-block mb-4">
                        <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                    <p className="text-gray-600 mb-6">Thank you for supporting local farmers.</p>
                    <p className="text-sm text-gray-500">Redirecting to your profile...</p>
                </div>
            </Layout>
        );
    }

    const [guestCheckout, setGuestCheckout] = useState(false);

    // Checkout Gate: If not logged in and hasn't chosen guest checkout
    if (!user && !guestCheckout) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            How would you like to check out?
                        </h1>
                        <p className="mt-4 text-lg text-gray-500">
                            Choose the option that works best for you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto px-4">
                        {/* Option 1: Sign In */}
                        <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-green-600 cursor-pointer" onClick={() => navigate('/login?redirect=/checkout')}>
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Returning Customer</h3>
                            <p className="text-gray-500 mb-6">Sign in to access your saved address and order history.</p>
                            <Button className="w-full">Sign In</Button>
                        </Card>

                        {/* Option 2: Create Account */}
                        <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-blue-600 cursor-pointer" onClick={() => navigate('/register?redirect=/checkout')}>
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">New Customer</h3>
                            <p className="text-gray-500 mb-6">Create an account to track orders and save details for next time.</p>
                            <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-50">Create Account</Button>
                        </Card>

                        {/* Option 3: Guest Checkout */}
                        <Card className="p-8 text-center hover:shadow-lg transition-shadow border-t-4 border-gray-400 cursor-pointer" onClick={() => setGuestCheckout(true)}>
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                                <svg className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Guest Checkout</h3>
                            <p className="text-gray-500 mb-6">Checkout quickly without creating an account.</p>
                            <Button variant="ghost" className="w-full text-gray-600 hover:bg-gray-100">Continue as Guest</Button>
                        </Card>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                    {/* Order Summary */}
                    <section className="lg:col-span-7">
                        <Card className="p-6 mb-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                            <ul className="divide-y divide-gray-200">
                                {cart.map((product) => (
                                    <li key={product.id} className="py-4 flex">
                                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                            <img
                                                src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/150?text=Product"}
                                                alt={product.name}
                                                className="w-full h-full object-center object-cover"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-gray-900">
                                                    <h3>{product.name}</h3>
                                                    <p>GHS {(product.price * product.quantity).toFixed(2)}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500">{product.unit}</p>
                                            </div>
                                            <div className="flex items-end justify-between text-sm">
                                                <p className="text-gray-500">Qty {product.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </section>

                    {/* Payment Details */}
                    <section className="lg:col-span-5 mt-8 lg:mt-0">
                        <Card className="p-6 bg-gray-50">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>

                            <div className="flow-root">
                                <dl className="-my-4 text-sm divide-y divide-gray-200">
                                    <div className="py-4 flex items-center justify-between">
                                        <dt className="text-gray-600">Subtotal</dt>
                                        <dd className="font-medium text-gray-900">GHS {total.toFixed(2)}</dd>
                                    </div>
                                    <div className="py-4 flex items-center justify-between">
                                        <dt className="text-gray-600">Shipping</dt>
                                        <dd className="font-medium text-gray-900">Free</dd>
                                    </div>
                                    <div className="py-4 flex items-center justify-between">
                                        <dt className="text-base font-medium text-gray-900">Order Total</dt>
                                        <dd className="text-base font-medium text-gray-900">GHS {total.toFixed(2)}</dd>
                                    </div>
                                </dl>
                            </div>

                            {error && (
                                <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
                                    <p>{error}</p>
                                </div>
                            )}

                            <div className="mt-6">
                                <Button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    {loading ? <LoadingSpinner size="small" color="white" /> : `Pay GHS ${total.toFixed(2)}`}
                                </Button>
                                <p className="mt-2 text-xs text-center text-gray-500">
                                    Secure payment powered by VossAgro Pay (Mock)
                                </p>
                            </div>
                        </Card>
                    </section>
                </div>
            </div>
        </Layout>
    );
};

export default Checkout;
