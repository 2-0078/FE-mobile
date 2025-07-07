import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL('https://previews.123rf.com/**'),
      new URL('https://example.com/images/**'),
      new URL(
        'https://pieceofcake-server-images.s3.ap-northeast-2.amazonaws.com/**'
      ),
      new URL('https://kream-phinf.pstatic.net/**'),
    ],
  },
};

export default nextConfig;
