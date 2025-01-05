import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        hostname: "dgtzuqphqg23d.cloudfront.net",
      },
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    reactCompiler: true,
    dynamicIO: true,
    ppr: true,
    authInterrupts: true,
  },
}

export default nextConfig
