import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({
        apiUrl: process.env.API_URL || 'http://127.0.0.1:8000',
    });
}
