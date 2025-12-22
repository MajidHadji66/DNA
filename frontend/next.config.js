/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const apiUrl = process.env.API_URL;

        // Only set default to localhost in development
        const isProd = process.env.NODE_ENV === 'production';
        const destination = apiUrl
            ? `${apiUrl}/:path*`
            : (isProd ? null : 'http://127.0.0.1:8000/:path*');

        if (destination) {
            console.log(`[Next.js Config] Proxying /api requests to: ${destination}`);
            return [
                {
                    source: '/api/:path*',
                    destination: destination,
                },
            ]
        }

        return [];
    },
    output: 'standalone',
}

module.exports = nextConfig
