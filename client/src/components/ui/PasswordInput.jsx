import React, { useState, useMemo } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Password strength calculation
 * Returns: { score: 0-4, label: string, color: string }
 */
const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    const levels = [
        { score: 0, label: '', color: '' },
        { score: 1, label: 'Very Weak', color: 'bg-red-500' },
        { score: 2, label: 'Weak', color: 'bg-orange-500' },
        { score: 3, label: 'Fair', color: 'bg-yellow-500' },
        { score: 4, label: 'Good', color: 'bg-lime-500' },
        { score: 5, label: 'Strong', color: 'bg-green-500' },
    ];

    return levels[score];
};

const PasswordInput = ({
    id,
    name,
    value,
    onChange,
    placeholder = 'Password',
    required = false,
    showStrength = false,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const strength = useMemo(() => calculateStrength(value), [value]);

    return (
        <div className="w-full">
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className={cn(
                        "appearance-none relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm",
                        className
                    )}
                    {...props}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {showStrength && value && (
                <div className="mt-2">
                    <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                            <div
                                key={level}
                                className={cn(
                                    "flex-1 rounded-full transition-colors",
                                    level <= strength.score ? strength.color : 'bg-gray-200'
                                )}
                            />
                        ))}
                    </div>
                    {strength.label && (
                        <p className={cn(
                            "text-xs mt-1",
                            strength.score <= 2 ? 'text-red-600' :
                                strength.score <= 3 ? 'text-yellow-600' : 'text-green-600'
                        )}>
                            {strength.label}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PasswordInput;
