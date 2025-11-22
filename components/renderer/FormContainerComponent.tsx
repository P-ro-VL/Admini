'use client';

import { useState, useEffect } from 'react';
import { ComponentConfig, ApiConfig } from '@/lib/types';
import FormContext from './FormContext';
import { replacePlaceholders } from '@/lib/utils';

interface FormContainerProps {
    component: ComponentConfig;
    api?: ApiConfig;
    authToken?: string | null;
    params?: Record<string, string>;
    children: React.ReactNode;
}

export default function FormContainerComponent({ component, api, authToken, params, children }: FormContainerProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const setFieldValue = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const registerField = (name: string, initialValue?: any) => {
        setFormData((prev) => {
            if (prev[name] !== undefined) return prev;
            return { ...prev, [name]: initialValue || '' };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!api) return;

        setStatus('submitting');
        try {
            const headers: Record<string, string> = {};
            api.headers.forEach((h) => {
                headers[h.key] = replacePlaceholders(h.value, params);
            });

            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }

            // Check for file objects to decide on FormData vs JSON
            const hasFile = Object.values(formData).some((val) => val instanceof File);

            let body: any;
            if (hasFile) {
                const data = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value instanceof File) {
                        data.append(key, value);
                    } else {
                        data.append(key, String(value));
                    }
                });
                body = data;
            } else {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(formData);
            }

            // Interpolate URL params
            const url = replacePlaceholders(api.url, params);

            const res = await fetch(url, {
                method: api.method,
                headers,
                body,
            });

            if (!res.ok) throw new Error('Submission failed');

            setStatus('success');
            // Optional: Reset form or keep values? Let's keep for now or maybe reset.
            // setFormData({}); 
        } catch (err) {
            setStatus('error');
            console.error(err);
        }
    };

    return (
        <FormContext.Provider value={{ formData, setFieldValue, registerField, isSubmitting: status === 'submitting' }}>
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{component.label || 'Form Container'}</h3>

                {status === 'success' && (
                    <div className="mb-4 p-4 bg-green-50 text-green-700 rounded">
                        Submitted successfully!
                    </div>
                )}

                {status === 'error' && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">
                        Submission failed. Please try again.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {children}

                    {api ? (
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 mt-4"
                        >
                            {status === 'submitting' ? 'Submitting...' : 'Submit'}
                        </button>
                    ) : (
                        <div className="text-yellow-600 text-sm mt-4">Connect an API to enable submission</div>
                    )}
                </form>
            </div>
        </FormContext.Provider>
    );
}
