'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { ApiConfig } from '@/lib/types';
import ApiForm from './api-form';
import { Plus, Edit2, Trash2, Globe, Key } from 'lucide-react';

export default function ApisPage() {
    const { apis, deleteApi } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editingApi, setEditingApi] = useState<ApiConfig | undefined>(undefined);

    const handleEdit = (api: ApiConfig) => {
        setEditingApi(api);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setEditingApi(undefined);
        setIsEditing(true);
    };

    const handleClose = () => {
        setIsEditing(false);
        setEditingApi(undefined);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">API Management</h1>
                    <p className="text-gray-500 mt-1">Configure endpoints to connect with your pages.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add API
                </button>
            </div>

            {isEditing ? (
                <div className="max-w-2xl mx-auto">
                    <ApiForm
                        initialData={editingApi}
                        onSave={handleClose}
                        onCancel={handleClose}
                    />
                </div>
            ) : (
                <div className="grid gap-4">
                    {apis.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No APIs Configured</h3>
                            <p className="text-gray-500 mt-1">Get started by adding your first API endpoint.</p>
                        </div>
                    ) : (
                        apis.map((api) => (
                            <div
                                key={api.id}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center space-x-4 overflow-hidden">
                                    <div className={`p-2 rounded-lg ${api.isAuth ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {api.isAuth ? <Key className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate">{api.name}</h3>
                                        <div className="flex items-center text-sm text-gray-500 space-x-2">
                                            <span className="uppercase font-mono font-bold text-xs bg-gray-100 px-2 py-0.5 rounded">
                                                {api.method}
                                            </span>
                                            <span className="truncate">{api.url}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(api)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteApi(api.id)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
