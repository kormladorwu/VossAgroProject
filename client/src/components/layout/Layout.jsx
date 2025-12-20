import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title, actionButton, footerText }) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-50 to-white text-gray-800">
            <Header title={title} actionButton={actionButton} />
            <main className="flex-1">{children}</main>
            <Footer text={footerText} />
        </div>
    );
}
