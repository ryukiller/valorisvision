/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.coingecko.com',
                port: '',
                pathname: '/coins/**',
            },
            {
                protocol: 'https',
                hostname: 'coin-images.coingecko.com',
                port: '',
                pathname: '/coins/**',
            },
            {
                protocol: 'https',
                hostname: 'valorisvisio.top',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
