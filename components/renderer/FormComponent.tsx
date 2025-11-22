'use client';

import { useState } from 'react';
import { ComponentConfig, ApiConfig } from '@/lib/types';

interface FormComponentProps {
    component: ComponentConfig;
    api?: ApiConfig;
    authToken?: string | null;
    params?: Record<string, string>;
}

export default function FormComponent({ component, api, authToken, params }: FormComponentProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    // Parse API body to generate form fields or use custom fields
    const apiFields = api?.body ? Object.keys(JSON.parse(api.body)) : [];
    const fields = component.props?.customFields || apiFields;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!api) return;

        setStatus('submitting');
        try {
            const headers: Record<string, string> = {};
            api.headers.forEach((h) => {
                headers[h.key] = h.value;
            });

            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }

            // Check if any field is a file upload
            const hasFile = fields.some((field: string) => component.props?.fields?.[field]?.type === 'file');

            let body: any;
            if (hasFile) {
                // Use FormData for file uploads
                const data = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (value instanceof File) {
                        data.append(key, value);
                    } else {
                        data.append(key, String(value));
                    }
                });
                body = data;
                // Do NOT set Content-Type header for FormData, browser sets it with boundary
            } else {
                // Use JSON for standard forms
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(formData);
            }

            // Interpolate URL params
            let url = api.url;
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    url = url.replace(`:${key}`, value);
                });
            }

            const res = await fetch(url, {
                method: api.method,
                headers,
                body,
            });

            if (!res.ok) throw new Error('Submission failed');

            setStatus('success');
            setFormData({});
        } catch (err) {
            setStatus('error');
            console.error(err);
        }
    };

    if (!api) return <div className="p-4 bg-yellow-50 text-yellow-700 rounded">No API connected</div>;

    return (
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{component.label || 'Form'}</h3>

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
                {fields.length > 0 ? (
                    fields.map((field: string) => {
                        const fieldConfig = component.props?.fields?.[field] || { type: 'text' };

                        return (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                    {field}
                                </label>

                                {fieldConfig.type === 'text' && (
                                    <input
                                        type="text"
                                        value={formData[field] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}

                                {fieldConfig.type === 'checkbox' && (
                                    <input
                                        type="checkbox"
                                        checked={!!formData[field]}
                                        onChange={(e) => setFormData({ ...formData, [field]: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                )}

                                {fieldConfig.type === 'radio' && (
                                    <div className="space-y-2">
                                        {(() => {
                                            const opts = Array.isArray(fieldConfig.options)
                                                ? fieldConfig.options
                                                : (fieldConfig.options || '').split(',').map((s: string) => s.trim()).filter(Boolean);

                                            return opts.map((opt: string) => (
                                                <div key={opt} className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name={field}
                                                        value={opt}
                                                        checked={formData[field] === opt}
                                                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    />
                                                    <label className="ml-2 block text-sm text-gray-900">{opt}</label>
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                )}

                                {fieldConfig.type === 'select' && (
                                    <select
                                        value={formData[field] || ''}
                                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select...</option>
                                        {(() => {
                                            const opts = Array.isArray(fieldConfig.options)
                                                ? fieldConfig.options
                                                : (fieldConfig.options || '').split(',').map((s: string) => s.trim()).filter(Boolean);

                                            return opts.map((opt: string) => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ));
                                        })()}
                                    </select>
                                )}

                                {fieldConfig.type === 'file' && (
                                    <input
                                        type="file"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setFormData({ ...formData, [field]: file });
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-gray-500 italic">No fields detected from API body template.</div>
                )}

                <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {status === 'submitting' ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}
