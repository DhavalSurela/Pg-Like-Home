import type { NextConfig } from "next";

// Allow next/image to load food photos served from Supabase Storage. Derive the
// protocol/host/port from the env URL so it works for both local Supabase
// (http://127.0.0.1:55321) and the hosted project (https://<id>.supabase.co).
const supabaseImagePatterns = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return [];
  try {
    const u = new URL(url);
    return [
      {
        protocol: u.protocol.replace(":", "") as "http" | "https",
        hostname: u.hostname,
        port: u.port || undefined,
        pathname: "/storage/v1/object/public/**",
      },
    ];
  } catch {
    return [];
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseImagePatterns,
  },
  experimental: {
    // Food-photo uploads go through a Server Action; allow files up to ~6 MB
    // (the upload action itself caps images at 5 MB).
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
