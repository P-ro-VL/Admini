'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { PageConfig } from '@/lib/types';
import { Plus, FileText, Trash2, ExternalLink, Layout } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PagesPage() {
    const { pages, addPage, deletePage } = useStore();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [newPage, setNewPage] = useState<Partial<PageConfig>>({
        name: '',
        slug: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPage.name || !newPage.slug) return;

        const page: PageConfig = {
            id: crypto.randomUUID(),
            name: newPage.name,
            slug: newPage.slug.startsWith('/') ? newPage.slug.slice(1) : newPage.slug,
            components: [],
        };

        addPage(page);
        setIsCreating(false);
        setNewPage({ name: '', slug: '' });
        router.push(`/admin/pages/${page.id}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Pages</h1>
                    <p className="text-gray-500 mt-1">Create and manage your application pages.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Page
                </button>
            </div>

            {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Page</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newPage.name}
                                    onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., All Todos"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (Route)</label>
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-2">/</span>
                                    <input
                                        type="text"
                                        required
                                        value={newPage.slug}
                                        onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="todos"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Create Page
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {pages.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No Pages Created</h3>
                        <p className="text-gray-500 mt-1">Start building your application by creating a page.</p>
                    </div>
                ) : (
                    pages.map((page) => (
                        <div
                            key={page.id}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{page.name}</h3>
                                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                                        <span>/{page.slug}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Link
                                    href={`/${page.slug}`}
                                    target="_blank"
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="View Live"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                                <Link
                                    href={`/admin/pages/${page.id}`}
                                    className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => deletePage(page.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
