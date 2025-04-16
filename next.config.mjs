/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],

  },
};

export default nextConfig;
