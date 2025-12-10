import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const formData = await request.formData();

        // BACKEND_URL should be set in environment variables.
        // Default to localhost:8000 for local development.
        const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

        const response = await fetch(`${backendUrl}/analyze`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            // Try to parse error as JSON, fallback to text
            try {
                const errorJson = await response.json();
                return NextResponse.json(errorJson, { status: response.status });
            } catch {
                const errorText = await response.text();
                return NextResponse.json(
                    { error: errorText || "Backend request failed" },
                    { status: response.status }
                );
            }
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
