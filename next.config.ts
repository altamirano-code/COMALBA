import type { NextConfig } from "next";

/* Fotos de las publicaciones: bucket público de Supabase Storage */
const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabase ? [{ protocol: "https", hostname: supabase.hostname, pathname: "/storage/v1/object/public/**" }] : [],
  },
};
export default nextConfig;
