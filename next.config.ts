import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig);

// export default nextConfig
