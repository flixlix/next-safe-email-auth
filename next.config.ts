import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        hostname: "dgtzuqphqg23d.cloudfront.net",
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
