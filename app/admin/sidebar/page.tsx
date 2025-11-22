'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { SidebarItem } from '@/lib/types';
import { Plus, Trash2, ChevronRight, ChevronDown, GripVertical } from 'lucide-react';

export default function SidebarPage() {
    const { sidebar, pages, updateSidebar } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [newItem, setNewItem] = useState<{ label: string; type: 'section' | 'link'; pageId?: string }>({
        label: '',
        type: 'section',
        pageId: '',
    });
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const handleAddItem = (parentId?: string) => {
        if (!newItem.label) return;

        const item: SidebarItem = {
            id: crypto.randomUUID(),
            label: newItem.label,
            type: newItem.type,
            pageId: newItem.pageId,
            children: newItem.type === 'section' ? [] : undefined,
        };

        if (parentId) {
            // Add to section
            const newSidebar = sidebar.map((section) => {
                if (section.id === parentId) {
                    return {
                        ...section,
                        children: [...(section.children || []), item],
                    };
                }
                return section;
            });
            updateSidebar(newSidebar);
        } else {
            // Add to root
            updateSidebar([...sidebar, item]);
        }

        setNewItem({ label: '', type: 'section', pageId: '' });
        setIsAdding(false);
    };

    const handleDeleteItem = (id: string, parentId?: string) => {
        if (parentId) {
            const newSidebar = sidebar.map((section) => {
                if (section.id === parentId) {
                    return {
                        ...section,
                        children: section.children?.filter((child) => child.id !== id),
                    };
                }
                return section;
            });
            updateSidebar(newSidebar);
        } else {
            updateSidebar(sidebar.filter((item) => item.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sidebar Configuration</h1>
                    <p className="text-gray-500 mt-1">Configure the sidebar navigation for your published app.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {/* Add Section Form - Moved to top */}
                    <div className="bg-white border border-dashed border-gray-300 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Add New Section</h3>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newItem.label}
                                onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
                                placeholder="Section Name"
                                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={() => handleAddItem()}
                                disabled={!newItem.label}
                                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Section
                            </button>
                        </div>
                    </div>

                    {sidebar.map((section) => (
                        <div key={section.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="p-4 bg-gray-50 flex items-center justify-between border-b border-gray-200">
                                <div className="flex items-center font-medium text-gray-800">
                                    <GripVertical className="w-4 h-4 text-gray-400 mr-2 cursor-move" />
                                    {section.label}
                                    <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded uppercase">
                                        {section.type}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                                        className="p-1 hover:bg-gray-200 rounded"
                                    >
                                        {activeSection === section.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteItem(section.id)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {activeSection === section.id && (
                                <div className="p-4 space-y-2">
                                    {section.children?.length === 0 && (
                                        <p className="text-sm text-gray-400 italic text-center py-2">No links in this section</p>
                                    )}
                                    {section.children?.map((child) => (
                                        <div key={child.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                                            <div className="flex items-center text-sm">
                                                <span className="font-medium text-gray-700">{child.label}</span>
                                                <span className="mx-2 text-gray-300">→</span>
                                                <span className="text-gray-500">
                                                    {pages.find((p) => p.id === child.pageId)?.name || 'Unknown Page'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteItem(child.id, section.id)}
                                                className="p-1 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add Link Form */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Add Link to Section</h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Link Label"
                                                className="flex-1 px-3 py-1.5 text-sm border rounded"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        const input = e.target as HTMLInputElement;
                                                        const pageSelect = input.nextElementSibling as HTMLSelectElement;
                                                        if (input.value && pageSelect.value) {
                                                            const item: SidebarItem = {
                                                                id: crypto.randomUUID(),
                                                                label: input.value,
                                                                type: 'link',
                                                                pageId: pageSelect.value,
                                                            };
                                                            const newSidebar = sidebar.map((s) => {
                                                                if (s.id === section.id) {
                                                                    return { ...s, children: [...(s.children || []), item] };
                                                                }
                                                                return s;
                                                            });
                                                            updateSidebar(newSidebar);
                                                            input.value = '';
                                                            pageSelect.value = '';
                                                        }
                                                    }
                                                }}
                                            />
                                            <select className="flex-1 px-3 py-1.5 text-sm border rounded">
                                                <option value="">Select Page...</option>
                                                {pages.map((p) => (
                                                    <option key={p.id} value={p.id}>{p.name} (/{p.slug})</option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={(e) => {
                                                    const btn = e.target as HTMLButtonElement;
                                                    const container = btn.parentElement;
                                                    const input = container?.querySelector('input') as HTMLInputElement;
                                                    const select = container?.querySelector('select') as HTMLSelectElement;
                                                    if (input.value && select.value) {
                                                        const item: SidebarItem = {
                                                            id: crypto.randomUUID(),
                                                            label: input.value,
                                                            type: 'link',
                                                            pageId: select.value,
                                                        };
                                                        const newSidebar = sidebar.map((s) => {
                                                            if (s.id === section.id) {
                                                                return { ...s, children: [...(s.children || []), item] };
                                                            }
                                                            return s;
                                                        });
                                                        updateSidebar(newSidebar);
                                                        input.value = '';
                                                        select.value = '';
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-blue-50 p-6 rounded-xl h-fit">
                    <h3 className="font-bold text-blue-900 mb-2">How it works</h3>
                    <p className="text-sm text-blue-800 mb-4">
                        Configure the sidebar structure for your published application.
                    </p>
                    <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                        <li>Create <strong>Sections</strong> to group related pages.</li>
                        <li>Add <strong>Links</strong> inside sections to point to your pages.</li>
                        <li>The sidebar will automatically appear on all published pages.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
