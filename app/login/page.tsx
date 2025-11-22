'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function LoginPage() {
    const router = useRouter();
    const { users, fetchData } = useStore();
    const { t } = useLanguage();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('Login attempt:', { username, password });
        console.log('Available users:', users);

        const user = login(username, password, users);

        if (user) {
            router.push('/');
            router.refresh();
        } else {
            setError('Invalid username or password');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
                {/* Left Panel - Gradient */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500 p-12 flex-col justify-between relative overflow-hidden">
                    {/* Decorative asterisk */}
                    <div className="text-white text-6xl font-light">*</div>

                    {/* Main content */}
                    <div className="text-white space-y-4">
                        <h2 className="text-4xl font-bold leading-tight">
                            Admini<br />Administration System
                        </h2>
                    </div>

                    {/* Decorative gradient orbs */}
                    <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl"></div>
                </div>

                {/* Right Panel - Form */}
                <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">
                    {/* Title */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('auth.loginTitle')}</h1>
                        <p className="text-gray-500">Sign in using your administration account to start manage your system.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
                                {t('auth.username')}
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder={t('auth.username')}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                {t('auth.password')}
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                    placeholder="••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-600">{t('auth.loginError')}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
                        >
                            {loading ? t('common.loading') : t('auth.loginButton')}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don't have an account?{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Contact your admin to create account
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
