'use client';

import { useEffect, useState } from 'react';
import { ComponentConfig, ApiConfig } from '@/lib/types';
import { replacePlaceholders } from '@/lib/utils';

interface DetailComponentProps {
    component: ComponentConfig;
    api?: ApiConfig;
    authToken?: string | null;
    params?: Record<string, string>;
}

export default function DetailComponent({ component, api, authToken, params }: DetailComponentProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!api) return;

        const fetchData = async () => {
            setLoading(true);
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

                // Interpolate URL params and Body
                const url = replacePlaceholders(api.url, params);
                const body = isMutation && api.body ? replacePlaceholders(api.body, params) : undefined;

                const res = await fetch(url, {
                    method: api.method,
                    headers,
                    body,
                });

                if (!res.ok) throw new Error('Failed to fetch data');

                const jsonData = await res.json();
                setData(jsonData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api, authToken, params]);

    if (!api) return <div className="p-4 bg-yellow-50 text-yellow-700 rounded">No API connected</div>;
    if (loading) return <div className="p-8 text-center text-gray-500">Loading details...</div>;
    if (!data) return null;

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{component.label || 'Details'}</h3>
            </div>
            <div className="px-6 py-4">
                {component.props?.displayMode === 'single' ? (
                    <div>
                        <dt className="text-sm font-medium text-gray-500 capitalize">
                            {component.props?.jsonPath || 'Value'}
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {(() => {
                                const path = component.props?.jsonPath || '';
                                const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data);

                                if (Array.isArray(value)) {
                                    return (
                                        <ul className="list-disc list-inside space-y-1">
                                            {value.map((item, index) => {
                                                let displayValue = item;
                                                if (component.props?.listItemPath) {
                                                    displayValue = component.props.listItemPath.split('.').reduce((obj: any, key: string) => obj?.[key], item);
                                                }
                                                return (
                                                    <li key={index}>
                                                        {typeof displayValue === 'object' ? JSON.stringify(displayValue) : String(displayValue ?? '')}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    );
                                }

                                return typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
                            })()}
                        </dd>
                    </div>
                ) : (
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        {Object.entries(data).map(([key, value]) => (
                            <div key={key} className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500 capitalize">{key}</dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </dd>
                            </div>
                        ))}
                    </dl>
                )}
            </div>
        </div>
    );
}
