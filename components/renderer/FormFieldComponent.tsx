'use client';

import { useEffect, useState } from 'react';
import { ComponentConfig, ApiConfig } from '@/lib/types';
import { useFormContext } from './FormContext';

interface FormFieldProps {
    component: ComponentConfig;
    api?: ApiConfig; // For fetching default values if needed
    authToken?: string | null;
    params?: Record<string, string>;
}

export default function FormFieldComponent({ component, api, authToken, params }: FormFieldProps) {
    const { formData, setFieldValue, registerField } = useFormContext();
    const fieldName = component.props?.name || `field_${component.id.slice(0, 4)}`;
    const fieldType = component.type.replace('form_', ''); // text, checkbox, etc.

    // Default Value Logic
    useEffect(() => {
        const defaultValue = component.props?.defaultValue;
        const source = component.props?.defaultValueSource || 'manual'; // 'manual' | 'api'

        if (source === 'manual' && defaultValue !== undefined) {
            registerField(fieldName, defaultValue);
        } else if (source === 'api' && api) {
            // Fetch default value from API
            // This is a simplified implementation. Ideally we should dedupe requests.
            const fetchDefault = async () => {
                try {
                    const headers: Record<string, string> = {};
                    api.headers.forEach((h) => {
                        headers[h.key] = h.value;
                    });
                    if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

                    // Interpolate URL params
                    let url = api.url;
                    if (params) {
                        Object.entries(params).forEach(([key, value]) => {
                            url = url.replace(`:${key}`, value);
                        });
                    }

                    const res = await fetch(url, { method: api.method, headers });
                    if (res.ok) {
                        const data = await res.json();
                        const path = component.props?.defaultValueJsonPath;
                        if (path) {
                            const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data);
                            if (value !== undefined) {
                                setFieldValue(fieldName, value);
                            }
                        }
                    }
                } catch (err) {
                    console.error('Failed to fetch default value', err);
                }
            };
            fetchDefault();
        } else {
            registerField(fieldName, '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [component.id, fieldName]); // Run once on mount/config change

    const value = formData[fieldName] || '';
    const required = component.props?.required as boolean || false;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {component.label || fieldName}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {fieldType === 'text' && (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setFieldValue(fieldName, e.target.value)}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}

            {fieldType === 'password' && (
                <input
                    type="password"
                    value={value}
                    onChange={(e) => setFieldValue(fieldName, e.target.value)}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}

            {fieldType === 'checkbox' && (
                <input
                    type="checkbox"
                    checked={!!value}
                    onChange={(e) => setFieldValue(fieldName, e.target.checked)}
                    required={required}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
            )}

            {fieldType === 'multi_checkbox' && (
                <div className="space-y-2">
                    {component.props?.options?.split(',').map((opt: string) => opt.trim()).filter(Boolean).map((opt: string) => (
                        <div key={opt} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={Array.isArray(value) ? value.includes(opt) : false}
                                onChange={(e) => {
                                    const current = Array.isArray(value) ? value : [];
                                    if (e.target.checked) {
                                        setFieldValue(fieldName, [...current, opt]);
                                    } else {
                                        setFieldValue(fieldName, current.filter((v: string) => v !== opt));
                                    }
                                }}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label className="ml-2 block text-sm text-gray-900">{opt}</label>
                        </div>
                    ))}
                </div>
            )}

            {fieldType === 'radio' && (
                <div className="space-y-2">
                    {component.props?.options?.split(',').map((opt: string) => opt.trim()).filter(Boolean).map((opt: string) => (
                        <div key={opt} className="flex items-center">
                            <input
                                type="radio"
                                name={fieldName}
                                value={opt}
                                checked={value === opt}
                                onChange={(e) => setFieldValue(fieldName, e.target.value)}
                                required={required}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label className="ml-2 block text-sm text-gray-900">{opt}</label>
                        </div>
                    ))}
                </div>
            )}

            {fieldType === 'select' && (
                <select
                    value={value}
                    onChange={(e) => setFieldValue(fieldName, e.target.value)}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select...</option>
                    {component.props?.options?.split(',').map((opt: string) => opt.trim()).filter(Boolean).map((opt: string) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            )}

            {fieldType === 'file' && (
                <input
                    type="file"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFieldValue(fieldName, file);
                    }}
                    required={required}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            )}
        </div>
    );
}
