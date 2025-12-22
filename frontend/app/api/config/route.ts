import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const apiUrl = process.env.API_URL;

    // In production, we should NOT fall back to localhost
    // We returns null if not set, so the frontend can show a proper error
    if (process.env.NODE_ENV === 'production' && !apiUrl) {
        return NextResponse.json({ apiUrl: null });
    }

    return NextResponse.json({
        apiUrl: apiUrl || 'http://127.0.0.1:8000',
    });
}
