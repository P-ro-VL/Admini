'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarItem, PageConfig, User } from '@/lib/types';
import { ChevronRight, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { logout } from '@/lib/auth';

interface PublishedSidebarProps {
    sidebar: SidebarItem[];
    pages: PageConfig[];
    appTitle?: string;
    appIcon?: string;
    currentUser?: User | null;
}

export default function PublishedSidebar({ sidebar, pages, appTitle = 'App', appIcon, currentUser }: PublishedSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Filter sidebar based on user scopes
    const filteredSidebar = currentUser ? sidebar.filter(item => {
        // If user has access to this section
        if (currentUser.scopes.includes(item.id)) {
            // Filter children too
            if (item.children) {
                item.children = item.children.filter(child =>
                    currentUser.scopes.includes(child.id)
                );
            }
            return true;
        }
        return false;
    }) : sidebar;

    // Default all sections to open
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(
        filteredSidebar.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
    );

    const toggleSection = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
        router.refresh();
    };

    if (!filteredSidebar || filteredSidebar.length === 0) {
        return (
            <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 h-screen flex flex-col sticky top-0 shadow-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
                <div className="px-5 py-4 border-b border-gray-200/50">
                    <div className="flex items-center gap-2.5">
                        {appIcon && (
                            <img
                                src={appIcon}
                                alt="App icon"
                                className="w-7 h-7 rounded-lg object-cover shadow-sm"
                            />
                        )}
                        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{appTitle}</h1>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-[13px] text-gray-400">No accessible sections</p>
                </div>
                {currentUser && (
                    <div className="border-t border-gray-200/50 p-3">
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="w-full flex items-center space-x-2.5 p-2 rounded-md hover:bg-gray-100/60 transition-all duration-150"
                            >
                                <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-[13px] font-medium text-gray-900">{currentUser.username}</p>
                                    <p className="text-[11px] text-gray-500">{currentUser.email}</p>
                                </div>
                            </button>
                            {showUserMenu && (
                                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-lg shadow-lg">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-150"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </aside>
        );
    }

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 h-screen flex flex-col sticky top-0 shadow-sm" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif' }}>
            <div className="px-5 py-4 border-b border-gray-200/50">
                <div className="flex items-center gap-2.5">
                    {appIcon && (
                        <img
                            src={appIcon}
                            alt="App icon"
                            className="w-7 h-7 rounded-lg object-cover shadow-sm"
                        />
                    )}
                    <h1 className="text-lg font-semibold text-gray-900 tracking-tight">{appTitle}</h1>
                </div>
            </div>
            <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                {filteredSidebar.map((section) => (
                    <div key={section.id} className="mb-1">
                        {section.type === 'section' ? (
                            <>
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 rounded-md transition-all duration-150"
                                >
                                    {section.label}
                                    {openSections[section.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                                {openSections[section.id] && (
                                    <div className="mt-0.5 space-y-0.5 ml-1">
                                        {section.children?.map((child) => {
                                            const page = pages.find(p => p.id === child.pageId);
                                            const href = page ? `/${page.slug}` : '#';
                                            const isActive = pathname === href;

                                            return (
                                                <Link
                                                    key={child.id}
                                                    href={href}
                                                    className={clsx(
                                                        "block px-3 py-2 text-[13px] font-medium rounded-md transition-all duration-150",
                                                        isActive
                                                            ? "bg-gray-200/70 text-gray-900 shadow-sm"
                                                            : "text-gray-600 hover:bg-gray-100/60 hover:text-gray-900"
                                                    )}
                                                >
                                                    {child.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div />
                        )}
                    </div>
                ))}
            </nav>
            {currentUser && (
                <div className="border-t border-gray-200/50 p-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-full flex items-center space-x-2.5 p-2 rounded-md hover:bg-gray-100/60 transition-all duration-150"
                        >
                            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-[13px] font-medium text-gray-900">{currentUser.username}</p>
                                <p className="text-[11px] text-gray-500">{currentUser.email}</p>
                            </div>
                        </button>
                        {showUserMenu && (
                            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-lg shadow-lg">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-2 px-3 py-2 text-[13px] text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-150"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}
