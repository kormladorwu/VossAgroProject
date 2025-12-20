import React from 'react';
import { useCart } from '../../context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate, Link } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md">
                    <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                        <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                            <div className="flex items-start justify-between">
                                <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                                <div className="ml-3 h-7 flex items-center">
                                    <button
                                        type="button"
                                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close panel</span>
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                {cart.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                                        <p className="text-gray-500">Your cart is empty.</p>
                                        <Button
                                            variant="link"
                                            onClick={() => {
                                                navigate('/marketplace');
                                                onClose();
                                            }}
                                            className="mt-4 text-green-600"
                                        >
                                            Start Shopping
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flow-root">
                                        <ul className="-my-6 divide-y divide-gray-200">
                                            {cart.map((product) => (
                                                <li key={product.id} className="py-6 flex">
                                                    <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                                                        <img
                                                            src={product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/150?text=Product"}
                                                            alt={product.name}
                                                            className="w-full h-full object-center object-cover"
                                                        />
                                                    </div>

                                                    <div className="ml-4 flex-1 flex flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                                <h3>{product.name}</h3>
                                                                <p className="ml-4">GHS {(product.price * product.quantity).toFixed(2)}</p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500">{product.unit}</p>
                                                        </div>
                                                        <div className="flex-1 flex items-end justify-between text-sm">
                                                            <div className="flex items-center border rounded-md">
                                                                <button
                                                                    className="p-1 hover:bg-gray-100"
                                                                    onClick={() => updateQuantity(product.id, product.quantity - 1)}
                                                                >
                                                                    <Minus size={16} />
                                                                </button>
                                                                <span className="px-2">{product.quantity}</span>
                                                                <button
                                                                    className="p-1 hover:bg-gray-100"
                                                                    onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                                                >
                                                                    <Plus size={16} />
                                                                </button>
                                                            </div>

                                                            <div className="flex">
                                                                <button
                                                                    type="button"
                                                                    className="font-medium text-green-600 hover:text-green-500"
                                                                    onClick={() => removeFromCart(product.id)}
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {cart.length > 0 && (
                            <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <p>Subtotal</p>
                                    <p>GHS {getCartTotal().toFixed(2)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                <div className="mt-6">
                                    <Link
                                        to="/checkout"
                                        onClick={onClose}
                                        className="flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                                    >
                                        Checkout
                                    </Link>
                                </div>
                                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                                    <p>
                                        or{' '}
                                        <button
                                            type="button"
                                            className="text-green-600 font-medium hover:text-green-500"
                                            onClick={() => {
                                                navigate('/marketplace');
                                                onClose();
                                            }}
                                        >
                                            Continue Shopping<span aria-hidden="true"> &rarr;</span>
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
