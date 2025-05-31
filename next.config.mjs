/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 75,
      static:30,
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "ui-avatars.com",
      },
      {
        protocol: 'https',
        hostname: '**.ufs.sh',
      },
    ],

  },
};

export default nextConfig;
