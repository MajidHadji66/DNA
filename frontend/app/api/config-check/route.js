import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Ensure this route is not cached

export async function GET() {
    return NextResponse.json({
        message: 'Configuration Diagnostic',
        apiUrl: process.env.API_URL || 'UNDEFINED',
        allKeys: Object.keys(process.env).sort(),
        timestamp: new Date().toISOString(),
    });
}
