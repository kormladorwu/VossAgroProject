import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 40, className = '', text = 'Loading...' }) {
    const sizeMap = {
        small: 24,
        medium: 40,
        large: 64
    };

    const pixelSize = typeof size === 'string' ? (sizeMap[size] || 40) : size;

    return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
            <Loader2 className="animate-spin text-green-600 mb-3" size={pixelSize} />
            {text && <p className="text-green-700 font-medium animate-pulse">{text}</p>}
        </div>
    );
}
