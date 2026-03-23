/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/public",
  //       destination: "https://notpadd.vercel.app/api/public",
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        // Compatibility: legacy content may still reference historical Supabase-hosted assets.
        // Remove after media URLs are fully migrated away from *.supabase.co.
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
