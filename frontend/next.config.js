/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NODE_ENV === 'development'
                    ? 'http://127.0.0.1:8000/:path*' // Proxy to Backend on Localhost
                    : 'http://127.0.0.1:8000/:path*', // In Cloud Run, if running in same container or sidecar. 
                // BUT: If they are separate services in Cloud Run, this destination needs to be the backend URL.
                // For the interview demo ensuring local works is priority 1.
                // For Cloud Run, usually we use the backend service URL.
                // However, simpler approach for now:
            },
        ]
    },
}

module.exports = nextConfig
