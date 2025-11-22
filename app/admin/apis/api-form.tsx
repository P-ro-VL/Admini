'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { ApiConfig, HttpMethod } from '@/lib/types';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface ApiFormProps {
    initialData?: ApiConfig;
    onSave: () => void;
    onCancel: () => void;
}

export default function ApiForm({ initialData, onSave, onCancel }: ApiFormProps) {
    const { addApi, updateApi } = useStore();
    const [formData, setFormData] = useState<ApiConfig>({
        id: crypto.randomUUID(),
        name: '',
        url: '',
        method: 'GET',
        headers: [],
        body: '',
        isAuth: false,
        tokenPath: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            updateApi(initialData.id, formData);
        } else {
            addApi(formData);
        }
        onSave();
    };

    const addHeader = () => {
        setFormData({
            ...formData,
            headers: [...formData.headers, { key: '', value: '' }],
        });
    };

    const removeHeader = (index: number) => {
        setFormData({
            ...formData,
            headers: formData.headers.filter((_, i) => i !== index),
        });
    };

    const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
        const newHeaders = [...formData.headers];
        newHeaders[index][field] = value;
        setFormData({ ...formData, headers: newHeaders });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    {initialData ? 'Edit API' : 'Add New API'}
                </h3>
                <button
                    type="button"
                    onClick={onCancel}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Get Todos"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                        <select
                            value={formData.method}
                            onChange={(e) => setFormData({ ...formData, method: e.target.value as HttpMethod })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint URL</label>
                    <input
                        type="url"
                        required
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://api.example.com/v1/resource"
                    />
                </div>

                {/* Auth Config */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isAuth"
                        checked={formData.isAuth}
                        onChange={(e) => setFormData({ ...formData, isAuth: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isAuth" className="text-sm font-medium text-gray-700">
                        Is Authentication API?
                    </label>
                </div>

                {formData.isAuth && (
                    <div className="bg-blue-50 p-4 rounded-md">
                        <label className="block text-sm font-medium text-blue-900 mb-1">Token Path</label>
                        <input
                            type="text"
                            value={formData.tokenPath}
                            onChange={(e) => setFormData({ ...formData, tokenPath: e.target.value })}
                            className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., data.accessToken"
                        />
                        <p className="text-xs text-blue-700 mt-1">
                            Path to the token in the JSON response. Used to authenticate other requests.
                        </p>
                    </div>
                )}

                {/* Headers */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Headers</label>
                        <button
                            type="button"
                            onClick={addHeader}
                            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Header
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.headers.map((header, index) => (
                            <div key={index} className="flex space-x-2">
                                <input
                                    type="text"
                                    placeholder="Key"
                                    value={header.key}
                                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Value"
                                    value={header.value}
                                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeHeader(index)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                {['POST', 'PUT', 'PATCH'].includes(formData.method) && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Request Body (JSON)</label>
                        <textarea
                            rows={5}
                            value={formData.body}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            placeholder='{ "key": "value" }'
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save API
                </button>
            </div>
        </form>
    );
}
