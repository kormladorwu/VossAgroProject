import React from 'react';

export default function Footer({ text }) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-green-900 text-white text-center p-6">
            <p>
                {text || `© ${currentYear} VossAgro. Connecting Ghana's Agri Future 🌱`}
            </p>
        </footer>
    );
}
