module.exports = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: `/${process.env.NEXT_PUBLIC_BUCKET_NAME}/*`,
            }
        ]
    }
}