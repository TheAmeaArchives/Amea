function getMediaRemotePatterns() {
  const patterns = [
    {
      hostname: "utfs.io",
    },
    {
      protocol: "https",
      hostname: "*.amazonaws.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ];

  const configuredMediaBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL?.trim();

  if (!configuredMediaBaseUrl) {
    return patterns;
  }

  try {
    const mediaUrl = new URL(configuredMediaBaseUrl);
    patterns.push({
      protocol: mediaUrl.protocol.replace(":", ""),
      hostname: mediaUrl.hostname,
      port: mediaUrl.port || undefined,
      pathname: `${(mediaUrl.pathname || "/").replace(/\/$/, "") || ""}/**`,
    });
  } catch {
    // Ignore invalid media base URLs here; backend env validation remains authoritative.
  }

  return patterns;
}

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
    remotePatterns: getMediaRemotePatterns(),
  },
};

export default nextConfig;
