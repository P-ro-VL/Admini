'use client';

import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { ComponentConfig, ApiConfig } from '@/lib/types';
import { replacePlaceholders } from '@/lib/utils';

interface TableComponentProps {
    component: ComponentConfig;
    api?: ApiConfig;
    authToken?: string | null;
    params?: Record<string, string>;
    pages?: any[];
    apis?: ApiConfig[];
}

export default function TableComponent({ component, api, authToken, params, pages = [], apis = [] }: TableComponentProps) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

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
                // Assume data is an array or nested in a key
                const tableData = Array.isArray(jsonData) ? jsonData : (jsonData.data || []);
                setData(Array.isArray(tableData) ? tableData : []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [api, authToken, params]);

    const handleAction = async (action: any, row: any) => {
        console.log('handleAction called', { action, row, pages, apis });

        // Merge row data into params for substitution
        // Convert all row values to strings for replacement
        const rowParams: Record<string, string> = { ...params };
        Object.keys(row).forEach(key => {
            const val = row[key];
            if (val !== null && val !== undefined) {
                rowParams[key] = String(val);
            }
        });

        console.log('rowParams:', rowParams);

        if (action.action === 'navigate') {
            const targetPage = pages.find(p => p.id === action.targetPageId);
            console.log('Navigate action - targetPage:', targetPage);

            if (targetPage) {
                let url = targetPage.slug;
                const navParams = action.navParams || {};

                console.log('navParams before substitution:', navParams);

                Object.keys(navParams).forEach(key => {
                    const rawValue = navParams[key];
                    const resolvedValue = replacePlaceholders(rawValue, rowParams);
                    console.log(`Replacing :${key} with ${resolvedValue}`);
                    url = url.replace(`:${key}`, resolvedValue);
                });

                console.log('Final URL:', `/${url}`);
                router.push(`/${url}`);
            } else {
                console.error('Target page not found for ID:', action.targetPageId);
            }
        } else if (action.action === 'api') {
            const actionApi = apis.find(a => a.id === action.apiId);
            if (actionApi) {
                try {
                    const headers: Record<string, string> = {};
                    actionApi.headers.forEach((h) => {
                        headers[h.key] = replacePlaceholders(h.value, rowParams);
                    });

                    if (authToken) {
                        headers['Authorization'] = `Bearer ${authToken}`;
                    }

                    const isMutation = ['POST', 'PUT', 'PATCH'].includes(actionApi.method);
                    if (isMutation && actionApi.body) {
                        headers['Content-Type'] = 'application/json';
                    }

                    const url = replacePlaceholders(actionApi.url, rowParams);
                    const body = isMutation && actionApi.body ? replacePlaceholders(actionApi.body, rowParams) : undefined;

                    const res = await fetch(url, {
                        method: actionApi.method,
                        headers,
                        body,
                    });

                    if (!res.ok) throw new Error('Action failed');
                    alert('Action successful');
                    // Optionally refresh table data here
                } catch (err) {
                    console.error(err);
                    alert('Action failed');
                }
            }
        }
    };

    if (!api) return <div className="p-4 bg-yellow-50 text-yellow-700 rounded">No API connected</div>;
    if (loading) return <div className="p-8 text-center text-gray-500">Loading data...</div>;
    if (error) return <div className="p-4 bg-red-50 text-red-700 rounded">Error: {error}</div>;
    if (data.length === 0) return <div className="p-8 text-center text-gray-500">No data found</div>;

    const hiddenColumns = (component.props?.hiddenColumns || '').split(',').map((s: string) => s.trim());
    const allColumns = Object.keys(data[0] || {});
    const columns = allColumns.filter(col => !hiddenColumns.includes(col));
    const rowActions = component.props?.rowActions || [];

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{component.label || 'Data Table'}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    {col}
                                </th>
                            ))}
                            {rowActions.length > 0 && (
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, i) => (
                            <tr key={i}>
                                {columns.map((col) => (
                                    <td key={`${i}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col])}
                                    </td>
                                ))}
                                {rowActions.length > 0 && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        {rowActions.map((action: any) => (
                                            <button
                                                key={action.id}
                                                onClick={() => handleAction(action, row)}
                                                className={clsx(
                                                    "px-2 py-1 rounded text-xs font-medium transition-colors",
                                                    action.variant === 'primary' && "bg-blue-100 text-blue-700 hover:bg-blue-200",
                                                    action.variant === 'secondary' && "bg-gray-100 text-gray-700 hover:bg-gray-200",
                                                    action.variant === 'outline' && "border border-gray-300 text-gray-700 hover:bg-gray-50",
                                                    action.variant === 'danger' && "bg-red-100 text-red-700 hover:bg-red-200"
                                                )}
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
