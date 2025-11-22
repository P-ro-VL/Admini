'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { User } from '@/lib/types';
import PublishedSidebar from './PublishedSidebar';
import PageRenderer from '../renderer/PageRenderer';

interface ClientPageWrapperProps {
    page: any;
    pages: any[];
    apis: any[];
    sidebar: any[];
    settings: any;
    params: Record<string, string>;
}

export default function ClientPageWrapper({ page, pages, apis, sidebar, settings, params }: ClientPageWrapperProps) {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            router.push('/login');
        } else {
            setCurrentUser(user);
            setIsLoading(false);
        }
    }, [router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {sidebar && sidebar.length > 0 && (
                <PublishedSidebar
                    sidebar={sidebar}
                    pages={pages}
                    appTitle={settings?.appTitle}
                    appIcon={settings?.appIcon}
                    currentUser={currentUser}
                />
            )}
            <main className="flex-1">
                <PageRenderer page={page} apis={apis} params={params} pages={pages} />
            </main>
        </div>
    );
}
