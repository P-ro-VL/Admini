'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, Database, FileText, Settings, User, LogOut } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { fetchData } = useStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/admin/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const navItems = [
        { href: '/admin/apis', label: 'APIs', icon: Database },
        { href: '/admin/pages', label: 'Pages', icon: FileText },
        { href: '/admin/sidebar', label: 'Sidebar', icon: LayoutDashboard },
        { href: '/admin/users', label: 'Users', icon: User },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
            {/* Sidebar - macOS style */}
            <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-sm">
                <div className="px-5 py-4 border-b border-gray-200/50">
                    <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Admini Center</h1>
                </div>
                <nav className="flex-1 px-3 py-3 space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-3 py-2 text-[13px] font-medium rounded-md transition-all duration-150 ${isActive
                                    ? 'bg-gray-200/70 text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100/60 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="w-[18px] h-[18px] mr-2.5" strokeWidth={2} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="px-3 py-3 border-t border-gray-200/50">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-[13px] font-medium text-red-600 rounded-md hover:bg-red-50 transition-all duration-150 mb-2"
                    >
                        <LogOut className="w-[18px] h-[18px] mr-2.5" strokeWidth={2} />
                        <span>Logout</span>
                    </button>
                    <div className="text-[11px] text-gray-400 text-center font-medium">
                        Version 0.1.0
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
