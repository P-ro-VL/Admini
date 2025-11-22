
import { create } from 'zustand';
import { ApiConfig, PageConfig, SidebarItem, User } from './types';

interface StoreState {
    apis: ApiConfig[];
    pages: PageConfig[];
    sidebar: SidebarItem[];
    users: User[];
    settings: { theme: 'light' | 'dark'; appTitle?: string; appIcon?: string };
    isLoading: boolean;
    fetchData: () => Promise<void>;
    addApi: (api: ApiConfig) => Promise<void>;
    updateApi: (id: string, api: ApiConfig) => Promise<void>;
    deleteApi: (id: string) => Promise<void>;
    addPage: (page: PageConfig) => Promise<void>;
    updatePage: (id: string, page: PageConfig) => Promise<void>;
    deletePage: (id: string) => Promise<void>;
    updateSidebar: (sidebar: SidebarItem[]) => Promise<void>;
    updateSettings: (settings: Partial<{ theme: 'light' | 'dark'; appTitle?: string; appIcon?: string }>) => Promise<void>;
    addUser: (user: User) => Promise<void>;
    updateUser: (id: string, user: User) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
    apis: [],
    pages: [],
    sidebar: [],
    users: [],
    settings: { theme: 'light' },
    isLoading: true,
    fetchData: async () => {
        try {
            const res = await fetch('/api/storage');
            const data = await res.json();
            let users = data.users || [];

            // Seed default admin user if no users exist
            if (users.length === 0) {
                console.log('Seeding default admin user...');
                users = [{
                    id: 'default-admin',
                    username: 'admin',
                    password: 'password',
                    email: 'admin@example.com',
                    scopes: [],
                    createdAt: new Date().toISOString()
                }];

                // Persist the seeded user
                await fetch('/api/storage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        apis: data.apis || [],
                        pages: data.pages || [],
                        sidebar: data.sidebar || [],
                        users: users,
                        settings: data.settings || { theme: 'light' }
                    }),
                });
            }

            set({
                apis: data.apis || [],
                pages: data.pages || [],
                sidebar: data.sidebar || [],
                users: users,
                settings: data.settings || { theme: 'light' },
                isLoading: false
            });
        } catch (error) {
            console.error('Failed to fetch data', error);
            set({ isLoading: false });
        }
    },
    addApi: async (api) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newApis = [...apis, api];
        set({ apis: newApis });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis: newApis, pages, sidebar, users, settings }),
        });
    },
    updateApi: async (id, api) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newApis = apis.map((a) => (a.id === id ? api : a));
        set({ apis: newApis });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis: newApis, pages, sidebar, users, settings }),
        });
    },
    deleteApi: async (id) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newApis = apis.filter((a) => a.id !== id);
        set({ apis: newApis });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis: newApis, pages, sidebar, users, settings }),
        });
    },
    addPage: async (page) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newPages = [...pages, page];
        set({ pages: newPages });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis, pages: newPages, sidebar, users, settings }),
        });
    },
    updatePage: async (id, page) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newPages = pages.map((p) => (p.id === id ? page : p));
        set({ pages: newPages });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis, pages: newPages, sidebar, users, settings }),
        });
    },
    deletePage: async (id) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newPages = pages.filter((p) => p.id !== id);
        set({ pages: newPages });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis, pages: newPages, sidebar, users, settings }),
        });
    },
    updateSidebar: async (newSidebar) => {
        const { apis, pages, users, settings } = get();
        set({ sidebar: newSidebar });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis, pages, sidebar: newSidebar, users, settings }),
        });
    },
    updateSettings: async (newSettings) => {
        const { apis, pages, sidebar, users, settings } = get();
        const updatedSettings = { ...settings, ...newSettings };
        set({ settings: updatedSettings });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis, pages, sidebar, users, settings: updatedSettings }),
        });
    },
    addUser: async (user) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newUsers = [...users, user];
        set({ users: newUsers });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis, pages, sidebar, users: newUsers, settings }),
        });
    },
    updateUser: async (id, user) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newUsers = users.map((u) => (u.id === id ? user : u));
        set({ users: newUsers });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis, pages, sidebar, users: newUsers, settings }),
        });
    },
    deleteUser: async (id) => {
        const { apis, pages, sidebar, users, settings } = get();
        const newUsers = users.filter((u) => u.id !== id);
        set({ users: newUsers });
        await fetch('/api/storage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apis, pages, sidebar, users: newUsers, settings }),
        });
    },
}));
