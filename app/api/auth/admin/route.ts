import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json();

        const adminUsername = process.env.ADMINI_ADMIN_USERNAME || 'admini';
        const adminPassword = process.env.ADMINI_ADMIN_PASSWORD || 'admini';

        if (username === adminUsername && password === adminPassword) {
            // Create response with success
            const response = NextResponse.json({ success: true });

            // Set admin-token cookie
            // Expires in 24 hours
            const oneDay = 24 * 60 * 60 * 1000;
            response.cookies.set('admin-token', 'true', {
                httpOnly: false, // Allow client to see it if needed, but mainly for middleware
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: oneDay / 1000, // maxAge is in seconds
            });

            return response;
        }

        return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
