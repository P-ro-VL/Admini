'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { PageConfig } from '@/lib/types';
import Editor from '@/components/editor/Editor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PageEditor() {
    const params = useParams();
    const router = useRouter();
    const { pages, updatePage } = useStore();
    const [page, setPage] = useState<PageConfig | null>(null);

    useEffect(() => {
        const foundPage = pages.find((p) => p.id === params.id);
        if (foundPage) {
            setPage(foundPage);
        } else {
            router.push('/admin/pages');
        }
    }, [params.id, pages, router]);

    if (!page) return null;

    const handleSave = (updatedPage: PageConfig) => {
        updatePage(page.id, updatedPage);
        setPage(updatedPage);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/admin/pages"
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{page.name}</h1>
                        <p className="text-xs text-gray-500">/{page.slug}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Actions could go here */}
                </div>
            </header>

            <div className="flex-1 overflow-hidden">
                <Editor page={page} onSave={handleSave} />
            </div>
        </div>
    );
}
