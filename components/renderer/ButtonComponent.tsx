'use client';

import { ComponentConfig, ApiConfig, PageConfig } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { replacePlaceholders } from '@/lib/utils';
import { useState } from 'react';
import { clsx } from 'clsx';

interface ButtonComponentProps {
    component: ComponentConfig;
    api?: ApiConfig;
    pages?: PageConfig[];
    authToken?: string | null;
    params?: Record<string, string>;
}

export default function ButtonComponent({ component, api, pages, authToken, params }: ButtonComponentProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleClick = async () => {
        const action = component.props?.action || 'navigate';

        if (action === 'back') {
            router.back();
            return;
        }

        if (action === 'navigate') {
            const targetPageId = component.props?.targetPageId;
            if (targetPageId && pages) {
                const page = pages.find(p => p.id === targetPageId);
                if (page) {
                    let url = page.slug;
                    const navParams = component.props?.navParams || {};

                    // Resolve params and replace in slug
                    Object.keys(navParams).forEach(key => {
                        const rawValue = navParams[key];
                        // Resolve the value (e.g., %id% -> 123)
                        const resolvedValue = replacePlaceholders(rawValue, params);
                        // Replace in slug (assuming :key format)
                        url = url.replace(`:${key}`, resolvedValue);
                    });

                    router.push(`/${url}`);
                }
            }
            return;
        }

        if (action === 'api' && api) {
            setLoading(true);
            setStatus('idle');
            try {
                const headers: Record<string, string> = {};
                api.headers.forEach((h) => {
                    headers[h.key] = replacePlaceholders(h.value, params);
                });

                if (authToken) {
                    headers['Authorization'] = `Bearer ${authToken}`;
                }

                const isMutation = ['POST', 'PUT', 'PATCH'].includes(api.method);
                if (isMutation && api.body) {
                    headers['Content-Type'] = 'application/json';
                }

                const url = replacePlaceholders(api.url, params);
                const body = isMutation && api.body ? replacePlaceholders(api.body, params) : undefined;

                const res = await fetch(url, {
                    method: api.method,
                    headers,
                    body,
                });

                if (!res.ok) throw new Error('API call failed');

                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } catch (error) {
                console.error(error);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 3000);
            } finally {
                setLoading(false);
            }
        }
    };

    const variant = component.props?.variant || 'primary';
    const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    return (
        <div className="my-2">
            <button
                onClick={handleClick}
                disabled={loading}
                className={clsx(baseStyles, variants[variant as keyof typeof variants])}
            >
                {loading ? 'Loading...' : (component.label || 'Button')}
            </button>
            {status === 'success' && <span className="ml-2 text-sm text-green-600">Success!</span>}
            {status === 'error' && <span className="ml-2 text-sm text-red-600">Error</span>}
        </div>
    );
}
