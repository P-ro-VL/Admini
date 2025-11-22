import { NextResponse } from 'next/server';
import { getStorage, saveStorage } from '@/lib/storage';

export async function GET() {
    const data = await getStorage();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    await saveStorage(body);
    return NextResponse.json({ success: true });
}
