/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const apiUrl = process.env.API_URL;
        const destination = apiUrl
            ? `${apiUrl}/:path*`
            : 'http://127.0.0.1:8000/:path*';

        // DEBUGGING: Log environment variables to Cloud Run logs
        console.log('[Next.js Config] --- ENVIRONMENT DEBUG ---');
        console.log(`[Next.js Config] process.env.API_URL: '${apiUrl}'`);
        console.log(`[Next.js Config] Available Env Keys: ${Object.keys(process.env).join(', ')}`);
        console.log(`[Next.js Config] Proxying /api requests to: ${destination}`);
        console.log('[Next.js Config] -------------------------');

        return [
            {
                source: '/api/:path*',
                destination: destination,
            },
        ]
    },
}

module.exports = nextConfig
