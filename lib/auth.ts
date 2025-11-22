import { User } from './types';

const SESSION_KEY = 'admin_builder_session';

export interface Session {
    user: User;
    timestamp: number;
}

export function login(username: string, password: string, users: User[]): User | null {
    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        const session: Session = {
            user,
            timestamp: Date.now(),
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        // Set cookie for middleware
        document.cookie = `auth-token=${user.id}; path=/; max-age=86400; SameSite=Strict`;
        return user;
    }

    return null;
}

export function logout(): void {
    localStorage.removeItem(SESSION_KEY);
    // Remove cookie
    document.cookie = 'auth-token=; path=/; max-age=0; SameSite=Strict';
}

export function getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;

    const sessionData = localStorage.getItem(SESSION_KEY);
    if (!sessionData) return null;

    try {
        const session: Session = JSON.parse(sessionData);
        // Session expires after 24 hours
        const expirationTime = 24 * 60 * 60 * 1000;
        if (Date.now() - session.timestamp > expirationTime) {
            logout();
            return null;
        }
        return session.user;
    } catch (error) {
        console.error('Failed to parse session', error);
        return null;
    }
}

export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}

export function updateSessionUser(user: User): void {
    const session: Session = {
        user,
        timestamp: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
