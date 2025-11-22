'use client';

import { useStore } from '@/lib/store';
import { useState } from 'react';
import { User } from '@/lib/types';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export default function UsersPage() {
    const { users, sidebar, addUser, updateUser, deleteUser } = useStore();
    const { t } = useLanguage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        scopes: [] as string[],
    });

    const handleOpenModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                email: user.email,
                password: user.password,
                scopes: user.scopes,
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                email: '',
                password: '',
                scopes: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            await updateUser(editingUser.id, {
                ...editingUser,
                ...formData,
            });
        } else {
            const newUser: User = {
                id: crypto.randomUUID(),
                ...formData,
                createdAt: new Date().toISOString(),
            };
            await addUser(newUser);
        }

        handleCloseModal();
    };

    const handleDelete = async (id: string) => {
        if (confirm(t('users.deleteConfirm'))) {
            await deleteUser(id);
        }
    };

    const toggleScope = (scopeId: string) => {
        setFormData(prev => ({
            ...prev,
            scopes: prev.scopes.includes(scopeId)
                ? prev.scopes.filter(s => s !== scopeId)
                : [...prev.scopes, scopeId]
        }));
    };

    // Get all available scopes from sidebar
    const getAllScopes = () => {
        const scopes: Array<{ id: string; label: string }> = [];
        sidebar.forEach(item => {
            scopes.push({ id: item.id, label: item.label });
            if (item.children) {
                item.children.forEach(child => {
                    scopes.push({ id: child.id, label: `${item.label} > ${child.label}` });
                });
            }
        });
        return scopes;
    };

    const availableScopes = getAllScopes();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">{t('users.title')}</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('users.addUser')}
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('users.username')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('users.email')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('users.scopes')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('users.created')}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t('users.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    {t('users.noUsers')}
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            {user.scopes.length} scopes
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(user)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit2 className="w-4 h-4 inline" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="w-4 h-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingUser ? t('users.editUser') : t('users.addUser')}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('users.username')}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('users.email')}
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('users.password')}
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('users.accessScopes')}
                                </label>
                                <div className="border border-gray-300 rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                                    {availableScopes.length === 0 ? (
                                        <p className="text-sm text-gray-500">{t('users.noScopes')}</p>
                                    ) : (
                                        availableScopes.map((scope) => (
                                            <label key={scope.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.scopes.includes(scope.id)}
                                                    onChange={() => toggleScope(scope.id)}
                                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{scope.label}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {t('users.selectScopes')}
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {editingUser ? t('users.updateUser') : t('users.createUser')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
